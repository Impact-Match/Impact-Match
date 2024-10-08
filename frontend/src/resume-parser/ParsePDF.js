import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { isBold, isUppercase } from './utils';
import { extractProfile } from './extractProfile';
import { extractEducation } from './extractEducation';
import { extractWorkExperience } from './extractWorkExperience';
import { extractProject } from './extractProject';
import { extractSkills } from './extractSkills';

// 初始化 pdf.js
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

async function parseResumePDF(pdfFile) {
  console.log('Starting to parse PDF:', pdfFile);  // Log the file object
  const pdfData = await pdfFile.arrayBuffer();
  const pdf = await getDocument({ data: pdfData }).promise;
  console.log('PDF loaded successfully, number of pages:', pdf.numPages);  // Log the number of pages
  const textItems = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    console.log(`Processing page ${pageNum}...`);
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    console.log(`Text content extracted from page ${pageNum}:`, textContent.items);  // Log the extracted text items

    // Collect each page's text items
    textContent.items.forEach((item) => {
      textItems.push({
        text: item.str,
        x: item.transform[4],  // x position
        y: item.transform[5],  // y position
        width: item.width,     // Text width
        fontSize: item.height, // Font size
        hasEOL: item.hasEOL,   // End-of-line flag
      });
    });
  }

  console.log('Text items extracted:', textItems);  // Log all text items

  // Step 2: Group text items into lines
  const lines = groupTextItemsIntoLines(textItems);
  console.log('Text items grouped into lines:', lines);  // Log the grouped lines

  // Step 3: Group lines into sections
  const sections = groupLinesIntoSections(lines);
  console.log('Lines grouped into sections:', sections);  // Log the grouped sections

  // Step 4: Extract specific information from the resume sections
  const profile = extractProfile(sections);
  const educations = extractEducation(sections); 
  const workExperiences = extractWorkExperience(sections); 
  const projects = extractProject(sections);
  const skills = extractSkills(sections);

  return { profile, educations, workExperiences, projects, skills }; 
}

function groupTextItemsIntoLines(textItems) {
  const lines = [];
  let currentLine = [];

  console.log('Starting to group text items into lines...');

  // Step 1: Group text items into lines based on hasEOL
  textItems.forEach((item) => {
    if (item.hasEOL) {
      if (item.text.trim() !== "") {
        currentLine.push({ ...item });
      }
      lines.push(currentLine);  // Push the current line to lines
      currentLine = [];  // Start a new line
    } else if (item.text.trim() !== "") {
      currentLine.push({ ...item });
    }
  });

  // Add the last line if it has any items
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Step 2: Merge adjacent text items if their distance is smaller than a typical character width
  const typicalCharWidth = getTypicalCharWidth(textItems);

  lines.forEach((line) => {
    for (let i = line.length - 1; i > 0; i--) {
      const currentItem = line[i];
      const leftItem = line[i - 1];
      const leftItemXEnd = leftItem.x + leftItem.width;
      const distance = currentItem.x - leftItemXEnd;

      if (distance <= typicalCharWidth) {
        if (shouldAddSpaceBetweenText(leftItem.text, currentItem.text)) {
          leftItem.text += " ";  // Add space between adjacent items if needed
        }
        leftItem.text += currentItem.text;  // Merge the current item text to the left item

        // Update leftItem's width after merging the currentItem
        const currentItemXEnd = currentItem.x + currentItem.width;
        leftItem.width = currentItemXEnd - leftItem.x;

        // Remove the merged current item from the line
        line.splice(i, 1);
      }
    }
  });

  console.log('Lines created:', lines);  // Log the created lines
  return lines;
}

// Helper function to calculate the typical character width
function getTypicalCharWidth(textItems) {
  const widths = textItems.map(item => item.width / item.text.length);
  const averageWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
  return averageWidth;
}

// Helper function to determine if a space should be added between two text items
function shouldAddSpaceBetweenText(leftText, currentText) {
  // Example logic: Add a space if the left text does not end with punctuation and currentText does not start with punctuation
  const punctuation = [".", ",", ":", ";", "!", "?"];
  return !punctuation.includes(leftText.slice(-1)) && !punctuation.includes(currentText[0]);
}

function groupLinesIntoSections(lines) {
  const sections = {};
  let currentSection = "profile";
  let sectionLines = [];

  console.log('Starting to group lines into sections...');
  
  lines.forEach((line, i) => {
    const text = line[0]?.text?.trim();  // Safely extract the text of the first item in the line

    if (isSectionTitle(line, i)) {  // Pass the entire line and its index to isSectionTitle
      console.log('New section found:', text);  // Log the section title
      sections[currentSection] = [...sectionLines];  // Save the previous section's lines
      currentSection = text;  // Set the new section name
      sectionLines = [];  // Reset lines for the new section
    } else {
      sectionLines.push(line); 
    }
  });

  // Add any remaining lines to the last section
  if (sectionLines.length > 0) {
    sections[currentSection] = [...sectionLines];
  }

  console.log('Sections created:', sections);  // Log the created sections
  return sections;
}

// Keywords for identifying section titles
const SECTION_TITLE_PRIMARY_KEYWORDS = [
  "experience",
  "education",
  "project",
  "skill",
];
const SECTION_TITLE_SECONDARY_KEYWORDS = [
  "job",
  "course",
  "extracurricular",
  "objective",
  "summary", // LinkedIn generated resume has a summary section
  "award",
  "honor",
  "project",
];
const SECTION_TITLE_KEYWORDS = [
  ...SECTION_TITLE_PRIMARY_KEYWORDS,
  ...SECTION_TITLE_SECONDARY_KEYWORDS,
];

// Utility functions to replace isBold, isUppercase, etc.
function hasLetterAndIsAllUpperCase(text) {
  return /[A-Z]/.test(text) && text === text.toUpperCase();
}

function hasOnlyLettersSpacesAmpersands(text) {
  return /^[A-Za-z\s&]+$/.test(text);
}

function isSectionTitle(line, lineNumber) {
  const isFirstTwoLines = lineNumber < 2;
  const hasMoreThanOneItemInLine = Array.isArray(line) && line.length > 1;
  const hasNoItemInLine = !Array.isArray(line) || line.length === 0;

  // First level checks (ignore if the line is too early or has multiple elements)
  if (isFirstTwoLines || hasMoreThanOneItemInLine || hasNoItemInLine) {
    console.log(
      `Not a section title - early line or multiple/no items. LineNumber: ${lineNumber}, Line content: ${Array.isArray(line) ? line.map(item => item.text).join(' ') : line}`
    );
    return false;
  }

  const textItem = line[0]?.text?.trim();  // Extract the text and ensure it's a string
  if (!textItem) {
    console.log(`Line ${lineNumber} does not contain valid text.`);
    return false;
  }

  console.log(`Checking line ${lineNumber}: "${textItem}"`);

  // Check if the text is bold and all uppercase
  if (isBold(line[0]) && hasLetterAndIsAllUpperCase(textItem)) {
    console.log(`Detected bold and all uppercase - this is a section title. LineNumber: ${lineNumber}, Text: "${textItem}"`);
    return true;
  }

  // Fallback check based on keyword matching and capital letter checks
  const textHasAtMost2Words = textItem.split(" ").filter((s) => s !== "&").length <= 2;
  const startsWithCapitalLetter = /^[A-Z]/.test(textItem.slice(0, 1));

  if (
    textHasAtMost2Words &&
    hasOnlyLettersSpacesAmpersands(textItem) &&
    startsWithCapitalLetter &&
    SECTION_TITLE_KEYWORDS.some((keyword) => textItem.toLowerCase().includes(keyword))
  ) {
    console.log(`Detected keyword-based section title. LineNumber: ${lineNumber}, Text: "${textItem}"`);
    return true;
  }

  console.log(`Not a section title - no conditions met. LineNumber: ${lineNumber}, Text: "${textItem}"`);
  return false;
}

export async function parseResume(file) {
  try {
    console.log('Starting resume parsing for file:', file);
    const resume = await parseResumePDF(file);
    console.log('Resume parsed successfully:', resume);  // Log successful parse
    return resume;
  } catch (error) {
    console.error('Error parsing resume:', error);  // Log the error
    throw error;  // Rethrow the error if you want it to propagate further
  }
}

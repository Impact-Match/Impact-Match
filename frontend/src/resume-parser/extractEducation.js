import { getSectionLinesByKeywords } from '../lib/get-section-lines';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from '../lib/bullet-points';

// Keywords for identifying education-related information
const SCHOOLS = ['College', 'University', 'Institute', 'School', 'Academy', 'BASIS', 'Magnet'];
const DEGREES = ["Associate", "Bachelor", "Master", "PhD", "Ph."];
const GPA_REGEX = /[0-4]\.\d{1,2}/;

// Helper functions to identify school, degree, and GPA
const hasSchool = (item) => {
  return item && item.text && SCHOOLS.some((school) => item.text.includes(school));
};

const hasDegree = (item) => {
  return item && item.text && (DEGREES.some((degree) => item.text.includes(degree)) || /[ABM][A-Z\.]/.test(item.text));
};

const matchGPA = (item) => {
  return item && item.text && GPA_REGEX.test(item.text);
};

export const extractEducation = (sections) => {
    const educations = [];
    const lines = getSectionLinesByKeywords(sections, ["education"]);
  
    // Step 1: Log the extracted education-related lines
    console.log("Extracted lines for education:", lines);
  
    let currentEducation = null;
    let descriptions = [];
  
    // Process each line and divide based on the presence of a school name
    lines.flat().forEach((line, index) => {
      const textItems = line;
  
      // Log the current line being processed
      console.log(`Processing line ${index + 1}:`, textItems);
  
      // Check if this line contains a school name
      const school = textItems.find(hasSchool)?.text;
  
      if (school) {
        // If a new school is found, save the previous education and start a new one
        if (currentEducation) {
          currentEducation.descriptions = descriptions.length ? descriptions : [];
          educations.push(currentEducation); // Save the current education
          console.log("Saved education:", currentEducation);
        }
  
        // Initialize a new education record for the new school
        currentEducation = {
          school,
          degree: textItems.find(hasDegree)?.text || 'Unknown Degree',
          gpa: textItems.find(matchGPA)?.text || 'N/A',
          date: textItems.find(item => item && item.text && /\d{4}/.test(item.text))?.text || 'Unknown Date',
        };
        descriptions = []; // Reset descriptions for the new section
  
        console.log("Started new education record:", currentEducation);
      } else {
        // If no school is found, treat this line as part of the descriptions or additional details
        const descriptionsLineIdx = getDescriptionsLineIdx([line]);
        if (descriptionsLineIdx !== undefined) {
          descriptions = descriptions.concat(getBulletPointsFromLines([line]));
          console.log("Updated descriptions:", descriptions);
        }
      }
    });
  
    // After finishing the loop, ensure the last education record is saved
    if (currentEducation) {
      currentEducation.descriptions = descriptions.length ? descriptions : [];
      educations.push(currentEducation);
      console.log("Saved final education:", currentEducation);
    }
  
    // Step 8: Log the final extracted education data
    console.log("Final extracted education data:", educations);
  
    // Return the educations array, each entry representing a school
    return educations;
  };
import { getSectionLinesByKeywords } from '../lib/get-section-lines';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from '../lib/bullet-points';

// Keywords for identifying work experience-related sections
const WORK_EXPERIENCE_KEYWORDS_LOWERCASE = ['work', 'experience', 'employment', 'history', 'job'];
const JOB_TITLES = ['Accountant', 'Administrator', 'Advisor', 'Agent', 'Analyst', 'Architect', 'Assistant', 'Associate', 'Auditor', 'Consultant', 'Coordinator', 'Developer', 'Designer', 'Director', 'Engineer', 'Intern', 'Manager', 'Technician'];

// Helper functions for identifying job titles, dates, and companies
const hasJobTitle = (item) => {
  // Ensure item.text is defined and is a string before using it
  return item && item.text && JOB_TITLES.some((jobTitle) => 
    item.text.split(/\s/).some((word) => word === jobTitle)
  );
};

const hasNumber = (item) => item && item.text && /\d/.test(item.text);

// Helper function to identify company names
const isCompany = (item, jobTitle, date) => {
  return (
    item &&
    item.text &&
    !hasJobTitle(item) && // Not a job title
    item.text !== jobTitle && // Not the same as the job title
    item.text !== date && // Not the same as the date
    !/[!@#\$%\^&\*\(\)\+=\[\]\{\};:"<>\?\/\\|`~]/.test(item.text) && // Does not contain unusual symbols
    item.text.length >= 5 // Must have at least 5 characters
  );
};

// Main extractWorkExperience function
export const extractWorkExperience = (sections) => {
  const workExperiences = [];
  const lines = getSectionLinesByKeywords(sections, WORK_EXPERIENCE_KEYWORDS_LOWERCASE);
  
  // Process each line to identify and extract work experience sections based on job title
  let currentWorkExperience = null;
  let descriptions = [];

  lines.flat().forEach((line, index) => {
    const textItems = line;

    // Log the current line being processed
    console.log(`Processing line ${index + 1}:`, textItems);

    // Check if this line contains a job title
    const jobTitle = textItems.find(hasJobTitle)?.text;
    const date = textItems.find(hasNumber)?.text;
    const company = textItems.find(item => isCompany(item, jobTitle, date))?.text;

    if (jobTitle) {
      // If a new job title is found, save the previous work experience and start a new one
      if (currentWorkExperience) {
        currentWorkExperience.descriptions = descriptions.length ? descriptions : [];
        workExperiences.push(currentWorkExperience); // Save the current work experience
        console.log("Saved work experience:", currentWorkExperience);
      }

      // Initialize a new work experience record for the new job title
      currentWorkExperience = {
        jobTitle,
        company: company || 'Unknown Company',
        date: date || 'Unknown Date',
      };
      descriptions = []; // Reset descriptions for the new section

      console.log("Started new work experience record:", currentWorkExperience);
    } else if (currentWorkExperience) {
      // If no job title is found and we have a current work experience, treat this line as part of the descriptions or additional details
      const descriptionsLineIdx = getDescriptionsLineIdx([line]);
      if (descriptionsLineIdx !== undefined) {
        descriptions = descriptions.concat(getBulletPointsFromLines([line]));
        console.log("Updated descriptions:", descriptions);
      }
    }
  });

  // After finishing the loop, ensure the last work experience record is saved
  if (currentWorkExperience) {
    currentWorkExperience.descriptions = descriptions.length ? descriptions : [];
    workExperiences.push(currentWorkExperience);
    console.log("Saved final work experience:", currentWorkExperience);
  }

  // Log the final extracted work experience data
  console.log("Final extracted work experience data:", workExperiences);

  // Return the workExperiences array, each entry representing a work experience
  return workExperiences;
};
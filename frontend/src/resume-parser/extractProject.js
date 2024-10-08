import { getSectionLinesByKeywords } from '../lib/get-section-lines';
import { divideSectionIntoSubsections } from '../lib/subsections';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from '../lib/bullet-points';

export const extractProject = (sections) => {
  const projects = []; // Array to hold extracted projects
  const lines = getSectionLinesByKeywords(sections, ["project"]); // Find project-related lines

  // Divide the section into subsections (each subsection represents a project)
  const subsections = divideSectionIntoSubsections(lines);

  // Loop through each subsection to extract relevant information
  subsections.forEach((subsectionLines) => {
    // Identify the description lines (usually bullet points)
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 1;

    // Extract text items before descriptions (e.g., project name, date)
    const subsectionInfoTextItems = subsectionLines.slice(0, descriptionsLineIdx).flat();

    // Extract date (assuming it contains numbers, e.g., year)
    const date = subsectionInfoTextItems.find(item => item.text && /\d{4}/.test(item.text))?.text || 'Unknown Date';

    // Extract project name (assuming it is bold)
    const project = subsectionInfoTextItems.find(item => item.fontWeight === 'bold')?.text || 'Unknown Project';

    // Extract descriptions (bullet points)
    const descriptionsLines = subsectionLines.slice(descriptionsLineIdx);
    const descriptions = getBulletPointsFromLines(descriptionsLines);

    // Add the extracted project information to the projects array
    projects.push({ project, date, descriptions });
  });

  // 直接返回 projects 数组，取消外层嵌套
  return projects;
};
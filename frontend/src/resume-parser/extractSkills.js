import { getSectionLinesByKeywords } from '../lib/get-section-lines';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from '../lib/bullet-points';

// Helper: 初始化技能对象
const initialFeaturedSkills = [
  { skill: '' },
  { skill: '' },
  { skill: '' },
  { skill: '' },
  { skill: '' },
  { skill: '' },
];

// Main function to extract skills
export const extractSkills = (sections) => {
  // Step 1: Find lines containing skills using keywords
  const lines = getSectionLinesByKeywords(sections, ["skill"]);

  // Step 2: Identify the index of description lines (usually bullet points)
  const descriptionsLineIdx = getDescriptionsLineIdx(lines) ?? 0;
  const descriptionsLines = lines.slice(descriptionsLineIdx);

  // Step 3: Extract descriptions (bullet points)
  const descriptions = getBulletPointsFromLines(descriptionsLines);

  // Step 4: Initialize featured skills
  const featuredSkills = [...initialFeaturedSkills];

  // Step 5: If there are lines before description lines, extract featured skills
  if (descriptionsLineIdx !== 0) {
    const featuredSkillsLines = lines.slice(0, descriptionsLineIdx);
    const featuredSkillsTextItems = featuredSkillsLines
      .flat()
      .filter((item) => item.text.trim())
      .slice(0, 6); // Limit to the first 6 skills

    // Assign text to featured skills
    for (let i = 0; i < featuredSkillsTextItems.length; i++) {
      featuredSkills[i].skill = featuredSkillsTextItems[i].text;
    }
  }

  // Step 6: Return extracted skills without additional nesting
  return {
    featuredSkills,
    descriptions,
  };
};
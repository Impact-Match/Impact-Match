export const getSectionLinesByKeywords = (sections, keywords) => {
    const result = [];
  
    for (const [sectionName, lines] of Object.entries(sections)) {
      if (keywords.some(keyword => sectionName.toLowerCase().includes(keyword))) {
        result.push(lines);
      }
    }
  
    return result;
  };
  
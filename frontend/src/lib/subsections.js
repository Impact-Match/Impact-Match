import { isBold } from './common-features';
import { BULLET_POINTS } from './bullet-points';

/**
 * Divide lines into subsections based on the line gap or bold text.
 *
 * This function helps to divide a section (like education or work experience) into subsections
 * (like different schools or jobs) based on line spacing or bold text.
 */
export const divideSectionIntoSubsections = (lines) => {
  // Primary heuristic: determine a subsection by checking if the line gap is larger than the typical gap * 1.6
  const isLineNewSubsectionByLineGap = createIsLineNewSubsectionByLineGap(lines);

  let subsections = createSubsections(lines, isLineNewSubsectionByLineGap);

  // Log to see if subsections are over-splitting
  console.log("Subsections after line gap analysis:", subsections);

  // Fallback heuristic: if the line gap-based method results in too many subsections,
  // we apply the bold text heuristic.
  if (subsections.length > 2) {  // Adjust based on your expected number of subsections
    const isLineNewSubsectionByBold = (line, prevLine) => {
      if (
        !isBold(prevLine[0]) && // Previous line is not bold
        isBold(line[0]) && // Current line is bold
        !BULLET_POINTS.includes(line[0].text) // Ignore bullet points
      ) {
        return true;
      }
      return false;
    };

    subsections = createSubsections(lines, isLineNewSubsectionByBold);
    console.log("Subsections after applying bold heuristic:", subsections);
  }

  return subsections;
};

/**
 * Function to calculate if there is a new subsection based on line gap.
 */
const createIsLineNewSubsectionByLineGap = (lines) => {
    const lineGapToCount = {};
    const linesY = lines
      .map((line, index) => {
        if (!line[0] || typeof line[0].y !== "number") {
          console.log(`Line ${index} has an invalid y-coordinate:`, line);
          return null;
        }
        return line[0].y;
      })
      .filter((y) => y !== null);
  
    console.log("Y positions of lines:", linesY); // 打印所有行的 Y 坐标，检查是否合理
  
    let lineGapWithMostCount = 0;
    let maxCount = 0;
  
    // Calculate the line gaps between each consecutive line and count the occurrences
    for (let i = 1; i < linesY.length; i++) {
      const lineGap = Math.abs(Math.round(linesY[i - 1] - linesY[i]));  // 使用绝对值
      console.log(`Line ${i}: gap=${lineGap}`);  // 打印每两行之间的 gap
  
      if (!lineGapToCount[lineGap]) {
        lineGapToCount[lineGap] = 0;
      }
      lineGapToCount[lineGap] += 1;
  
      // Keep track of the most common line gap
      if (lineGapToCount[lineGap] > maxCount) {
        lineGapWithMostCount = lineGap;
        maxCount = lineGapToCount[lineGap];
      }
    }
  
    // Log the most common line gap to see if it's reasonable
    console.log("Most common line gap:", lineGapWithMostCount);
  
    // Use the most common line gap as a threshold to determine a new subsection (adjust sensitivity)
    const subsectionLineGapThreshold = lineGapWithMostCount * 1.6;
  
    // Function to check if a line starts a new subsection based on the line gap
    const isLineNewSubsection = (line, prevLine) => {
      const gap = Math.abs(Math.round(prevLine[0].y - line[0].y)); // 使用绝对值
      const result = gap > subsectionLineGapThreshold;
      
      // Log gap and result for each line comparison
      console.log(`Comparing line gaps: gap=${gap}, threshold=${subsectionLineGapThreshold}, new subsection=${result}`);
      
      return result;
    };
  
    return isLineNewSubsection;
};   

/**
 * Function to divide the lines into subsections.
 * The division is based on the provided heuristic function (`isLineNewSubsection`).
 */
const createSubsections = (lines, isLineNewSubsection) => {
  const subsections = [];
  let subsection = [];

  // Loop through each line and divide based on the heuristic
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // For the first line, add it to the current subsection and continue
    if (i === 0) {
      subsection.push(line);
      continue;
    }

    // Check if the current line should start a new subsection
    if (isLineNewSubsection(line, lines[i - 1])) {
      subsections.push(subsection); // Push the current subsection to the list
      subsection = []; // Start a new subsection
    }

    subsection.push(line); // Add the line to the current subsection
  }

  // Push the last subsection if there are any remaining lines
  if (subsection.length > 0) {
    subsections.push(subsection);
  }

  return subsections;
};
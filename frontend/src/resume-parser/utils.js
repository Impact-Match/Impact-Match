export function isBold(textItem) {
    return textItem?.fontName?.toLowerCase().includes("bold") || false;
}
  
  
export function isUppercase(text) {
    return text === text.toUpperCase();
}
  
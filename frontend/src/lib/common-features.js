// common-features.js

/**
 * 判断文本是否加粗（这里用字体大小作为一个简单的判断标准）
 * @param {Object} textItem - 文本项
 * @returns {Boolean} - 是否加粗
 */
export const isBold = (textItem) => {
  return textItem?.fontName?.toLowerCase().includes("bold") || false;
};
  
  /**
   * 判断文本是否包含数字
   * @param {Object} textItem - 文本项
   * @returns {Boolean} - 是否包含数字
   */
  export const hasNumber = (textItem) => {
    return /\d/.test(textItem.text);
  };
  
  /**
   * 判断文本是否包含逗号
   * @param {Object} textItem - 文本项
   * @returns {Boolean} - 是否包含逗号
   */
  export const hasComma = (textItem) => {
    return textItem.text.includes(',');
  };
  
  /**
   * 判断文本是否包含字母
   * @param {Object} textItem - 文本项
   * @returns {Boolean} - 是否包含字母
   */
  export const hasLetter = (textItem) => {
    return /[a-zA-Z]/.test(textItem.text);
  };
  
  /**
   * 判断文本是否全为大写字母
   * @param {Object} textItem - 文本项
   * @returns {Boolean} - 是否全部为大写字母
   */
  export const hasLetterAndIsAllUpperCase = (textItem) => {
    const letters = textItem.text.replace(/[^a-zA-Z]/g, ''); // 去除非字母字符
    return letters && letters === letters.toUpperCase();
  };  
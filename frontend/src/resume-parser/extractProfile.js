import { getSectionLinesByKeywords } from '../lib/get-section-lines';
import {
  isBold,
  hasLetterAndIsAllUpperCase,
} from '../lib/common-features';

// Name
const matchOnlyLetterSpaceOrPeriod = (item) => /^[a-zA-Z\s\.]+$/.test(item.text);

// Email
const matchEmail = (item) => /\S+@\S+\.\S+/.test(item.text);
const hasAt = (item) => item.text.includes('@');

// Phone
const matchPhone = (item) => /\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(item.text);
const hasParenthesis = (item) => /\([0-9]+\)/.test(item.text);

// Location
const matchCityAndState = (item) => /[A-Z][a-zA-Z\s]+, [A-Z]{2}/.test(item.text);

// Url
const matchUrl = (item) => /\S+\.[a-z]+\/\S+/.test(item.text);
const matchUrlHttpFallback = (item) => /https?:\/\/\S+\.\S+/.test(item.text);
const matchUrlWwwFallback = (item) => /www\.\S+\.\S+/.test(item.text);
const hasSlash = (item) => item.text.includes('/');

// Summary
const has4OrMoreWords = (item) => item.text.split(' ').length >= 4;

// extractProfile 函数实现
export const extractProfile = (sections) => {
  const lines = sections.profile || [];
  const textItems = lines.flat();

  // 匹配姓名
  const name = textItems.find(
    (item) =>
      matchOnlyLetterSpaceOrPeriod(item) &&
      (isBold(item) || hasLetterAndIsAllUpperCase(item) || item.fontSize >= 14));

  // 匹配邮箱
  const email = textItems.find((item) => matchEmail(item))?.text || 'Unknown Email';

  // 匹配电话
  const phone = textItems.find((item) => matchPhone(item))?.text || 'Unknown Phone';

  // 匹配地址
  const location = textItems.find((item) => matchCityAndState(item))?.text || 'Unknown Location';

  // 匹配网址
  const url = textItems.find((item) =>
    matchUrl(item) || matchUrlHttpFallback(item) || matchUrlWwwFallback(item)
  )?.text || 'Unknown Url';

  // 匹配简历摘要
  const summaryLines = getSectionLinesByKeywords(sections, ['summary']);
  const summarySection = summaryLines
    .flat()
    .map((textItem) => textItem.text)
    .join(' ');
  const objectiveLines = getSectionLinesByKeywords(sections, ['objective']);
  const objectiveSection = objectiveLines
    .flat()
    .map((textItem) => textItem.text)
    .join(' ');
  const summary = summarySection || objectiveSection || textItems.find(has4OrMoreWords)?.text || '';

  return {
      name,
      email,
      phone,
      location,
      url,
      summary,
  };
};
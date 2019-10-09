const moment = require('moment');

module.exports = (fields, level) =>
  Object.entries(fields).reduce((acc, subField, index) => {
    const [subFieldName, subFieldValue] = subField;
    let newLine = '';

    if (
      typeof subFieldValue === 'object' &&
      Object.keys(subFieldValue).length
    ) {
      newLine = `
${subFieldName}: ${Object.entries(subFieldValue).reduce(
        (sentence, field) =>
          sentence.concat(`
    ${field[0]}: ${field[1]}`),
        ''
      )}`;
    } else if (typeof subFieldValue === 'string') {
      newLine = `
${subFieldName}: ${subFieldValue}`;
    }

    if (index === Object.entries(fields).length - 1) {
      newLine += `
timestamp: ${moment.utc()}
level: ${level}`;
    }

    return newLine ? acc.concat(newLine) : acc;
  }, '');

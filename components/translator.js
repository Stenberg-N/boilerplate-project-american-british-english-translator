const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const britishToAmericanSpelling = Object.fromEntries(
  Object.entries(americanToBritishSpelling).map(([am, br]) => [br, am])
);

const britishToAmericanTitles = Object.fromEntries(
  Object.entries(americanToBritishTitles).map(([am, br]) => [br, am + '.'])
);

class Translator {
  translate(text, locale) {
    let translated = text;
    let hasTranslation = false;

    let dict = {};
    let timeRegex;
    let timeReplacement;

    if (locale === 'american-to-british') {
      dict = {
        ...americanToBritishSpelling,
        ...americanOnly,
        ...Object.fromEntries(
          Object.entries(americanToBritishTitles).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()])
        )
      };
      timeRegex = /(\d{1,2}):(\d{2})(?=\D|$)/g;
      timeReplacement = '$1.$2';
    } else {
      dict = {
        ...britishToAmericanSpelling,
        ...britishOnly,
        ...Object.fromEntries(
          Object.entries(britishToAmericanTitles).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()])
        )
      };
      timeRegex = /(\d{1,2}).(\d{2})(?=\D|$)/g;
      timeReplacement = '$1:$2';
    }

    const keys = Object.keys(dict).sort((a, b) => b.length - a.length);

    for (const key of keys) {
      const keyEscaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${keyEscaped}\\b`, 'gi');

      if (regex.test(translated)) hasTranslation = true;

      translated = translated.replace(regex, (match) => {
        let replacement = dict[key];

        if (match[0] == match[0].toUpperCase()) {
          replacement = replacement.chartAt(0).toUpperCase() + replacement.slice(1);
        }

        if (match === match.toUpperCase()) {
          replacement = replacement.toUpperCase();
        }

        return `<span class="highlight">${replacement}</span>`;
      });
    }

    if (timeRegex.test(translated)) {
      hasTranslation = true;
      translated = translated.replace(timeRegex, `<span class="highlight">${timeReplacement}</span>`);
    }

    if (!hasTranslation) {
      return "Everything looks good to me!";
    }

    return translated;
  }

}

module.exports = Translator;

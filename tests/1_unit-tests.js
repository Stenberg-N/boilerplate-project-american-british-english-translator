const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
let translator = new Translator();

suite('Unit Tests', () => {

  test("Translate 'Mangoes are my favorite fruit' to British English", function(done) {
    const text = 'Mangoes are my favorite fruit';
    const locale = 'american-to-british';
    const translation = translator.translate(text, locale);

    assert.equal(translation, 'Mangoes are my <span class="highlight">favourite</span> fruit');

    done();
  });

});

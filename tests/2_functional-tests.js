const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  test("Test POST request with text and locale fields", function(done) {
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'I ate yogurt for breakfast.',
        locale: 'american-to-british'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);

        assert.equal(res.body.translation, "I ate <span class='highlight'>yoghurt</span> for breakfast.");

        done();
      });
  });

  test("Test POST request with text field and invalid locale field", function(done) {
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'I ate yogurt for breakfast.',
        locale: 'invalid-locale'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);

        assert.deepEqual(res.body, { error: 'Invalid value for locale field' });

        done();
      });
  });

  test("Test POST request with missing text field", function(done) {
    chai
      .request(server)
      .post('/api/translate')
      .send({
        locale: 'american-to-british'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);

        assert.deepEqual(res.body, { error: 'Required field(s) missing' });

        done();
      });
  });

  test("Test POST request with missing locale field", function(done) {
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'I ate yogurt for breakfast.',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);

        assert.deepEqual(res.body, { error: 'Required field(s) missing' });

        done();
      });
  });

  test("Test POST request with empty text field", function(done) {
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: '',
        locale: 'american-to-british'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);

        assert.deepEqual(res.body, { error: 'No text to translate' });

        done();
      });
  });

  test("Test POST request with text that needs no translation", function(done) {
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'I ate yoghurt for breakfast.',
        locale: 'american-to-british'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);

        assert.equal(res.body.translation, "Everything looks good to me!");

        done();
      });
  });

});

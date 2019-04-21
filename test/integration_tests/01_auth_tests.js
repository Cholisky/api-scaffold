const { expect } = require('chai');
const jwt = require('jsonwebtoken');
let request = require('supertest');
const get = require('lodash/get');

const app = require('../../system/server');
const config = require('../../system/config');
const { createClient1 } = require('../helpers/create_client');
const { consoleError, cookieCutter } = require('../helpers/methods');
const { invalidToken } = require('../helpers/constants');

describe('Auth route tests', () => {
  let type1NotValidated;
  let type1Validated;

  before(() => app.start(config.localAddress.host, config.localAddress.port)
    .then(() => {
      request = request(`http://${config.localAddress.host}:${config.localAddress.port}`);
      return request;
    }));

  before(async () => {
    // make calls to create clients
    try {
      // create type 1 clients for testing with and without email validation
      type1Validated = await createClient1(request, expect, true);
      type1NotValidated = await createClient1(request, expect);
    } catch (error) {
      throw consoleError(error);
    }
  });

  after((done) => {
    app.end();
    return done();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should take email and password of a client with verified email, return a cookie with a token that contains user uuid and email', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(200)
        .expect((response) => {
          expect(response.body.message).to.equal('login success');
          const token = jwt.decode(response.body.token);
          expect(type1Validated.email).is.equal(get(token, 'email'), 'email match error');
          expect(type1Validated.uuid).is.equal(get(token, 'uuid'), 'uuid match error');
        })
        .end(done);
    });

    it('should take email and password of a client without verified email, return a cookie with a token that contains user uuid and email', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1NotValidated.email, password: type1NotValidated.password })
        .expect(200)
        .expect((response) => {
          expect(response.body.message).to.equal('login success');
          const token = jwt.decode(response.body.token);
          expect(type1NotValidated.email).is.equal(get(token, 'email'), 'email match error');
          expect(type1NotValidated.uuid).is.equal(get(token, 'uuid'), 'uuid match error');
        })
        .end(done);
    });

    it('should take email and password that do not match and return error', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email, password: 'asdfSDF234' })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('There is no account with this username or password.');
        })
        .end(done);
    });

    it('should take email without password and return an error', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request payload input');
        })
        .end(done);
    });

    it('should take a password with no email and return an error', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ password: type1Validated.password })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request payload input');
        })
        .end(done);
    });

    it('should take a password that is too long and return an error', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({
          email: type1Validated.email,
          password: 'asdfasdfASDFASDF234234234asfdasdfasdfasdf;lasdfklajsdhflkasdgfhalskdhasdlgkjhasdlkjhasdlfkjhasdfl',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request payload input');
        })
        .end(done);
    });

    it('should take a password that is too short and return an error', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email, password: 'aA1!' })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request payload input');
        })
        .end(done);
    });

    it('should take a password that does not match pattern and return an error', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email, password: 'passwordisnogood' })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request payload input');
        })
        .end(done);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return a cookie that invalidates the current cookie', (done) => {
      request
        .post('/api/v1/auth/logout')
        // .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(200)
        .expect((response) => {
          expect(cookieCutter(response)).to.equal('token=; Max-Age=NaN; Expires=Invalid Date');
        })
        .end(done);
    });
  });

  // this needs to be sorted out - cannot currently get the test to pass,
  // fails with invalid cookie header
  describe('GET /api/v1/auth/reauth', () => {
    it('take a valid cookie with a valid token and return a new token and validation message', (done) => {
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(200)
        .expect((response) => {
          expect(response.body.message).to.equal('login success');
          const token = jwt.decode(response.body.token);
          expect(type1Validated.email).is.equal(get(token, 'email'), 'email match error');
          expect(type1Validated.uuid).is.equal(get(token, 'uuid'), 'uuid match error');
        })
        .end((error, firstResponse) => {
          request
            .get('/api/v1/auth/reauth')
            .set('Cookie', cookieCutter(firstResponse))
            .expect(200)
            .expect((response) => {
              expect(get(response, 'body.message')).is.equal('validation success');
              const token = jwt.decode(response.body.token);
              expect(type1Validated.email).is.equal(get(token, 'email'), 'email match error');
              expect(type1Validated.uuid).is.equal(get(token, 'uuid'), 'uuid match error');
            })
            .end(done);
        });
    });
  });

  it('should take an invalid cookie with a valid token and return a new token and validation message', (done) => {
    request
      .get('/api/v1/auth/reauth')
      .set('Cookie', `token=${invalidToken}`)
      .expect(401)
      .expect((response) => {
        expect(get(response, 'body.message')).is.equal('Invalid token');
      })
      .end(done);
  });
});

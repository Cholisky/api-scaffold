const { expect } = require('chai');
const get = require('lodash/get');
const jwt = require('jsonwebtoken');
let request = require('supertest');

const app = require('../../system/server');
const config = require('../../system/config');
const { createClient1 } = require('../helpers/create_client');
const { consoleError, cookieCutter } = require('../helpers/methods');
const { notExistUUID } = require('../helpers/constants');
const db = require('../../knex/knex');

describe('User route tests', () => {
  let type1NotValidated;
  let type1NotValidated2;
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
      type1NotValidated2 = await createClient1(request, expect);
    } catch (error) {
      throw consoleError(error);
    }
  });

  after((done) => {
    app.end();
    return done();
  });

  describe('GET /api/v1/user/{id}', () => {
    it('should log in to get auth and then get the current user data', (done) => {
      let cookie;
      request
        .post('/api/v1/auth/login')
        .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(200)
        .expect((response) => {
          cookie = cookieCutter(response);
        })
        .end(() => {
          request
            .get(`/api/v1/user/${type1Validated.uuid}`)
            .set('Cookie', cookie)
            .expect(200)
            .expect((response) => {
              const user = get(response, 'body.user');
              expect(user.first_name).to.equal(type1Validated.first_name);
              expect(user.last_name).to.equal(type1Validated.last_name);
              expect(user.email).to.equal(type1Validated.email);
              expect(user.some_data).to.equal(type1Validated.some_data);
              expect(user.email_verified).to.equal(true);
            })
            .end(done);
        });
    });
  });

  describe('Email validation endpoints', () => {
    it('should get email validation code for an existing unvalidated user, validate that user', (done) => {
      request
        .get(`/api/v1/user/getValidationCode?uuid=${type1NotValidated.uuid}`)
        .expect(200)
        .expect((response) => {
          expect(get(response, 'body.token').length).to.equal(36);
        })
        .then(firstResponse => request
          .get(`/api/v1/user/validateEmail?token=${get(firstResponse, 'body.token')}&uuid=${type1NotValidated.uuid}`)
          .expect(200)
          .expect((response) => {
            expect(get(response, 'body.message')).to.equal('Email validated');
          }))
        .then(() => request
          .post('/api/v1/auth/login')
          .send({ email: type1NotValidated.email, password: type1NotValidated.password })
          .expect(200)
          .expect((response) => {
            expect(get(response, 'body.message')).is.equal('login success');
            const tokenData = jwt.decode(get(response, 'body.token'));
            expect(get(tokenData, 'emailVerified')).is.equal(true);
          }))
        .then(() => db('app_user').update('email_verified', false).where('app_user_uuid', type1NotValidated.uuid))
        .then(() => done())
        .catch(error => done(error));
    });

    it('should try to get email validation code for a user that does not exist and return an error', (done) => {
      request
        .get(`/api/v1/user/getValidationCode?uuid=${notExistUUID}`)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid token');
        })
        .end(done);
    });

    it('should try to get email validation code without sending a uuid and return an error', (done) => {
      request
        .get('/api/v1/user/getValidationCode')
        .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request query input');
        })
        .end(done);
    });

    it('should try to get email validation code for an already verified user and return an error', (done) => {
      request
        .get(`/api/v1/user/getValidationCode?uuid=${type1Validated.uuid}`)
        .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid token');
        })
        .end(done);
    });

    it('should try to get email validation code with an invalid uuid and return an error', (done) => {
      request
        .get('/api/v1/user/getValidationCode?id=asflkjsahdf')
        .send({ email: type1Validated.email, password: type1Validated.password })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).to.equal('Invalid request query input');
        })
        .end(done);
    });

    it('should try to resend a used validation code return an error', (done) => {
      let validationCode;
      request
        .get(`/api/v1/user/getValidationCode?uuid=${type1NotValidated.uuid}`)
        .expect(200)
        .expect((response) => {
          expect(get(response, 'body.token').length).to.equal(36);
          validationCode = get(response, 'body.token');
        })
        .then(() => request
          .get(`/api/v1/user/validateEmail?token=${validationCode}&uuid=${type1NotValidated.uuid}`)
          .expect(200)
          .expect((response) => {
            expect(get(response, 'body.message')).to.equal('Email validated');
          }))
        .then(() => request
          .post('/api/v1/auth/login')
          .send({ email: type1NotValidated.email, password: type1NotValidated.password })
          .expect(200)
          .expect((response) => {
            expect(get(response, 'body.message')).is.equal('login success');
            const tokenData = jwt.decode(get(response, 'body.token'));
            expect(get(tokenData, 'emailVerified')).is.equal(true);
          }))
        .then(() => db('app_user').update('email_verified', false).where('app_user_uuid', type1NotValidated.uuid))
        .then(() => request
          .get(`/api/v1/user/validateEmail?token=${validationCode}&uuid=${type1NotValidated.uuid}`)
          .expect(400)
          .expect((response) => {
            expect(get(response, 'body.message')).to.equal('Invalid token');
          }))
        .then(() => done())
        .catch(error => done(error));
    });

    it('should try to validate a user email with an invalid validation token and return an error', (done) => {
      request
        .get(`/api/v1/user/getValidationCode?uuid=${type1NotValidated.uuid}`)
        .expect(200)
        .expect((response) => {
          expect(get(response, 'body.token').length).to.equal(36);
        })
        .then(() => request
          .get(`/api/v1/user/validateEmail?token=${notExistUUID}&uuid=${type1NotValidated.uuid}`)
          .expect(400)
          .expect((response) => {
            expect(get(response, 'body.message')).to.equal('Invalid token');
          }))
        .then(() => done())
        .catch(error => done(error));
    });

    it('should try to validate a user email with a valid validation code for the wrong user', (done) => {
      request
        .get(`/api/v1/user/getValidationCode?uuid=${type1NotValidated.uuid}`)
        .expect(200)
        .expect((response) => {
          expect(get(response, 'body.token').length).to.equal(36);
        })
        .then(firstResponse => request
          .get(`/api/v1/user/validateEmail?token=${get(firstResponse, 'body.token')}&uuid=${type1NotValidated2.uuid}`)
          .expect(400)
          .expect((response) => {
            expect(get(response, 'body.message')).to.equal('Invalid token');
          }))
        .then(() => done())
        .catch(error => done(error));
    });
  });

  // xdescribe('GET /api/v1/user/forgotPassword', () => {
  // });

  // xdescribe('GET /api/v1/user/resetPassword', () => {
  // });
});

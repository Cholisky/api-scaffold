const random = require('lodash/random');

const clientData = () => ({
  first_name: 'testing',
  last_name: 'client',
  email: `testclient${random(9999999)}@test.com`,
  password: '1fsdTH2345?',
  password_verify: '1fsdTH2345?',
  some_data: 'client notes for testing',
});

const createClient1 = async (request, expect, validate = false) => {
  try {
    let uuid;
    let uuidEmail;
    const clientInfo = clientData();

    await request
      .post('/api/v1/userType1')
      .send(clientInfo)
      .expect((response) => {
        uuid = response.text;
        expect(response.text.length).is.equal(36);
      })
      .catch(error => console.log('POST /api/v1/userType1: ', error));

    clientInfo.uuid = uuid;

    if (validate) {
      await request
        .get(`/api/v1/user/getValidationCode?uuid=${uuid}`)
        .expect(200)
        .expect((response) => {
          uuidEmail = response.text;
          expect(response.text.length).is.equal(36);
        })
        .catch(error => console.log('Create client get validation code: ', error));
      await request
        .get(`/api/v1/user/validateEmail?uuid=${uuid}&token=${uuidEmail}`)
        .expect(200)
        .expect((response) => {
          expect(response.text).is.equal('Email validated');
        })
        .catch(error => console.log('Create client email validation: ', error));
    }
    return clientInfo;
  } catch (error) {
    return error;
  }
};

module.exports = {
  clientData,
  createClient1,
};

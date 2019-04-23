const notExistUUID = '99999999-9999-9999-9999-999999999999';
// eslint-disable-next-line max-len
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RjbGllbnQ5NDkzNzY2QHRlc3QuY29tIiwidXVpZCI6ImY3MGY1NzA1LWZmMDktNGIyMi04YTAxLWU4MGEyMjRmMGEzNCIsImVtYWlsVmVyaWZpZWQiOiJ0cnVlIiwidXNlclR5cGUiOiJ1c2VyX3R5cGVfMSIsImlhdCI6IjE1NTU4NzA4NTAiLCJleHAiOiIxNTU2MjI3MjUwIn0.LmFbp-NglxjbJZ-E2rt7STLyZvSGvOc6afDKD_RUyB8';

const emailNotExist = 'fake@user.com';
const emailInvalid = 'bademail';

const passwordTemp = 'NotAFinalP455w0rd';
const passwordTooLong = 'asdfasdfASDFASDF234234234asfdasdfasdfasdf;lasdfklajsdhflkasdgfhalskdhasdlgkjhasdlkjhasdlfkjhasdfl';
const passwordNotPattern = 'passwordisnogood';
const passwordTooShort = 'aA1!';

module.exports = {
  notExistUUID,
  invalidToken,
  passwordTemp,
  passwordTooLong,
  passwordNotPattern,
  passwordTooShort,
  emailNotExist,
  emailInvalid,
};

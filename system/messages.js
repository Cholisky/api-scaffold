module.exports = {
  errors: {
    generic: 'We have encountered an error, please try again later.',
    user: {
      alreadyExists: 'This email has already been used.',
      wrongEmailPassword: 'There is no account with this username or password.',
      login: 'There was an error logging in.',
      unauthorized: 'Please login again.',
      notVerified: 'Please verify your email address.',
      badToken: 'Please send a valid token.',
      invalidToken: 'Invalid Token.',
      emailNotFound: 'No account found with this email address.',
      notAuthorized: 'Not Authorized.',
    },
    availability: {
      pastDate: 'you cannot specify and endTime in the past.',
      overlap: 'you cannot overlap date ranges.',
      generic: 'There was an error updating availability time.',
    },
    client: {
      create: 'There was an error creating the client.',
    },
    appointment: {
      counsellorNotAvailable: 'Counsellor is not available at this time.',
      clientNotAvailable: 'You have an appointment at this time.',
      pastAppointment: 'You can only make an appointment in the future.',
      generic: 'Could not make appointment.',
    },
  },
  success: {
    inserted: 'Record successfully inserted.',
    user: {
      signup: 'Sign-up successful.',
      alreadyVerified: 'Account already Verified.',
      checkYourEmail: 'Please check your email.',
      emailValidated: 'Email validated.',
      messageSent: 'Message Sent!',
    },
  },
};

const User = require('../../models/User');
module.exports = function authenticate(strategy, email, displayName, done) {
  User.findOne({'email': email}, async (err, user) => {
    if (!email) done(null, false, 'Не указан email');
    if(!user) {
      User.create({displayName, email}, (error, user) => {
        if (error) {
          if (email) done(error, false, error.message);
        } else {
          done(null, user);
        }
      });
    } else {
      done(null, user);
    }
  });
};

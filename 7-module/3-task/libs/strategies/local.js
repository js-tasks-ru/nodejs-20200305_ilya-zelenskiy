const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {usernameField: 'email', session: false},
  function(email, password, done) {
      User.findOne({email: email}, async function (err, user) {
          if (!user) {
              return done(null, false, 'Нет такого пользователя');
          }
          let check = await user.checkPassword(password);
          if (!check) {
              return done(null, false, 'Неверный пароль');
          }
          return done(null, user);
      });
  }
);

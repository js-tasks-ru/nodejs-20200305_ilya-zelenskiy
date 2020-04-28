const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    let token = socket.handshake.query.token;
    if(!token) {
      return next(new Error("anonymous sessions are not allowed"));
    }
    let session = await Session.findOne({token: token}).populate('user');
    if(!session) {
      return next(new Error("wrong or expired session token"));
    }
    socket.user = session.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      let message = new Message({});
      message.date = new Date();
      message.text = msg;
      message.chat = socket.user.id;
      message.user = socket.user.displayName;
      try {
        await message.save({validateBeforeSave: true});
      } catch (err) {
        return next(err);
      }
    });
  });

  return io;
}

module.exports = socket;

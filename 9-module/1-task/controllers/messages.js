const Message = require('../models/Message');
const mapMessage = require('../mappers/messages');

module.exports.messageList = async function messages(ctx, next) {
  let messages = await Message.find({chat: ctx.user.id}).limit(20);
  // ctx.body = {messages: []};
  ctx.body = {messages: messages.map(mapMessage)};
};

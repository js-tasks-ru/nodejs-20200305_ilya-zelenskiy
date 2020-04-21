const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    const order = await Order.create({
        user: ctx.user,
        product: ctx.request.body.product,
        address: ctx.request.body.address,
        phone: ctx.request.body.phone
    });

    await sendMail({
        template: 'order-confirmation',
        locals: {
            id: order._id,
            product: order.product._id
        },
        to: ctx.user.email,
        subject: 'Ваш заказ'
    });
    ctx.body = {order: order._id};
    return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user: ctx.user.id});
    ctx.status = 200;
    ctx.body = {orders: orders};
    return next();
};

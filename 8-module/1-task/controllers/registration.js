const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const verificationToken = uuid();

    let userExist = await User.findOne({email: ctx.request.body.email});
    if (userExist) {
        ctx.status = 400;
        ctx.body = {errors: {email: 'Такой email уже существует'}};
        return;
    }

    let user = await new User({
        email: ctx.request.body.email,
        displayName: ctx.request.body.displayName,
        verificationToken: verificationToken
    });
    await user.setPassword(ctx.body.request.password);
    await user.save();

    ctx.status = 200;
    ctx.body = {status: 'ok'};

    await sendMail({
        template: 'confirmation',
        to: user.email,
        locals: {token: verificationToken},
        subject: 'Подтвердите почту',
    });


    /*try {
        await user.save({validateBeforeSave: true});
    } catch (e) {
        ctx.status = 400;
        ctx.body = {errors: {email: 'Такой email уже существует'}};
        return next();
    }

    let options = {};
    options.to = user.email;
    // options.to = ctx.request.body.email;
    options.subject = 'Confirm Email';
    options.template = 'confirmation';
    options.locals = {token: verificationToken};
    sendMail(options);
    ctx.status = 200;
    ctx.body = {status: 'ok'};*/
};

module.exports.confirm = async (ctx, next) => {
    try {
        let user = await User.findOneAndUpdate({verificationToken: ctx.request.body.verificationToken}, {$unset: {verificationToken: ""}});
        if(!user) {
            ctx.status = 400;
            ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
            return next();
        }
        let token = ctx.login(user);
        ctx.body = {token: token};
    } catch (e) {
        ctx.status = 400;
        ctx.body = {errors: {email: 'Такой email уже существует'}};
        return next();
    }
};

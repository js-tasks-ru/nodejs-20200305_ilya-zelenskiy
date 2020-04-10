const Product = require('../models/Product');
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  let prod = await Product.find({$text: {$search: ctx.query.query}});
  ctx.body = {products: prod};
};

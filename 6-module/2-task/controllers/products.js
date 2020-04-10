const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  const subcategory = ctx.query.subcategory;
  if(!subcategory) {
    return next();
  }

  const products = await Product.find({subcategory: subcategory});

  const result = (!products) ? [] : products.map((product) => {
    return {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description
    }
  });

  ctx.body = {products: result};
};

module.exports.productList = async function productList(ctx, next) {

  const products = await Product.find({});

  let result = products.map(function(product) {
    return {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description
    }
  });

  ctx.body = {products: result};
};

module.exports.productById = async function productById(ctx, next) {

  if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400);

  const productQ = await Product.findOne({_id: ctx.params.id});
  if(!productQ) ctx.throw(404);

  const result = {
    product: {
      id: productQ._id,
      title: productQ.title,
      images: productQ.images,
      category: productQ.category,
      subcategory: productQ.subcategory,
      price: productQ.price,
      description: productQ.description
    }
  };
  ctx.body = result;
};


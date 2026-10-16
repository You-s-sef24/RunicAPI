const Product = require("../models/product");

const calculateSubtotal = async (items) => {
  const productIds = [
    ...new Set(items.map((item) => item.productId.toString())),
  ];

  const products = await Product.find({
    _id: { $in: productIds },
  }).select("_id name price");

  if (products.length !== productIds.length) {
    const error = new Error("One or more products were not found");
    error.status = 400;
    throw error;
  }

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId.toString());

    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { orderItems, subtotal };
};

module.exports = calculateSubtotal;

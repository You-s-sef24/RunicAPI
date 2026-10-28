const Order = require("../models/order");
const Product = require("../models/product");
const Category = require("../models/category");
const User = require("../models/user");

const STATUSES = ["pending", "delivered"];

const PRICE_RANGES = [
  { range: "0-50", min: 0, max: 50 },
  { range: "50-100", min: 50, max: 100 },
  { range: "100-200", min: 100, max: 200 },
  { range: "200-500", min: 200, max: 500 },
  { range: "500+", min: 500, max: Infinity },
];

const ordersByStatus = async (req, res, next) => {
  try {
    const counts = await Promise.all(
      STATUSES.map((status) => Order.countDocuments({ status })),
    );

    res.json(STATUSES.map((status, i) => ({ status, count: counts[i] })));
  } catch (err) {
    next(err);
  }
};

const priceDistribution = async (req, res, next) => {
  try {
    const counts = await Promise.all(
      PRICE_RANGES.map(({ min, max }) => {
        const price =
          max === Infinity ? { $gte: min } : { $gte: min, $lt: max };
        return Product.countDocuments({ price });
      }),
    );

    res.json(PRICE_RANGES.map(({ range }, i) => ({ range, count: counts[i] })));
  } catch (err) {
    next(err);
  }
};

const topProducts = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 20);

    const data = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: limit },
      { $project: { _id: 0, productId: "$_id", name: 1, quantity: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const productsByCategory = async (req, res, next) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      {
        $lookup: {
          from: Category.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          name: "$category.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const summary = async (req, res, next) => {
  try {
    const [revenue, pendingOrders, totalUsers, totalProducts] =
      await Promise.all([
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.countDocuments({ status: "pending" }),
        User.countDocuments({ isAdmin: { $ne: true } }),
        Product.countDocuments(),
      ]);

    res.json({
      totalRevenue: revenue[0]?.total || 0,
      pendingOrders,
      totalUsers,
      totalProducts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  productsByCategory,
  topProducts,
  priceDistribution,
  ordersByStatus,
  summary,
};

const checkAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = checkAdmin;

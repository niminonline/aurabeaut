const { ObjectId } = require("mongodb");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");

const userBlockUnblock = (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type;
    User.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isBlocked: type === "block" ? true : false } }
    )
      .then((response) => {
        if (type === "block") {
          req.session.user = false;
        }
        res.json(response);
        res.redirect("/admin/users");
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { userBlockUnblock };

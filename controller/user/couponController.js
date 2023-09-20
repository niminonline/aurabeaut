const Coupon = require("../../models/couponModel");
const User = require("../../models/userModel");
const { ObjectId } = require("mongodb");

// =========================Apply Coupon=============
const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const couponData = await Coupon.findOne({ code: couponCode });
    const userData = await User.findById(req.session.user_id)
      .populate("cart.product")
      .lean();
    // console.log(couponData,userData, userData.cart);
    let subtotal = 0;
    userData.cart.map((item) => {
      subtotal += item.product.price * item.quantity;
    });
    const maxCalcDiscount = Math.floor(
      parseInt(subtotal) * couponData.percentage * 0.01
    );
    let discount =
      maxCalcDiscount < couponData.maxDiscount
        ? maxCalcDiscount
        : couponData.maxDiscount;
    const total = subtotal - discount;
    res.json({
      discount: discount,
      total: total,
    });
  } catch (err) {
    console.error(err.message);
res.status(404).render("404");
  }
};

module.exports = { applyCoupon };

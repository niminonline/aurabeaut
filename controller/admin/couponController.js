const Coupon = require("../../models/couponModel");
const { ObjectId } = require("mongodb");

//===============================Coupons Load====================
const couponsLoad = async (req, res) => {
  try {
    const couponData = await Coupon.find();

    res.render("coupons", { couponData, couponData });
  } catch (err) {
    console.log(err.message);
res.status(404).render("404");
  }
};

//===============================Create Coupon====================
const createCoupon = async (req, res) => {
  try {
    const { expiryDate, percentage, minPurchase, maxDiscount } = req.body;
    console.log(req.body);

    const code = req.body.code.toUpperCase();

    const isCouponExist = await Coupon.findOne({ code: code });
    if (!isCouponExist) {
      const data = {
        code: code,
        expiryDate: expiryDate,
        percentage: percentage,
        minPurchase: minPurchase,
        maxDiscount: maxDiscount,
      };
      const couponData = await Coupon.create(data);
      if (couponData) {
        res.redirect("/admin/coupons");
      } else res.render("coupons", { errorMessage: "Coupon creation failed" });
    } else {
      res.render("coupons", { errorMessage: "Coupon already exist" });
    }
  } catch (err) {
    console.log(err.message);
res.status(404).render("404");
  }
};

// =========================Coupon Actions=============
const couponActions = async (req, res) => {
  try {
    const { id } = req.body;

    const couponData = await Coupon.findOne({ _id: id });

    await Coupon.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isActive: !couponData.isActive } }
    );

    res.redirect("/admin/coupon-actions");
  } catch (err) {
    console.log(err.message);
res.status(404).render("404");
  }
};

// =========================Coupon Actions=============
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    await Coupon.findByIdAndDelete(id);
    res.redirect("/admin/coupons");
  } catch (err) {
    console.log(err.message);
res.status(404).render("404");
  }
};

module.exports = { couponsLoad, createCoupon, couponActions, deleteCoupon };

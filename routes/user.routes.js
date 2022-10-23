const { defaultMaxListeners } = require("connect-mongo");
const express = require("express");
const { isLoggedIn } = require("../middlewares/auth.middleware.js");
const router = express.Router();
const User = require("../models/User.model.js");

//GET "/user/profile" => renderiza el area personal del user
router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    //console.log("ACTICVE USER",req.session.activeUser)
    const userFound = await User.findById(req.session.activeUser._id)
    .populate("toyOffered")
    .populate("commentUser").populate({path : 'commentUser', populate : {path : 'idToy', populate : {path : "name"} } })

    res.render("user/profile.hbs", {
      userFound,
    });
  } catch (error) {
    next(error);
  }
});

//GET "/user/list" => renderiza una lista de todos los user
router.get("/list", isLoggedIn, async (req, res, next) => {
  //TODO imagenes usuario
  try {
    const userList = await User.find();
    res.render("user/list.hbs", {
      userList,
    });
  } catch (error) {
    next(error);
  }
});
//GET "/user/:userid/detail" => renderiza detalles de cada user
router.get("/:userid/detail", isLoggedIn, async (req, res, next) => {
  const { userid } = req.params;
  try {
    const userDetail = await User.findById(userid);
    res.render("user/detail.hbs", {
      userDetail,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

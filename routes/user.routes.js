const { defaultMaxListeners } = require("connect-mongo");
const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware.js");
const router = express.Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const uploader = require("../middlewares/cloudinary.js")

//GET "/user/profile" => renderiza el area personal del user
router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    //console.log("ACTICVE USER",req.session.activeUser)
    const userFound = await User.findById(req.session.activeUser._id)
      .populate("toyOffered")
      .populate("toyReserved")
      .populate("commentUser")
      .populate({
        path: "commentUser",
        populate: { path: "idToy", populate: { path: "name" } },
      });

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
  console.log("ISADMIN!!!!", res.locals.isUserAdmin);
  try {
    const userList = await User.find();
    res.render("user/list.hbs", {
      userList,
      isUserAdmin: res.locals.isUserAdmin,
    });
  } catch (error) {
    next(error);
  }
});
//GET "/user/:userid/detail" => renderiza detalles de cada user
router.get("/:userid/detail", isLoggedIn, async (req, res, next) => {
  const { userid } = req.params;
  try {
    const userDetail = await User.findById(userid).populate("toyOffered").populate("commentUser");
    console.log("USERDETAIL", userDetail);
    res.render("user/detail.hbs", {
      userDetail: userDetail,
    });
  } catch (error) {
    next(error);
  }
});

// GET ("/user/:userid/edit") => renderiza form editar datos user
router.get("/:userid/edit", isLoggedIn, async (req, res, next) => {
  const { userid } = req.params;
  try {
    const foundUser = await User.findById(userid);
    res.render("user/edit.hbs", {
      activeUser: foundUser,
    });
  } catch (error) {
    next(error);
  }
});

//POST ("/user/:userid/edit")
router.post("/:userid/edit", isLoggedIn, uploader.single("avatar"), async (req, res, next) => {
  const { userid } = req.params;

  try {
    const oldUser = await User.findById(userid);

    // 1. Validaciones de backend
    // .todos los campos deben estar llenos
    if (req.body.email === "" || req.body.password === "") {
      res.render("user/edit.hbs", {
        errorMessage: "Debes llenar todos los campos",
        activeUser: req.session.activeUser,
      });
      return;
    }

    // validar la fuerza de la contraseña
    // const passwordRegex = new RegExp("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm")
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (passwordRegex.test(req.body.password) === false) {
      res.render("user/edit.hbs", {
        errorMessage:
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número",
        activeUser: req.session.activeUser,
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    

    const updateUser = {
      username: req.body.username,
      avatar: req.file?.path,
      email: req.body.email,
      password: hashPassword,
      toyOffered: oldUser.toyOffered,
      toyReserved: oldUser.toyReserved,
      commentUser: oldUser.commentUser,
    };

    const editUser = await User.findByIdAndUpdate(userid, updateUser);
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

// GET ("user/:userid/delete")
router.get("/:userid/delete", isAdmin, async (req, res, next) => {
  const { userid } = req.params;

  try {
    const oneUser = await User.findByIdAndDelete(userid);
    res.redirect("/user/list");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

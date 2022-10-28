const express = require("express");
const mongoose = require("mongoose");
const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();
const Toy = require("../models/Toy.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");
const uploader = require("../middlewares/cloudinary.js");

//GET "/toy/list" => renderiza una lista de todos los toy
router.get("/list", async (req, res, next) => {
  try {
    const toyList = await Toy.find();
    res.render("toy/list.hbs", {
      toyList,
    });
  } catch (error) {
    next(error);
  }
});

//GET "/toy/:idtoy/detail" => renderiza detalles de cada toy
router.get("/:idtoy/detail", async (req, res, next) => {
  const { idtoy } = req.params;
  try {
    const eachToy = await Toy.findById(idtoy)
      .populate("commentToy")
      .populate({ path: "commentToy", populate: { path: "idUser" } });

    //mensaje de reservado y boton de reserva/quitarReserva
    let actualUserReserve;
    // const { _id }= actualUserReserve.toyReserved
    // const definitiveID = JSON.stringify(_id).split(`"`)

    let reserved = false;
    let reservedButton = true;
    if (req.session.activeUser !== undefined) {
      if (
        actualUserReserve !== undefined &&
        actualUserReserve.toyReserved !== null &&
        actualUserReserve.toyReserved !== undefined
      ) {
        actualUserReserve = await User.findById(
          req.session.activeUser._id
        ).populate("toyReserved"); //.select("toyReserved")
        const { _id } = actualUserReserve.toyReserved;
        const definitiveID = JSON.stringify(_id).split(`"`);
        reserved = true;
        if (idtoy === definitiveID[1]) {
          reservedButton = false;
        } else {
          reservedButton = true;
        }
      } else {
        reserved = false;
      }
    }

    //para comments, para mostrar la fecha de edicion si ha sido modificado.
    const dateFormat = (date) => {
      let str = "";
      let min = "";
      let sec = "";
      if (date.getMinutes() < 10) {
        min += "0" + date.getMinutes();
      } else {
        min += date.getMinutes();
      }
      if (date.getSeconds() < 10) {
        sec += "0" + date.getSeconds();
      } else {
        sec += date.getSeconds();
      }
      str =
        date.getDate() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        min +
        ":" +
        sec;
      return str;
    };

    let objDates = {};
    eachToy.commentToy.forEach((elem) => {
      if (elem.createdAt >= elem.updatedAt) {
        let strDate = dateFormat(elem.createdAt);
        objDates[elem._id] = "created on " + strDate;
      } else {
        let strDate = dateFormat(elem.updatedAt);
        objDates[elem._id] = "edited on " + strDate;
      }
    });

    res.render("toy/toy-detail.hbs", {
      eachToy,
      activeUser: req.session.activeUser,
      reserved,
      reservedButton,
      objDates,
    });
  } catch (error) {
    next(error);
  }
});

//POST "/toy/:idtoy/detail" => Crear nuevo comentario y añadir relación al toy y al user
router.post("/:idtoy/detail", async (req, res, next) => {
  const { idtoy } = req.params;

  try {
    const updateToy = await Toy.findById(idtoy);
    const updateUser = await User.findById(req.session.activeUser._id);

    const { name, description, photo, status, commentToy } = updateToy;
    const {
      username,
      email,
      password,
      toyOffered,
      toyReserved,
      commentUser,
      role,
      avatar,
    } = updateUser;

    const newToy = {
      name: name,
      description: description,
      photo: photo,
      status: status,
      commentToy: commentToy,
    };

    const newUser = {
      username: username,
      email: email,
      password: password,
      toyOffered: toyOffered,
      toyReserved: toyReserved,
      commentUser: commentUser,
      role: role,
      avatar: avatar,
    };

    const newComment = {
      content: req.body.content,
      idUser: req.session.activeUser._id,
      idToy: idtoy,
    };

    const oneNewComment = await Comment.create(newComment);

    commentToy.push(oneNewComment._id);
    commentUser.push(oneNewComment._id);

    const toyToUpdate = await Toy.findByIdAndUpdate(idtoy, newToy);

    const userToUpdate = await User.findByIdAndUpdate(
      req.session.activeUser._id,
      newUser
    );

    res.redirect(`/toy/${idtoy}/detail`);
  } catch (error) {
    next(error);
  }
});

//GET "/toy/add"
router.get("/add", isLoggedIn, uploader.single("photo"), (req, res, next) => {
  res.render("toy/add.hbs");
});

//POST "/toy/add" =>  recoge la info del form add toy
router.post("/add", uploader.single("photo"), async (req, res, next) => {
  const { name, description, status, commentToy } = req.body;
  //validacion de form
  if (name === "" || description === "") {
    res.render("toy/add.hbs", {
      errorMessage: "Must fill all the inputs",
    });
    return;
  }
  try {
    const oneToy = {
      name: name,
      description: description,
      photo: req.file?.path,
      status: status,
      commentToy: commentToy,
    };

    const newToy = await Toy.create(oneToy);
    const updateUser = await User.findById(req.session.activeUser._id);
    const {
      username,
      email,
      password,
      toyOffered,
      toyReserved,
      commentUser,
      role,
      avatar,
    } = updateUser;
    toyOffered.push(newToy._id);
    const newUser = {
      username: username,
      email: email,
      password: password,
      toyOffered: toyOffered,
      toyReserved: toyReserved,
      commentUser: commentUser,
      role: role,
      avatar: avatar,
    };
    const creatorUser = await User.findByIdAndUpdate(
      req.session.activeUser._id,
      newUser
    );
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

//GET ("/toy/reserve") => ñade el toy a la reserva del user
router.get("/:idtoy/reserve", isLoggedIn, async (req, res, next) => {
  const { idtoy } = req.params;
  try {
    const newUser = await User.findByIdAndUpdate(req.session.activeUser._id, {
      toyReserved: idtoy,
    });
    res.redirect(`/toy/${idtoy}/detail`);
  } catch (error) {
    next(error);
  }
});

//GET ("/toy/:idtoy/edit")
router.get("/:idtoy/edit", isLoggedIn, async (req, res, next) => {
  const { idtoy } = req.params;
  try {
    const oldToy = await Toy.findById(idtoy);
    res.render("toy/edit.hbs", {
      oldToy,
    });
  } catch (error) {
    next(error);
  }
});

//POST ("/toy/:idtoy/edit")
router.post(
  "/:idtoy/edit",
  uploader.single("photo"),
  async (req, res, next) => {
    const { idtoy } = req.params;
    const { name, description, status, commentToy, photo } = req.body;

    try {
      const newToy = {
        name: name,
        description: description,
        photo: req.file?.path,
        status: status,
        commentToy: commentToy,
      };
      const updatedToy = await Toy.findByIdAndUpdate(idtoy, newToy);

      res.redirect(`/user/profile`);
    } catch (error) {
      next(error);
    }
  }
);

//GET ("/toy/:idtoy/delete")
router.get("/:idtoy/delete", isLoggedIn, async (req, res, next) => {
  const { idtoy } = req.params;
  try {
    const deletedToy = await Toy.findByIdAndDelete(idtoy);
    res.redirect("/toy/list");
  } catch (error) {
    next(error);
  }
});

//GET "/toy/removereserve"
router.get("/removereserve", isLoggedIn, async (req, res, next) => {
  try {
    const otherUser = await User.findByIdAndUpdate(req.session.activeUser._id, {
      toyReserved: null,
    });
    res.redirect(`/user/profile`);
  } catch (error) {
    next(error);
  }
});

//GET "/toy/removereserve/:idtoy"
router.get("/removereservetoy/:idtoy", isLoggedIn, async (req, res, next) => {
  const { idtoy } = req.params;
  try {
    const otherUser = await User.findByIdAndUpdate(req.session.activeUser._id, {
      toyReserved: null,
    });
    res.redirect(`/toy/${idtoy}/detail`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

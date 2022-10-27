const express = require("express");
const mongoose = require("mongoose");
const {
  isLoggedIn,
  isAdmin,
  photoChecker,
} = require("../middlewares/auth.middleware");
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

    let reserved = false;
    if (req.session.activeUser !==undefined) {
      if (req.session.activeUser.toyReserved !== undefined) {
        reserved = true;
      }
    }

    //para comments, para mostrar la fecha de edicion si ha sido modificado.

    // console.log("COMMETNS DATEE", eachToy.commentToy[0].createdAt);

    // // const currentDate = new Date();

    // const currentDayOfMonth = eachToy.commentToy[0].createdAt.getDate();
    // const currentMonth = eachToy.commentToy[0].createdAt.getMonth(); // Be careful! January is 0, not 1
    // const currentYear = eachToy.commentToy[0].createdAt.getFullYear();

    // const dateString =
    //   currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    // console.log("DATESTRIIIING", dateString);

    const dateFormat = (date) => {
      let str= ""
      let min=""
      let sec=""
      if (date.getMinutes()<10){
        min+= "0"+date.getMinutes()
      } else {
        min+= date.getMinutes()
      }
      if(date.getSeconds()<10){
        sec+= "0"+date.getSeconds()
      }else {
        sec+= date.getSeconds()
      }



      str = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()+ " " + date.getHours() + ":" + min + ":" + sec
      return str
    }

    let objDates = {};
    eachToy.commentToy.forEach((elem) => {
      if (elem.createdAt >= elem.updatedAt) {
        let strDate = dateFormat(elem.createdAt)
        objDates[elem._id]="Created On "+strDate;
      } else {
        let strDate = dateFormat(elem.updatedAt)
        objDates[elem._id]="Edited On "+strDate;
      }
    });

    console.log(objDates);

    res.render("toy/toy-detail.hbs", {
      eachToy,
      activeUser: req.session.activeUser,
      reserved: reserved,
      objDates : objDates
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
router.get("/add", uploader.single("photo"), (req, res, next) => {
  res.render("toy/add.hbs");
});

//POST "/toy/add" =>  recoge la info del form add toy
router.post("/add", uploader.single("photo"), async (req, res, next) => {
  try {
    const { name, description, status, commentToy } = req.body;

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
router.get("/:idtoy/edit", async (req, res, next) => {
  const { idtoy } = req.params;
  try {
    const oldToy = await Toy.findById(idtoy);
    console.log("OLTTOYPHOTO", oldToy.photo);
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
      console.log("PHOOTO", newToy.photo);
      const updatedToy = await Toy.findByIdAndUpdate(idtoy, newToy);

      res.redirect(`/user/profile`);
    } catch (error) {
      next(error);
    }
  }
);

//GET ("/toy/:idtoy/delete")
router.get("/:idtoy/delete", async (req, res, next) => {
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

module.exports = router;

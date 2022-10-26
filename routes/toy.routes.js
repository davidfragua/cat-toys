const express = require("express");
const mongoose = require("mongoose");
const { isLoggedIn } = require("../middlewares/auth.middleware");
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
    console.log("RESERVEDDDD", req.session.activeUser.toyReserved)
    if (req.session.activeUser.toyReserved !== undefined) {
      reserved = true;
    }

    res.render("toy/toy-detail.hbs", {
      eachToy,
      activeUser: req.session.activeUser,
      reserved: reserved,
    });
  } catch (error) {
    next(error);
  }
});

//POST "/toy/:idtoy/detail" => Crear nuevo comentario y añadir relación al toy y al user
router.post("/:idtoy/detail", async (req, res, next) => {
  const { idtoy } = req.params;

  try {
    // const updateToy = await Toy.findById(idtoy);
    // const updateUser = await User.findById(req.session.activeUser._id);

    // const { name, description, photo, status, commentToy } = updateToy;
    // const {
    //   username,
    //   email,
    //   password,
    //   toyOffered,
    //   toyReserved,
    //   commentUser,
    //   role,
    //   avatar,
    // } = updateUser;

    // const newToy = {
    //   name: name,
    //   description: description,
    //   photo: photo,
    //   status: status,
    //   commentToy: commentToy,
    // };

    // const newUser = {
    //   username: username,
    //   email: email,
    //   password: password,
    //   toyOffered: toyOffered,
    //   toyReserved: toyReserved,
    //   commentUser: commentUser,
    //   role: role,
    //   avatar: avatar,
    // };

    const newComment = {
      content: req.body.content,
      idUser: req.session.activeUser._id,
      idToy: idtoy,
    };

    const oneNewComment = await Comment.create(newComment);

    // commentToy.push(oneNewComment._id);
    // commentUser.push(oneNewComment._id);

    const toyToUpdate = await Toy.findByIdAndUpdate(idtoy, {
      commentToy: commentToy.push(oneNewComment._id);
    });

    const userToUpdate = await User.findByIdAndUpdate(
      req.session.activeUser._id,
      {
        commentUser : commentUser.push(oneNewComment._id)
      }
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

    let defaultPhoto = "https://res.cloudinary.com/dgsjejaed/image/upload/v1666701992/cat-toys/q3fi1deeyjznzy6athzy.png"
    let toyPhoto
    if(req.body.photo === undefined) {
      toyPhoto = defaultPhoto
    } else {
      toyPhoto = req.file.path
    }

    const oneToy = {
      name: name,
      description: description,
      photo: toyPhoto,
      status: status,
      commentToy: commentToy,
    };

    const newToy = await Toy.create(oneToy);
    // const updateUser = await User.findById(req.session.activeUser._id);
    // const {
    //   username,
    //   email,
    //   password,
    //   toyOffered,
    //   toyReserved,
    //   commentUser,
    //   role,
    //   avatar,
    // } = updateUser;
    // toyOffered.push(newToy._id);
    // const newUser = {
    //   username: username,
    //   email: email,
    //   password: password,
    //   toyOffered: toyOffered,
    //   toyReserved: toyReserved,
    //   commentUser: commentUser,
    //   role: role,
    //   avatar: avatar,
    // };
    const creatorUser = await User.findByIdAndUpdate(
      req.session.activeUser._id,{
        toyOffered : toyOffered.push(newToy._id)
      }
      // newUser
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
    const newUser = await User.findByIdAndUpdate(
      req.session.activeUser._id,
      {
        toyReserved : idtoy
      }
    );
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
    try {
      const previousToy = await Toy.findById(idtoy)

      let previousPhoto
      if(req.body.photo === undefined) {
        previousPhoto = previousToy.photo
      } else {
        previousPhoto = req.file.path
      }

      const updatedToy = await Toy.findByIdAndUpdate(idtoy, {
        photo: previousPhoto
      });
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
router.get("/removereserve", isLoggedIn, async (req, res,next)=>{
  try {
    const otherUser = await User.findByIdAndUpdate(req.session.activeUser._id, {
      toyReserved: null
    })
    res.redirect(`/user/profile`)
  } catch (error) {
    next(error)
  }
})

module.exports = router;

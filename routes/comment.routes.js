const express = require("express");
const Toy = require("../models/Toy.model");
const router = express.Router();
const Comment = require("../models/Comment.model");
const createdEdited = require("../utils/createdEdited.js")

//GET ("/comment/:idcomment/edit")
router.get("/:idcomment/edit", async (req, res, next) => {
  const { idcomment } = req.params;
  try {
    const oneComment = await Comment.findById(idcomment).populate("idToy");
    res.render("comment/edit.hbs", {
      oneComment,
    });
  } catch (error) {
    next(error);
  }
});

// POST ("/comment/update") => actualizar comentario
router.post("/:idcomment/edit", async (req, res, next) => {
  const { idcomment } = req.params;
  try {
    const oldComment = await Comment.findById(idcomment);
    const { content, idToy, idUser } = oldComment;
    const updateComment = {
      content: req.body.content,
      idToy: idToy,
      idUser: idUser,
    };

    const oneComment = await Comment.findByIdAndUpdate(
      idcomment,
      updateComment
    );
    res.redirect(`/user/profile`);
  } catch (error) {
    next(error);
  }
});

// GET ("/comment/delete") => borrar comentario
router.get("/:commentId/:toyId/delete", async (req, res, next) => {
  const { commentId, toyId } = req.params;
  try {
    const oneComment = await Comment.findByIdAndDelete(commentId);
    res.redirect(`/toy/${toyId}/detail`);
  } catch (error) {
    next(error);
  }
});

// GET ("/comment/:comentid/deleteuser") => borrar comentario
router.get("/:commentId/deleteuser", async (req, res, next) => {
  const { commentId, iduser } = req.params;
  try {
    const oneComment = await Comment.findByIdAndDelete(commentId);
    res.redirect(`/user/profile`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

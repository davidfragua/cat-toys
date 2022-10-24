const express = require("express");
const Toy = require("../models/Toy.model");
const router = express.Router();
const Comment = require("../models/Comment.model")




// POST ("/comment/update") => actualizar comentario


// GET ("/comment/delete") => borrar comentario
router.get("/:commentId/:toyId/delete", async (req, res, next) => {
    const { commentId, toyId } = req.params

    try {
        
        const oneComment = await Comment.findByIdAndDelete(commentId)
        res.redirect(`/toy/${toyId}/detail`)

    } catch (error) {
        next(error)
    }

})


module.exports = router;
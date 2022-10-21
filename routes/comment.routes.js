const express = require("express");
const Toy = require("../models/Toy.model");
const router = express.Router();


// POST ("/comment/add") => recibe info del form de toy de anñadir comments
router.post("/add", async (req, res, next) => {
    const { content, toyid } = req.body
       
    try {
    const updateToy = await Toy.findById(toyid)

    const { name, description, photo, status, comment  } = updateToy
    const newToy = {
        name: name,
        description: description,
        photo: photo,
        status: status,
        comment: comment.push(content)
    }

      Toy.findByIdAndUpdate(toyid, newToy) 
      

    } catch (error) {
        next(error)
        
    }

})


// POST ("/comment/update") => actualizar comentario


// POST ("/comment/delete") => borrar comentario



module.exports = router;
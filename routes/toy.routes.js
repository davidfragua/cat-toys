const express = require('express');
const mongoose = require("mongoose");
const { isLoggedIn } = require('../middlewares/auth.middleware');
const router = express.Router();
const Toy = require("../models/Toy.model")
const Comment = require("../models/Comment.model")

//GET "/toy/list" => renderiza una lista de todos los toy
router.get("/list", async (req, res, next) =>{

try {
    const toyList = await Toy.find()
    res.render("toy/list.hbs", {
        toyList
    })
} catch (error) {
    next(error)   
}
})


//GET "/toy/:idtoy/detail" => renderiza detalles de cada toy
router.get("/:idtoy/detail", async (req, res, next) =>{
    const { idtoy } = req.params
try {
    const eachToy = await Toy.findById(idtoy).populate("comment")
    res.render("toy/toy-detail.hbs", {
        eachToy
    })
}
 catch (error) {
    next(error)
}
})

//POST "/toy/:idtoy/detail"
router.post("/:idtoy/detail", async (req, res, next) => {
   
    const { idtoy } = req.params
       
    try {
    const updateToy = await Toy.findById(idtoy)
    
    const newComment = await Comment.create(req.body)

    const { name, description, photo, status, comment  } = updateToy
    comment.push(newComment._id)
        console.log(updateToy, "updateToy" )
        console.log(comment, "comment" )
        console.log(req.body, "req.body" )

    const newToy = {
        name: name,
        description: description,
        photo: photo,
        status: status,
        comment: comment
    }

     const toyToUpdate = await Toy.findByIdAndUpdate(idtoy, newToy) 
        
      res.redirect(`/toy/${idtoy}/detail`)

    } catch (error) {
        next(error)
        
    }

})

//POST "/toy/add" =>  recoge la info del form add toy
router.post("/add", async (req, res, next)=>{
    try {
        const newToy = await Toy.create(req.body)
        res.redirect("/user/profile")
    } catch (error) {
        next(error)
    }
})

module.exports=router
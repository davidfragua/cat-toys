const express = require('express');
const mongoose = require("mongoose");
const { isLoggedIn } = require('../middlewares/auth.middleware');
const router = express.Router();
const Toy = require("../models/Toy.model")
const Comment = require("../models/Comment.model");
const User = require('../models/User.model');

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
    const eachToy = await Toy.findById(idtoy).populate("commentToy")
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
    const updateUser = await User.findById(req.session.activeUser._id)
    const newComment = await Comment.create(req.body)

    const { name, description, photo, status, commentToy  } = updateToy
    const {username, email, password, toyOffered, toyReserved, commentUser, role, avatar} = updateUser
    commentToy.push(newComment._id)
    commentUser.push(newComment._id)

    const newToy = {
        name: name,
        description: description,
        photo: photo,
        status: status,
        commentToy: commentToy,
        avatar: avatar
    }

    const newUser = {
        username: username,
        email:email,
        password: password,
        toyOffered: toyOffered, 
        toyReserved: toyReserved, 
        commentUser: commentUser, 
        role:role
    }

     const toyToUpdate = await Toy.findByIdAndUpdate(idtoy, newToy) 
     const userToUpdate = await User.findbyIdAndUpdate(req.session.activeUser._id, newUser)
        
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
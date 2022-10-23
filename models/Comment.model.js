const { Schema, model, mongoose } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const commentSchema = new Schema(
    {
        content: String,
        idToy:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Toy"
        },
        idUser:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
        
        
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
      }
    )


    const Comment = model("Comment", commentSchema);

    module.exports = Comment;
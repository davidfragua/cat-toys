const { Schema, model, mongoose } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const toySchema = new Schema(
    {
        name: String,
        description: String,
        photo: String,
        status: {
            type: String,
            enum: ["new", "used", "trash"],
            default: "used"
        },
        comments: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
    )


    const Toy = model("Toy", toySchema);

    module.exports = Toy;
const { Schema, model, mongoose } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const toySchema = new Schema(
  {
    name: String,
    description: String,
    photo: {
      type: String,
      default: "https://res.cloudinary.com/dgsjejaed/image/upload/v1666701992/cat-toys/q3fi1deeyjznzy6athzy.png"
    },
    status: {
      type: String,
      enum: ["new", "used", "trash"],
      default: "used",
    },
    commentToy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Toy = model("Toy", toySchema);

module.exports = Toy;

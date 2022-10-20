const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    toyOffered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy"
    },
    toyReserved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy"
    },
    comment: {
      type: String,
      ref: "Comment"
    },
    role: {
      enum: ["admin","user" ]
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;

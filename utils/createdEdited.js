const dateFormat = require("./dateFormat.js")

const createdEdited = (comments) => {
    let objDates = {};
    comments.forEach((elem) => {
      if (elem.createdAt >= elem.updatedAt) {
        let strDate = dateFormat(elem.createdAt);
        objDates[elem._id] = "created on " + strDate;
      } else {
        let strDate = dateFormat(elem.updatedAt);
        objDates[elem._id] = "edited on " + strDate;
      }
    });
    return objDates
  }

  module.exports = createdEdited
const dateFormat = (date) => {
    let str = "";
    let min = "";
    let sec = "";
    if (date.getMinutes() < 10) {
      min += "0" + date.getMinutes();
    } else {
      min += date.getMinutes();
    }
    if (date.getSeconds() < 10) {
      sec += "0" + date.getSeconds();
    } else {
      sec += date.getSeconds();
    }
    str =
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      min +
      ":" +
      sec;
    return str;
  };

  module.exports = dateFormat
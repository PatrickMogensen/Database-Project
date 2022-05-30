var DataTypes = require("sequelize").DataTypes;
var _book = require("./book");
var _fine = require("./fine");
var _loan = require("./loan");
var _reservation = require("./reservation");
var _user = require("./user");

function initModels(sequelize) {
  var book = _book(sequelize, DataTypes);
  var fine = _fine(sequelize, DataTypes);
  var loan = _loan(sequelize, DataTypes);
  var reservation = _reservation(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  loan.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(loan, { as: "loans", foreignKey: "book_id"});
  reservation.belongsTo(book, { as: "book", foreignKey: "book_id"});
  book.hasMany(reservation, { as: "reservations", foreignKey: "book_id"});
  fine.belongsTo(loan, { as: "loan", foreignKey: "loan_id"});
  loan.hasOne(fine, { as: "fine", foreignKey: "loan_id"});
  fine.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(fine, { as: "fines", foreignKey: "user_id"});
  loan.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(loan, { as: "loans", foreignKey: "user_id"});
  reservation.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(reservation, { as: "reservations", foreignKey: "user_id"});

  return {
    book,
    fine,
    loan,
    reservation,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

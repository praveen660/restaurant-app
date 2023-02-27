const server = require("../server");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(server.DB, server.USER, server.PASSWORD, {
  host: server.HOST,
  dialect: server.dialect,
  pool: {
    max: server.pool.max,
    min: server.pool.min,
    acquire: server.pool.acquire,
    idle: server.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Database in connected");
  })
  .catch((err) => {
    console.log("Failed to connect" + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModels")(sequelize, Sequelize);
db.reviews = require("./reviewModel")(sequelize, Sequelize);
db.restaurants = require("./restaurantsModel")(sequelize, Sequelize);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});
//---------------------Associations-----------------------//
db.users.hasMany(db.restaurants, { foreignKey: "userId", as: "restaurants" });
db.restaurants.belongsTo(db.users, {
  foreignKey: "userId",
  as: "userInfo",
});
db.restaurants.hasMany(db.reviews, {
  foreignKey: "restaurantId",
  as: "reviews",
});
db.reviews.belongsTo(db.restaurants, {
  foreignKey: "restaurantId",
  as: "restaurantInfo",
});
db.users.hasMany(db.reviews, { foreignKey: "userId", as: "reviews" });
db.reviews.belongsTo(db.users, {
  foreignKey: "userId",
  as: "userInfo",
});
module.exports = db;

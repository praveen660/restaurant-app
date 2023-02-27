const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
module.exports = {
  HOST: `${process.env.HOST}`,
  USER: `${process.env.USER}`,
  PASSWORD:"",
  DB:`${process.env.DATABASE}`,
  dialect:`${process.env.DIT}`,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

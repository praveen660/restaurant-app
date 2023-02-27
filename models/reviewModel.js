module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: {
          args: 5.0, 
          msg: 'Rating cannot be higher than 5.0.' 
        },
        min: {
          args: 1.0, 
          msg: 'Rating cannot be lower than 1.0.' 
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Review;
};

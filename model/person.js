module.exports = (sequelize, Sequelize) => {
  return sequelize.define("person", {
    username: {
      type: Sequelize.STRING,
      allowNUll: false,
      validate: {
        len: [1, 10],
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNUll: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNUll: false,
      validate: {
        len: [8, 20],
      },
    },
  });
};

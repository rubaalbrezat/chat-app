"use strict";

const user = (sequelize, DataTypes) =>
  sequelize.define("userMessage", {
    user: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    messages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  });

module.exports = user;
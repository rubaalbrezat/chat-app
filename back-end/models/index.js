"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const user = require("./user.model");

const POSTGRES_URL = process.env.DATABASE_URL ;

  const sequelize = new Sequelize(POSTGRES_URL);
const userModel = user(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  User: userModel,
};
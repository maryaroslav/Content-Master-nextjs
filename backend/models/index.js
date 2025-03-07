const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User(sequelize);

db.sequelize.sync({ force: false }).then(() =>{
    console.log('DB SYNC');
}).catch(err => {
    console.error("ERR SYNCing DB: " + err)
})

module.exports = db;
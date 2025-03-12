const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User');
const Community = require('./Community');
const UserCommunity = require('./UserCommunity');


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User(sequelize);
db.Community = Community(sequelize);
db.UserCommunity = UserCommunity(sequelize);

Object.values(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});

db.sequelize.sync({ force: false }).then(() =>{
    console.log('DB SYNC');
}).catch(err => {
    console.error("ERR SYNCing DB: " + err)
})

module.exports = db;
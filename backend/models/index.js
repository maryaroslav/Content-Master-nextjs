const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User');
const Community = require('./Community');
const UserCommunity = require('./UserCommunity');
const Event = require('./Event');
const UserEvent = require('./UserEvent');
const Follow = require('./Follow');
const Message = require('./Message');
const Post = require('./Post');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User(sequelize);
db.Community = Community(sequelize);
db.UserCommunity = UserCommunity(sequelize);
db.Event = Event(sequelize);
db.UserEvent = UserEvent(sequelize);
db.Follow = Follow(sequelize);
db.Message = Message(sequelize);
db.Post = Post(sequelize);

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
const {Sequelize, DataTypes} = require('sequelize');
const initModels = require('../models/init-models');

const sequelize = new Sequelize('mysql://wu9imttjcpvru1yy:ggwi3bmzj8bwk0yy@i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/mfscf7h3iqsc5qvq'
    , {
        define: {
            // prevent sequelize from pluralizing table names
            freezeTableName: true,
        },
    });

const models = initModels(sequelize);
module.exports = sequelize;
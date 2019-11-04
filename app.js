const express = require('express');
const app = express();

const dbConnector = require('./database-connector');
const relation = require('./realtionship');
const synonym = require('./synonym');

dbConnector.init(app);
relation.init(app);
synonym.init(app);



// app.use((req, res, next) => {
//     if(app.locals.db){
//       req.db = app.locals.db;
//     }
  
//     next();
// });

module.exports = app;


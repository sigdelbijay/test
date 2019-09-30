const express = require('express');
const relation = require('./realtionship');
const dbConnector = require('./database-connector');
const app = express();

dbConnector.init(app);
relation.init(app);

// app.use((req, res, next) => {
//     if(app.locals.db){
//       req.db = app.locals.db;
//     }
  
//     next();
// });

module.exports = app;


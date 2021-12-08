const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const path = require('path');
//  const config = require('config');

require('dotenv').config();


// const articles = require('./routes/articles');

//Initializig express
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open",()=>console.log("Monngodb connected..."));

// const articlesRouter = require('./routes/articles');
//  app.use('/articles',articlesRouter);

  app.use('/articles',require('./routes/articles'));
  app.use('/users',require('./routes/users'));
  app.use('/auth',require('./routes/auth'));

app.listen(port, () => console.log(`The app is running on ${port}`));
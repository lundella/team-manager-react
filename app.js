const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 4000;

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-M2M-RI, X-M2M-Origin, x-access-token")
  next();
});

app.use(express.static('src'));
app.use(express.static('views/public'));

app.use('/resource', require('./routes/database'));

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
})
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 4000;

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static('src'));
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
})
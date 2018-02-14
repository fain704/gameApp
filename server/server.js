//dependencies
const express =     require('express');
const bodyParser =  require('body-parser');
const mongoose =    require('mongoose');
const setup =       require('./config').init();


// Initialize Express
let app = express();

const PORT =        setup.port;

//const db = process.env.MONGODB_URI || setup.db.uri;
const db = process.env.MONGODB_URI || setup.testdb.uri;
require('./db/mongoose')(db);




//setup bodyParser and express static
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));



//spin up http server
app.listen(PORT, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', PORT)
})

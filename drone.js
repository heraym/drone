var express = require("express"),
    http = require("http"),
     cors = require("cors"),
     app = express();
     bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

var PORT = process.env.PORT || 3000;

var accion = "NADA";


app.get('/drone/chequearVuelo', function(req,res) { 
console.log('chequear Vuelo ' + accion + '\n');
 res.writeHead(200, {"Content-Type": "application/json"}); 
 res.end(accion);
 accion = "NADA";  
});

app.post('/drone/volar', function(req,res) {
  console.log("El drone debe volar...");
  accion = "VOLAR";
  res.writeHead(200, {"Content-Type": "application/json"}); 
  res.end(JSON.stringify("{ accion : 'VOLAR'}"));  
});


app.listen(PORT);
console.log("Node server running on http:localhost:" + PORT);
 
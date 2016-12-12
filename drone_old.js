var express = require("express"),
    http = require("http"),
    https = require("https"),
     cors = require("cors"),
     app = express();
     bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

var accion = "NADA";
var str = ''; 
var evacuar_subte = "";
var recalibrar_sensor = "";
var chequear_fugas = "";


var options = {
  host : 'buenosaires-opa.rightnowdemo.com', 
  port : 443,
  path: '/determinations-server/assess/soap/generic/12.2.1/Protocolo__de__emergencias__subte__v1',
  method: 'POST',
  headers: {
    host : 'buenosaires-opa.rightnowdemo.com',
    SOAPAction : 'http://oracle.com/determinations/server/12.2.1/rulebase/types/Assess'
  }
};

callback = function(response) {
  str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var evacuar_subte_string = '<typ:attribute id="evacuar_subte" type="boolean" inferred="true"><typ:boolean-val>';
    i = str.indexOf(evacuar_subte_string);
    if (str.substr(i + 82,4) == "fals") {
       evacuar_subte = "false";
    } else { evacuar_subte = "true"; } 
    var recalibrar_sensor_string = '<typ:attribute id="recalibrar_sensor" type="boolean" inferred="true"><typ:boolean-val>';
    i = str.indexOf(recalibrar_sensor_string);
    if (str.substr(i + 86,4) == "fals") {
        recalibrar_sensor = "false";
    } else {  recalibrar_sensor = "true"; } 
   var chequear_fugas_string = '<typ:attribute id="chequear_fugas" type="boolean" inferred="true"><typ:boolean-val>';
    i = str.indexOf(chequear_fugas_string);
    if (str.substr(i + 83,4) == "fals") {
       chequear_fugas = "false";
    } else { chequear_fugas = "true"; } 
 
  });
}

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

app.post('/opa/protocolo', function(req,res) {
console.log("OPA " + req.body);
var valor = req.body.valor;

var requerimiento = '<?xml version="1.0" encoding="windows-1252" ?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://oracle.com/determinations/server/12.2.1/rulebase/assess/types">' +
'<soapenv:Header/><soapenv:Body><typ:assess-request>' +
'<typ:global-instance><typ:attribute id="partes_por_millon"><typ:number-val>' + valor + '</typ:number-val></typ:attribute>' +
'<typ:attribute id="recalibrar_sensor" outcome-style="value-only"></typ:attribute>' +
'<typ:attribute id="chequear_fugas" outcome-style="value-only"></typ:attribute>' +
'<typ:attribute id="evacuar_subte" outcome-style="value-only"></typ:attribute>' +
'</typ:global-instance></typ:assess-request></soapenv:Body></soapenv:Envelope>';

var reqhttp = https.request(options, callback);
reqhttp.write(requerimiento);
reqhttp.end();

setTimeout(function() {
    //res.writeHead(200, {"Content-Type": "application/json"});
    console.log("OPA" + JSON.stringify("{ 'evacuar_subte': '" + evacuar_subte + "','recalibrar_sensor' :'" + recalibrar_sensor + "','chequear_fugas':'" + chequear_fugas + "'}") ); 
    res.end(JSON.stringify("{ 'evacuar_subte': '" + evacuar_subte + "','recalibrar_sensor' :'" + recalibrar_sensor + "','chequear_fugas':'" + chequear_fugas + "'}") ); 

}, 3000);
});

app.listen(3000);
console.log("Node server running on http:localhost:3000");
 
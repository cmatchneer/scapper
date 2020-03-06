var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");



var PORT = 3000;


var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("./routes/api_routes.js")(app);
require("./routes/html-routes.js")(app);
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

app.use(logger("dev"));
// Parse request body as JSON

// Make public a static folder
app.use(express.static("public"));

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
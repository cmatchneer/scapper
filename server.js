var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");



var PORT = 3000;


var app = express();
require("./routes/api_routes.js")(app);
require("./routes/html-routes.js")(app);


app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });



// app.use(route1);
// app.use(route2);
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

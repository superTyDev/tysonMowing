// Tyson McLaws
// 8/18/22
// Server Side Code for NODE JS Express server

const express = require("express");
// const sprightly = require("sprightly");
const compression = require("compression");

const app = express();
var port = process.env.PORT || 8081;

if (process.env.FLASK_ENV != "development") {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
  });
}

// Set up templates
app.set("views", "./views"); // specify the views directory (its ./views by default)
app.set("view engine", "ejs"); // register the template engine
app.use(express.static("public"));

// Compression
const shouldCompress = (req, res) => {
  if (req.headers["x-no-compression"]) {
    return false;
  }
  return compression.filter(req, res);
};
app.use(
  compression({
    filter: shouldCompress,
    threshold: 0,
  })
);

// Home
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

// All Found Pages at Root
app.get("/:page", (req, res) => {
  var capTitle = req.params.page[0].toUpperCase() + req.params.page.substring(1);
  res.render(req.params.page, {
    title: capTitle,
  });
});

// All Found Pages on folder
app.get("/:folder/:page", (req, res) => {
  var capTitle = req.params.page[0].toUpperCase() + req.params.page.substring(1);
  res.render(req.params.folder + "/" + req.params.page, {
    title: capTitle,
  });
});

// Error Page
app.use((error, req, res, next) => {
  console.log("Error Handling Middleware called");
  console.log("Path: ", req.path);
  console.error("Error: ", error);

  if (error.message.indexOf("Failed to lookup view") != -1) {
    var errorMessage =
      "We searched all over, but no file was found at " + req.path + ".";
    res
      .status(404)
      .render("error", { errorNum: 404, errorMessage: errorMessage });
  } else {
    next(error);
  }
});

app.listen(port, console.log("running"));

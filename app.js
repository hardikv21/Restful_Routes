var express = require("express"),
app = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");

app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost:27017/restful_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var restfulSchema = new mongoose.Schema(
{
    name: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", restfulSchema);

app.get("/", function(req, res)
{
   res.redirect("/blogs"); 
});

//INDEX Route
app.get("/blogs", function(req, res)
{
    Blog.find({}, function(err, blogs)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
            res.render("index", {blogs: blogs});     
       }
    });
});

//NEW Route
app.get("/blogs/new", function(req, res) 
{
   res.render("new"); 
});

//CREATE Route
app.post("/blogs", function(req, res)
{
    req.body.blog.description = req.sanitize(req.body.blog.description);
   Blog.create(req.body.blog, function(err, newBlog)
   {
      if(err)
      {
          res.render("new");
      }
      else
      {
          res.redirect("/blogs");
      }
   }); 
});

//SHOW Route
app.get("/blogs/:id", function(req, res) 
{
    Blog.findById(req.params.id, function(err, foundBlog)
    {
       if(err)
       {
            res.redirect("/blogs");   
       }
       else
       {
            res.render("show", {foundBlog: foundBlog});   
       }
    });
});

//EDIT Route
app.get("/blogs/:id/edit", function(req, res) 
{
    Blog.findById(req.params.id, function(err, foundBlog)
    {
       if(err)
       {
            res.redirect("/blogs");   
       }
       else
       {
            res.render("edit", {foundBlog: foundBlog});   
       }
    });
});

//UPDATE Route
app.put("/blogs/:id", function(req, res)
{
    req.body.blog.description = req.sanitize(req.body.blog.description);
    Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, blog)
    {
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.redirect("/blogs/" + req.params.id);
       }
    }); 
});

//DELETE Route
app.delete("/blogs/:id", function(req, res)
{
   Blog.findOneAndDelete(req.params.id, function(err, blog)
    {
       if(err)
       {
           res.send(err);
       }
       else
       {
           res.redirect("/blogs/");
       }
    }); 
});

app.listen(process.env.PORT, process.env.IP, function()
{
   console.log("SERVER STARTED!!"); 
});
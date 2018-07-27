var express = require('express'),
    methodOverride = require('method-override'),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();
const PORT = process.env.PORT;
mongoose.connect("mongodb://localhost/my_blog");
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  created: { type: Date, default: Date.now()},
});

var Blog =  mongoose.model("Blog", blogSchema);

app.get("/",(req, res) => {
  res.redirect("/blogs");
})


app.get("/blogs",(req, res) => {
  Blog.find({} , (err,data) => {
    console.log(data);
    res.render("blogs",{blogs: data});
  });

});

app.get("/blogs/new", (req,res) => {
  res.render("new");
});

app.post("/blogs", function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      res.render("new");
    }else {
      res.redirect("blogs");
    }
  })
});

app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id,function(err,foundBlog) {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show",{blog: foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id,function(err,foundBlog) {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit",{myblog: foundBlog});
		}
	});
});

app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog,function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs");
    }
  })
});
// Blog.create({
//   title: "Rooster",
//   body:"Shaheem and Shaheen are commonly called this term",
//   image: "https://pixabay.com/get/ea30b50829f5023ed1584d05fb1d4e97e07ee3d21cac104496f2c470a6e4b3bd_340.jpg"
// });
app.listen(PORT, function() {
  console.log("Server Listening "+PORT)
})

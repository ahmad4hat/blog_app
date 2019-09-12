var bodyParser  =   require("body-parser"),
mongoose        =   require("mongoose"),
expressSanitizer =require("express-sanitizer"),
methodOveride=require("method-override"),
express         =   require("express"),
app             =   express();

mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOveride("_method"));

var blogSchema=new mongoose.Schema({
    title:{type:String,default:"Nothing was written"},
    image : {type:String,default:"Nothing was written"},
    body: {type:String,default:"Nothing was written"},
    created :{type:Date,default:Date.now}
})

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1526289636136-bce3fd37f962?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
//     body:"this is for test route"

// });

//routes
//index
app.get("/",function(req,res){
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
    
    Blog.find({},function(err,blogs){
        if(err)
        {
            console.log("something went wrong")
        }
        else
        {
            res.render("index",{blogs:blogs});
        }
    });

   
})

//new

app.get("/blogs/new",function (req,res){
    res.render("new")
});
//create
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
        {
            console.log("Somethine went Wrong");
        }
        else
        {
            res.redirect("/blogs")
        }
    });
})
//show 
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function (err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else 
        {
            res.render("show",{blog:foundBlog});
        }
    });
})
//edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function (err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else 
        {
            res.render("edit",{blog:foundBlog});
        }
    });
})
//update
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        {
            res.redirect("/blogs/");
        }
        else
        {
            res.redirect("/blogs/"+req.params.id);
        }
    });
})

//delete 
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
})
app.listen(3000,function(){
    console.log("server is running");
})


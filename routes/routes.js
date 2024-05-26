const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer =require('multer');


// immage upload 
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads");
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+ "_" + Date.now()+ "_" + file.originalname);

    },
});


var upload = multer({
    storage: storage,
}).single("image");

// insert an user into database 
router.post("/add",upload,(req,res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    }); 
   
      user.save()
        .then((savedDocument) => {
            req.session.message={
                type:'success',
                message: 'User Added Succesfully!',
            };
        //   console.log('Document saved:', savedDocument);
          res.redirect("/");
        })
        .catch((error) => {
          res.json({message:error.message,type:'Danger'});
        });
   
});
router.get("/",(req,res)=>{
    User.find().exec()
    .then((users) => {
      res.render('index', {
        title: 'Home Page',
        users: users,
      });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
  
});
router.get("/add",(req,res)=>{
    res.render("add_users",{title:"Add User"});
});

router.get("/about",(req,res)=>{
    res.render("about",{title:"About"});
});
router.get('/edit/:id',(req,res)=>{
  id

});
module.exports = router;
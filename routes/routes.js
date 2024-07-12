const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer =require('multer');
const fs = require('fs');


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
        fathername: req.body.fathername,
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

// edit an user route 
router.get('/edit/:id',(req,res)=>{
  let id = req.params.id;
  User.findById(id)
  .then(user => {
    if (!user) {
      return res.redirect('/');
    }
    res.render('edit_users', {
      title: 'Edit User',
      user: user,
    });
  })
  .catch(err => {
    res.redirect('/');
  });

});

// Update User route 
router.post('/update/:id',upload,(req,res)=>{
  let id = req.params.id;
  let new_image ='';
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/' + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  })
    .then(result => {
      req.session.message = {
        type: 'success',
        message: 'User updated successfully',
      };
      res.redirect('/');
    })
    .catch(err => {
      res.json({ message: err.message, type: 'danger' });
    });
});

async function deleteUserById(req, res) {
  const id = req.params.id;

  try {
    // Use `findByIdAndDelete` with `await`
    const result = await User.findByIdAndDelete(id).exec();

    if (result && result.image) {
      try {
        // Await the unlink operation
        await unlinkAsync(`./uploads/${result.image}`);
      } catch (unlinkErr) {
        console.log(unlinkErr);
      }
    }

    // Set the session message
    req.session.message = {
      type: "info",
      message: "User deleted successfully!",
    };

    // Redirect to home
    res.redirect("/");
  } catch (err) {
    // Send JSON response with error message
    res.json({ message: err.message });
  }
}

// Example of using this function in an Express route
router.get('/delete/:id', async (req, res) => {
  await deleteUserById(req, res);
});
module.exports = router;
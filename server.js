const express = require('express');

const mongoose = require('mongoose');
const Register = require('./users.js');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');


const uri = "mongodb+srv://AdminBloodhub:IeowaMIAljoPPgEE@bloodhubcluster.z5jed.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error',error => console.log(error));
db.once('open', ()=> console.log("Mongoose Online & Connected"));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get(['/'], function (req,res){
    res.render('index');
})

app.get('/register', function (req,res){
    res.render('register');
})

app.post('/login', async(req,res)=>{
    try {
        const user = req.body.user;
        const password = req.body.password;

      const userLogin = await Register.findOne({username:user});

      if (userLogin.pass === password){

        let search = await Register.find({aoe:"Marketing"})
        const ae = "Marketing"

        app.post('/search', async (req,res)=>{
            let sData = req.body.aoe;
            let search = await Register.find({aoe:{$regex: sData,$options:'$j'}})
            .then(data=>{
                res.render('searched', {data:data,aoe:sData,user:userLogin})
            })
        })

        app.get("/logout",(req,res)=>{
            res.redirect("/");
        });

        res.status(201).render("loggedIn",{data:userLogin,search:search,abcd:ae})
        
      }else{
        res.render('indexError')
      }
        
    } catch (error) {
        res.render('index')
    }
})


app.post('/signup', async (req,res)=>{
    try {

        const pass = req.body.pass1;
        const cpass = req.body.pass2;

        if( pass === cpass){

            const registerUser = new Register({
                username: req.body.username,
                name:req.body.name,
                dob:req.body.dob,
                email:req.body.email,
                occupation:req.body.occupation,
                aoe:req.body.interest,
                pass:req.body.pass1,
                repass:req.body.pass2,
                gender:req.body.gender
            })

           const register = await registerUser.save();
           res.status(201).render("index")

        }else{
            res.render('register')
        }

    } catch (error) {
        res.render('register')
    }
})

const PORT = process.env.PORT || 5555;  ``

app.listen(PORT, ()=> console.log(`Server started on http://localhost:${PORT}/`))

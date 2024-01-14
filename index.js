const ejs = require('ejs');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const getConnect = require('./dbconfig');
const bodyParser = require('body-parser');   //bodyparser is used while post request so you will need the body of the request so body parser is used

// app.use(express.urlencoded({
//     extended: false
// }));

const urlencodedParser = bodyParser.urlencoded({ extended: false });

//const ObjectId=require('mongoose').ObjectId;
const Port = 5000;

app.set('view engine', 'ejs');
app.use(express.static('./public')); //this is used to get our js , images , css file in ejs


app.get('/signup', (req, res) => {
    // if (req.query.name1 != null){
    //     let username=req.query.name1;
    //     console.log(username);
    // }
    let msg="";
    res.render('signup',{msg});
});

app.post('/signup',urlencodedParser, async(req,res)=>{
    try{
        {
        let username=req.body.name1;
        let email=req.body.email1;
        let password=req.body.password1;
        console.log(username);
        console.log(password);
        if(username && email && password){
        const user = await getConnect();
        const data = mongoose.model('listdata', user);
        const udata = await data.create({ 'name': username , 'email': email, 'password': password});
        mongoose.models = {};

           res.redirect('/');
           console.log('successful');
        }
        else{
            console.log('login failed');
            let msg = 'Please fill details Properly';
            return res.render('signup', { msg });
        }
        }
    }catch(err){
        console.log(err);
        let msg = 'Error !!';
        return res.render('signup', { msg });
    };
});

app.get('/login', (req, res) => {
    let msg='';
    res.render('login',{msg});
});
app.post('/login', urlencodedParser, async (req, res) => {
    try {
        let username = req.body.t1;
        //console.log(username);
        const user = await getConnect();
        const data = mongoose.model('listdata', user);
        const udata = await data.findOne({ name: username });
        mongoose.models = {};
        //console.log(udata);
        if (udata) {
            const result = (req.body.t2 == udata.password);
            //console.log(result);
            if (result) {
                return res.redirect('/');
            }
            else {
                // console.log('Invalid user details');
                let msg = 'Invalid user details';
                return res.render('login', { msg });
            }
        }
        else {
            let msg = 'Please Enter Your Details';
            res.render('login', { msg });
        }
    } catch (err) { console.log(err) };
});


app.get('/',urlencodedParser ,async (req, res) => {

    const todolistschema = await getConnect();
    const todomodel = mongoose.model('listdata', todolistschema);
    const data = await todomodel.find({});
    mongoose.models = {};
    res.render('main', { data });
    // console.log(data);
});


app.get('/Create', async (req, res) => {
    if (req.query.s1 != null) {
        let t = req.query.t;
        let t0 = req.query.t0;
        let t1 = req.query.t1;
        let t2 = req.query.t2;
        const todolistschema = await getConnect();
        const todomodel = mongoose.model('listdata', todolistschema);
        //const data = await todomodel.insertMany({ 'id': t, 'name': t0, 'topic': t1, 'notes': t2 });
        const data = await todomodel.create([{ 'id': t, 'name': t0, 'topic': t1, 'notes': t2 }]);
        //console.log(data);
        mongoose.models = {};
        let msg = 'Saved Successfully (*_*)';
        res.render('create', { msg });
    }
    else {
        // res.render('home');
        // console.log('Error!!');
        let msg = '';
        res.render('create', { msg });
    }
});


// app.get('/find', async (req, res) => {
//     // res.send('this page is from server');
//     const todolistschema = await getConnect();
//     const todomodel = mongoose.model('listdata', todolistschema);
//     const data = await todomodel.findOne({ 'id': 101 });
//     res.send(data);
//     console.log(data);
// });

app.get('/del', async (req, res) => {
    try {
        let uid = req.query.uid;
        // console.log(uid);
        const db = await getConnect();
        const collection = mongoose.model('listdata', db);
        let ddata = await collection.findOneAndDelete({ '_id': uid });
        //mongoose.models={};
        const data = await collection.find({});
        mongoose.models = {};
        res.render('main', { data });
    } catch (err) {
        console.log(err);
    }
});


app.get('/update', async (req, res) => {
    try {
        let uid = req.query.uid;
        // console.log(uid);
        const db = await getConnect();
        const collection = mongoose.model('listdata', db);
        let rs = await collection.find({ '_id': uid });
        mongoose.models = {};
        res.render('update', { rs });
    } catch (err) {
        console.log(err);
    }
});

//this is update route
app.get('/updatedata', async (req, res) => {
    let uid = req.query.t3;
    //console.log(uid);
    let gid = req.query.t;
    let name = req.query.t0;
    let topic = req.query.t1;
    let notes = req.query.t2;
    let date = req.query.t4;

    let db = await getConnect();
    let collection = mongoose.model('listdata', db);
    let r = await collection.updateOne({ '_id': uid }, {
        $set: {
            'id': gid,
            'name': name,
            'topic': topic,
            'notes': notes,
            'created_at': date
        }
    });
    mongoose.models = {};
    let data = await collection.find({});
    mongoose.models = {};
    res.render('main', { data });
});


app.listen(Port, () => {
    console.log('Server is Running at Port:' + Port);  //localhost:5000
});
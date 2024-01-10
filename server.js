var express = require('express');
var app = express();
var path = require("path");
var cors = require('cors')
var bodyParser = require('body-parser');
var mongo = require("mongoose");
var expModel = require('./expenses.model');
var multer = require('multer')
const upload = multer({ dest: "uploads/" });
const DB = "mongodb+srv://rajeshkh76:rajesh@cluster0.2e8kjso.mongodb.net/society?retryWrites=true&w=majority"
var db = mongo.connect(DB, function(err, response){
if(err){ console.log( err); }
else{ console.log('Connected to ' + db, ' + ', response); }});

    
app.use(cors()) 
app.use(express.static('dist/my_home_list'))
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(function (req, res, next) {
   
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://122.169.10.197/home', 'http://127.0.0.1:4200/home, http://127.0.0.1:8080/api/getUser/');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests')
    
        // Pass to next layer of middleware
        next();
    });
next();});
var Schema = mongo.Schema;
var UsersSchema = new Schema({
firstName: { type: String },
lastName: { type: String },
email: { type: String },
phoneNo: { type: String },
},{ versionKey: false });
var monthSchema = new Schema({
    name: { type: String },
    flatNo: { type: String },
    amount: { type: Number },
    paidDate: { type: Date },
    transactionMode: { type: String },
    transactionId: { type: String },
    comment: { type: String },
    },{ versionKey: false });
var model = mongo.model('expenses', UsersSchema, 'expenses');
var monthModel = mongo.model('monthly-maintanence', monthSchema, 'monthly-maintanence');
app.post("/api/upload_files", upload.array("file"), uploadFiles);
function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
}
app.post("/api/SaveUser",function(req,res){
var mod = new monthModel(req.body);
if(req.body){
mod.save(function(err,data){
if(err){
res.send(err);
}else{
res.send({data:"Record has been Inserted..!!"});
}});}else{monthModel.findByIdAndUpdate(req.body.id, { 
    name: req.body.name, 
    flatNo: req.body.flatNo,
    amount:req.body.amount,
    paidDate:req.body.paidDate, 
    transactionMode:req.body.transactionMode, 
    transactionId:req.body.transactionId,
    comment:req.body.comment},
function(err,data) {
if (err) {
res.send(err);
}else{
res.send({data:"Record has been Updated..!!"});
}});
}})
app.post("/api/SaveExpenses",function(req,res){
    var mod = new expModel(req.body);
    if(req.body){
    mod.save(function(err,data){
    if(err){
    res.send(err);
    }else{
    res.send({data:"Record has been Inserted..!!"});
    }});}else{expModel.findByIdAndUpdate(req.body.id, { 
        name: req.body.name, 
        flatNo: req.body.flatNo,
        amount:req.body.amount,
        paidDate:req.body.paidDate, 
        comment:req.body.comment},
    function(err,data) {
    if (err) {
    res.send(err);
    }else{
    res.send({data:"Record has been Updated..!!"});
    }});
    }})
app.post("/api/deleteUser",function(req,res){
model.remove({ _id: req.body.id }, function(err) {
if(err){
res.send(err);
}else{
res.send({data:"Record has been Deleted..!!"});
}});})
app.get("/api/getUser",function(req,res){model.find({},function(err,data){
if(err){
res.send(err);
}else{
res.send(data);
}});})
var memberSchema = {
    members : [{label: String, value: String}]
}
var memberModel = mongo.model('memeber-list', memberSchema, 'member-list');
app.get("/api/getMemeberList",function(req,res){
    memberModel.find({},function(err,data){
    if(err){
    res.send(err);
    }else{
    res.send(data);
}});})
//var monthexpModel = mongo.model('monthly-expenses', monthSchema, 'monthly-expenses');
app.get("/api/getMonthlyExp",function(req,res){expModel.find({
    
        // "paidDate": {
        //   "$gte": "2023-12-18T04:38:39.320Z",
        //   "$lte": "2023-12-19T04:38:39.320Z"
        // }
      
},function(err,data){
    if(err){
    res.send(err);
    }else{
    res.send(data);
}});})
var monthexpModel = mongo.model('monthly-maintanence', monthSchema, 'monthly-maintanence');
app.get("/api/getMonthlyMaintanence",function(req,res){monthexpModel.find({
    
    // "paidDate": {
    //   "$gte": "2023-12-18T04:38:39.320Z",
    //   "$lte": "2023-12-19T04:38:39.320Z"
    // }
  
},function(err,data){
if(err){
res.send(err);
}else{
res.send(data);
}});})
var port = process.env.PORT || 8081;
app.listen(port, function () {
console.log('Example app listening on port 8081!')})
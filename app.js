require("dotenv").config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const got=require("fix-esm").require('got');
app.use(express.static(__dirname+"/"));
const https=require("https");

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signUp.html");
})

app.post("/",function(req,res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    let data={
        members:[
        {
            email_address:email,
            status:"subscribed",
            merge_fields:{
            FNAME:firstName,
            LNAME:lastName
            }
        }
        ]
    };
    const jsonData=JSON.stringify(data);

    const url=`https://us8.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_KEY}`
    const options={
        method:"POST",
        auth:`Debshankar:${process.env.RANDOM_API_TOKEN}`
    };
    const request=https.request(url,options,function(response){
        if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/Failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
})

app.post("/fail",function(req,res){
    console.log("hello");
    res.redirect("/");
})






app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})
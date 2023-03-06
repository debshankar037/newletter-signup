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

    const url="https://us8.api.mailchimp.com/3.0/lists/66727dfb01"
    const options={
        method:"POST",
        auth:"Debshankar:b3a94de9e8fe0884c019fa8e3ee18444-us8"
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

/*api key
b3a94de9e8fe0884c019fa8e3ee18444-us8*/
/*audience key
66727dfb01
*/ 
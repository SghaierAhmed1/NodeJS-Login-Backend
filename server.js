const express = require('express');
const keys = require ('./config/keys.js');
const app = express();
//DB Setup
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
//Model Setup
require('./model/Account');
const Account = mongoose.model('accounts');
// Route
app.get('/account', async (req, res) => {
 const { rUsername , rPassword } = req.query;
 if (rUsername == null || rPassword == null)
 {
     res.send("Invalid Credentials");
     return;
 }
 
 var userAccount = await Account.findOne({username: rUsername});
 if (userAccount == null)
 {
      //Create a new account
      console.log("Create new account ...")
      var newAccount = new Account ({
          username : rUsername,
          password : rPassword,

          lastAuthentication : Date.now()
      });
      await newAccount.save();
      res.send(newAccount);
      return;
      
 } else {
     if(rPassword == userAccount.password)
     {
         userAccount.lastAuthentication = Date.now();
         await userAccount.save();
         console.log("Retrieving Account");
         res.send(userAccount);
         return;
     }
 }

 res.send ("Invalid Credentials");
 return;



});

app.listen(keys.port, () =>{
 console.log ("Listening on " + keys.port);
});
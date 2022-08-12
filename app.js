const express=require('express')
const fs=require('fs')
const app = express();
const path=require('path')
const port=100
const mongoose = require("mongoose");
const bodyparser=require('body-parser')
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/notessave");
  console.log("We are connected");
}
const notesschema = new mongoose.Schema({
  Name:String,
  Title:String,
  Desc:String,
});
const notes = mongoose.model('notes', notesschema);
app.use('/static',express.static('static'))
app.use(express.urlencoded())
//set the templates engine as pug
app.set('view engine', 'pug')
//set the views directory
app.set('views',path.join(__dirname,'views'))
app.get('/',(req,res)=>{
    res.status(200).render('save.pug')
  })
app.post('/',(req,res)=>{
var data=new notes(req.body);
console.log(data);
data.save().then(()=>{
  res.status(200).render('save.pug')
}).catch(()=>{
  res.catch(()=>{
    res.status(400).send('Notes not saved')
  })
})
})
app.get('/seenotes',(req,res)=>{
  res.status(200).render('see.pug')
})
app.post('/seenotes',(req,res)=>{
  var data=new notes(req.body);
  // res.status(200).render('see.pug');
  // console.log(data.Name);
  notes.find({$or:[{Name:data.Name},{Title:data.Title}]},(err,notes)=>{
    if(err)return console.error(err);
      res.send(notes)
  })
})
  app.listen(port,()=>{
    console.log(`The app is successfully starting ${port}`)
})
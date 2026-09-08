const express=require("express"),fs=require("fs"),path=require("path");
const app=express(),PORT=process.env.PORT||3000,DB=path.join(__dirname,"data.json");
const users=[{id:"masur",first:"Lurin",last:"Masur"},{id:"ducommun",first:"Nelio",last:"Ducommun"},{id:"schwaegli",first:"Camille",last:"Schwägli"}];
app.use(express.json());app.use(express.static(path.join(__dirname,"public")));
function read(){try{return JSON.parse(fs.readFileSync(DB,"utf8"))}catch{return {sessions:{},claims:[]}}}
function write(d){fs.writeFileSync(DB,JSON.stringify(d,null,2))}
app.get("/api/users",(req,res)=>res.json(users));
app.post("/api/claim",(req,res)=>{const {date,userId}=req.body||{};if(!date||!users.some(u=>u.id===userId))return res.status(400).json({error:"Ungültige Angaben"});const d=read();d.claims=d.claims.filter(c=>c.date!==date);d.claims.push({date,userId});write(d);res.json({ok:true});});
app.get("/api/claims",(req,res)=>res.json(read().claims));
app.delete("/api/claim/:date",(req,res)=>{const d=read();d.claims=d.claims.filter(c=>c.date!==req.params.date);write(d);res.json({ok:true})});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`Neliomittag läuft auf Port ${PORT}`));

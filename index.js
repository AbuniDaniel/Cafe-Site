const express = require('express');
var app = express();
const fs = require('fs');
const path = require("path");
const sharp = require('sharp');
const {Client} = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'daniel',
  password: 'daniel',
  database: 'postgres',
  port:5432
})
client.connect()


app.set("view engine", "ejs");
console.log("Dirname: ", __dirname);
app.use("/resurse", express.static(__dirname + "/resurse"));


function verificaImagini(){
  var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
  var jsi=JSON.parse(textFisier); //am transformat in obiect

  var caleGalerie=jsi.cale_galerie;
  let vectImagini=[]
  for (let im of jsi.imagini){
    let imVeche= path.join(caleGalerie, im.cale_fisier);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
    var ext = path.extname(im.cale_fisier);//obtin extensia
    var numeFisier =path.basename(im.cale_fisier,ext)//obtin numele fara extensie
    let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");//creez cale apentru imaginea noua; prin extensia wbp stabilesc si tipul ei
    let imMedie=path.join(caleGalerie+"/medie/", numeFisier+"-medie"+".jpg");
    var luna = new Date().getMonth();
    //vectImagini.push({mare:imVeche, mic:imNoua, text_descriere:im.text_descriere});

    if((luna == 11 || luna == 0 || luna == 1) && im.anotimp == "iarna")
      vectImagini.push({mare:imVeche, medie:imMedie, mic:imNoua, text_descriere:im.text_descriere});
    else if((luna == 2 || luna == 3 || luna == 4) && im.anotimp == "primavara")
      vectImagini.push({mare:imVeche, medie:imMedie, mic:imNoua, text_descriere:im.text_descriere});
    else if((luna == 5 || luna == 6 || luna == 7) && im.anotimp == "vara")
      vectImagini.push({mare:imVeche, medie:imMedie, mic:imNoua, text_descriere:im.text_descriere});
    else if((luna == 8 || luna == 9 || luna == 10) && im.anotimp == "toamna")
      vectImagini.push({mare:imVeche, medie:imMedie, mic:imNoua, text_descriere:im.text_descriere});

    if (!fs.existsSync(imMedie))//daca nu exista imaginea, mai jos o voi crea
      sharp(imVeche)
          .resize(350) //daca dau doar width(primul param) atunci height-ul e proportional
          .toFile(imMedie, function(err) {
            if(err)
              console.log("eroare conversie",imVeche, "->", imMedie, err);
          });

    if (!fs.existsSync(imNoua))//daca nu exista imaginea, mai jos o voi crea
      sharp(imVeche)
          .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
          .toFile(imNoua, function(err) {
            if(err)
              console.log("eroare conversie",imVeche, "->", imNoua, err);
          });
  }

  return vectImagini;
}


app.get(["/","/index"], function(req,res){
  /*res.setHeader("Content-Type", "text/html");
  console.log("Salut 1");
  res.write("<!DOCTYPE html><html><head><title>Node!!!</title></head><body><p style='color:red;'>Salut gion</p>");
  res.write("</body></html>");
  res.end();*/
  verificaImagini()
  res.render("pagini/index", {imagini: verificaImagini(), ip: req.ip});
});

app.get("/data", function(req,res){
  res.setHeader("Content-Type", "text/html");
  res.write("<!DOCTYPE html><html><head><title>Node!!!</title></head><body>"+ new Date());
  res.write("</body></html>");
  res.end();
});


app.get("/produse", function(req,res){

  var conditie = req.query.categ ? " where tip_produs='"+req.query.categ+"'" : "";
  //console.log("select id, nume, descriere, pret, tip_lapte, calorii, ingrediente, decofeinizata, imagine from cafele"+conditie_mica);
  client.query("select * from cafele"+conditie, function(err,rez){
    //console.log(err, rez);
    res.render("pagini/produse", {produse:rez.rows});

  });
});


app.get("/produs/:id_cafea", function(req,res){
  console.log(req.params);

  const rezultat = client.query("select * from cafele where id="+req.params.id_cafea, function(err,rez){
    //console.log(err, rows);
    console.log(rez.rows);
    res.render("pagini/produs", {prod:rez.rows[0]});
  });

});

app.get("*/galerie.json", function(req,res){
  res.render("pagini/403")
});

app.get("/*", function(req,res){
  res.render("pagini" + req.url, function(err,rezultatRandare){
    if(err){
      if(err.message.includes("Failed to lookup view")){
        res.status(404).render("pagini/404");
      }
      else
        throw err;
    }
    else{
      res.send(rezultatRandare);
    }
  });
});



console.log("Salut 2");
app.listen(8080);
console.log("Serverul a pornit");
const express = require('express'); //utilisation du module express pour le serveur 
const fs = require('fs') // utilisation du module fs pour les fichiers
const app = express(); //utilisation du module express pour les routes
const port = 8000;
const ejs = require('ejs') // utilisation d'ejs pour l'injection de données
const indexFile = fs.readFileSync('./frontend/index.html', 'utf-8');
const style = fs.readFileSync('./frontend/style.css', 'utf-8');
const forbidden = fs.readFileSync('./frontend/forbidden.html', 'utf-8')
const detailstyle = fs.readFileSync('./frontend/details.css')
const details =fs.readFileSync('./frontend/details.html','utf-8')
app.use(express.static('frontend')); //utilisation du dossier statique frontend


const data= require('./cpu.json')



const cors = require('cors'); // pour eviter des bloquages

app.use(cors({
    origin: '*'
}))


const cpuRoutes =require('./route/sneakers'); //utilisation de la route  pour récupérer les données sur les articles qui est configurée dans le fichier sneakers.js

app.use(cpuRoutes);

app.get('/home',(req, res)=>{  // comportement du serveur pour la route de base /home
    
    
      // On envoye la page HTML avec les informations dynamiques au client
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(indexFile);

     
      res.end();
})




/app.get('/details/:id',(req, res)=>{ // comportement du serveur pour la route /details/:id


    const cpus = data.intel;  // récuperation des données "intel" du fichier cpu.json
    const id =req.params.id;  // paramètre de recherche
    const cpu = cpus.find(s => s.id== id)  
    
    if (!cpu){
        res.status(404).send('cpu not found')
    }else{
        const renderedresult = ejs.render(details, {
         
            name:cpu.name,
            price:cpu.price,
            
            description:cpu.description,
            cores: cpu.cores,
            threads: cpu.threads,                 //envoi des caractéristiques de l'article au client
            image:cpu.img_1,
            image2:cpu.img_2,
            image3:cpu.img_3,
            imagetrailer : cpu.img_trailer_1,
            imagetrailer2 : cpu.img_trailer_2,
            imagetrailer3 : cpu.img_trailer_3,
            frequence: cpu.frequence,
            memoire: cpu.memory,

            id : cpu.id


    },)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(renderedresult); //envois des données sur la page html "details"
    
        res.end();

}
}),

app.get('',(req, res)=>{

    
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
   // res.write(forbidden);
   
    res.end();
})

app.listen(port, ()=> console.log(`listening on port ${port}`) );
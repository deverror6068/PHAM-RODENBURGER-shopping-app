const url = "http://localhost:8000";




const container = document.querySelector('.ctn-sneakers');   // selecteur pour  la div contenant les articles
const pickers = document.querySelectorAll('.picker');         // selecteur pour  les  catégories 
const numbersofcores = document.querySelectorAll('.cores')        // selecteur pour  le filtre nombre de coeurs
const thermalconsumption = document.querySelectorAll(".watt")    // selecteur pour  le filtre consommation de watt
const generations = document.querySelectorAll(".gen")            // selecteur pour  le filtre generation
let isproductlinechecked = false ;    
let isnumbercoreschecked = false;  // booléen  pour savoir si  le filtre nombre de coeurs est coché
let thermalconsumptionchecked=false;     // booléen  pour savoir si  le filtre  consommation de watt est coché
let isgenerationschecked=false;         // booléen  pour savoir si  le filtre  générations est coché
let cpus;                               // utilisé lors du fetch pour importer toutes le données "cpus" du fichier json 
let filteredSneakers                    // résultat(s) de la recherche après avoir filtré les cpu selon les caractères de recherche
let pretotalprice = 0;






function loadSneakers() { // fonction pour charger les articles

    fetch(`${url}/cpus`)  //récuperation  de donnée via la routes cpus 
    
    .then(response => {   //récupération de la réponse
        return response.json()
        
    })
    .then(data =>{   //manipulation des donnée récupérés
        cpus= data.cpus;  //tout les résultats cpus
       
        filteredSneakers = data.cpus; // résultat(s) de la recherche après avoir filtré les cpu selon les caractères de recherche
        getSneakers(); // appel de la fonction qui s'occupe de l'affichage des articles
        
        loadCart(); // appel de la fonction de chargement de panier
    })
    .catch (error => {
        console.log('error : '+ error);
    })
}

//affichage des articles
function getSneakers(){
    container.innerHTML = ""; 
    
    filteredSneakers.forEach(cpu => { // pour chaque cpu 
        let sneakerCtn = document.createElement("div");  //creation div  d'article individuel
        let reductionpercentage = 0; 
        let precentageoff = cpu.reduction*100  // var d'affichage pourcentage
        let ancienprice =cpu.price;  // prix barré
        let cpusale  =0; // prix avec la réduction
        if(cpu.reduction>0) {         // si l'article possède une réduction
            reductionpercentage = 1 -cpu.reduction   // on soustrait  1 par le pourcentage de réduction 
             cpusale= cpu.price * reductionpercentage   // on multiplie l'ancien prix par l'ancien résultat
             
            sneakerCtn.classList.add("sneaker-item"); //génération de la div conntenant les photo le prix et le nom de l'article ainsi que les boutons voir plus et ajouter au panier
            sneakerCtn.innerHTML= `    
            <a href="http://localhost:8000/details/${cpu.id}"><img    onmouseover="printhover(${cpu.id})" onmouseout="restoreimg(${cpu.id})"  style = "scale:0.6;" id="${cpu.id}" class="sneaker-img" src="${cpu.img_1}" alt="sneaker"/></a>
            <a href="http://localhost:8000/details/${cpu.id}"><div class="sneaker-name">${cpu.name}</div></a>
            <div id="ancienprice" ><strike>${ancienprice}$</strike> ${cpusale}$<div/>
        
            <div id="percentoff"  style="color:red;"><b>-${precentageoff}%</b><div/>
            <button alt="    Ajouter au panier" title="Ajouter au panier" id="buttonshopnow" onclick="addSneaker(${cpu.id})">   <img  id="shopnow"src="/icons/shopnow.png"> </button>
            <button  id="buttonviewmore"onclick="window.location.href='http://localhost:8000/details/${cpu.id}'">Voir fiche produit &nbsp  <img  id="viewmore"src="/icons/viewmore.png"></button>
            `;
        }else{ // si l'article n'a pas de reduction
        sneakerCtn.classList.add("sneaker-item");
        sneakerCtn.innerHTML= `
        <a href="http://localhost:8000/details/${cpu.id}"><img    onmouseover="printhover(${cpu.id})" onmouseout="restoreimg(${cpu.id})"  style = "scale:0.6;" id="${cpu.id}" class="sneaker-img" src="${cpu.img_1}" alt="sneaker"/></a>
        <a href="http://localhost:8000/details/${cpu.id}"><div class="sneaker-name">${cpu.name}</div></a>
        <div id="price">${cpu.price}$<div/>
        <button alt ="ajouter au panier " title="     Ajouter au panier" id="buttonshopnow" onclick="addSneaker(${cpu.id})">   <img  id="shopnow"src="/icons/shopnow.png"> </button>
        <button  id="buttonviewmore"onclick="window.location.href='http://localhost:8000/details/${cpu.id}'">Voir fiche produit &nbsp  <img  id="viewmore"src="/icons/viewmore.png"></button>
        `;
        }
        
        container.appendChild(sneakerCtn);
    })               // chaque élément  suivant qui sera cliqué activera une fonction
    pickers.forEach(picker => {          
        picker.addEventListener('click', selectItem)
       
    },
    numbersofcores.forEach(numberofcores=>{
        numberofcores.addEventListener('click', checkcorechecked,) //chaque fonction avec check vont vérifier si il n'y a pas d'autres checkbox cochées que celle qui a activé ce Trigger
    }),
    thermalconsumption.forEach(tdp=>{
        tdp.addEventListener('click',checktdpchecked)
    }),
    generations.forEach(gen0 =>{
        gen0.addEventListener('click',checkgenchecked)
    })
    )


}

function printhover(e){    // fonction qui va afficher la 2 èmer photo
   
    let idelement =document.getElementById(e) //cible l'élèment cliqué 
    const correctid = cpus.find(s => s.id == e)  // on trie les articles pour trouver celui qui correspond à l'id de l'élément
    let ancienid = idelement.src   // on récupère l'adresse  de l'image 1
 
    idelement.src = correctid.img_2 //on remplace l'adresse de la première image par la seconde
    
    
    }

function restoreimg(e){
    let idelement =document.getElementById(e)
    const correctid = cpus.find(s => s.id == e)   // on trie les articles pour trouver celui qui correspond à l'id de l'élément
    idelement.src = correctid.img_1  //on remplace l'adresse de la seconde image par la première
}





function checkcorechecked(e){   //fonction check pour le nombre de coeurs
    let coreplusgen = false;
    let corevalue
    let genvalue
    let tdpvalue
    const isChecked = Array.prototype.find.call(numbersofcores, checkbox => checkbox.checked);  //vérifie si au moins une case est cochée
    const isChecked2= Array.prototype.find.call(generations, checkbox => checkbox.checked);  //vérifie si au moins une case est cochée
    const isChecked3= Array.prototype.find.call(thermalconsumption, checkbox => checkbox.checked);  //vérifie si au moins une case est cochée
    if (isChecked2) {
       //Au moins une case est cochée
        isgenerationschecked = true // une des cases est donc cochées
        genvalue = `${isChecked2.name}`;  // on récupère le nom de la checkbox cliquée


        
        } else {   // Aucune case n'est cochée
   
        isgenerationschecked = false
        }


    if (isChecked) {                             
   
    isnumbercoreschecked = true
    corevalue =  `${isChecked.name}`;                               // meme fonctionnement
    
    } else {
    
    isnumbercoreschecked = false
    }

    if (isChecked3){                                              // meme fonctionnement
        thermalconsumptionchecked = true                       
        tdpvalue = `${isChecked3.name}`


    } else {
        
        thermalconsumptionchecked = false
        }

   

let bools = [isgenerationschecked,isnumbercoreschecked,isproductlinechecked,thermalconsumptionchecked]  // on crée un tableau qui contient tous les bools qui vérifient quelles cases sont cochées
let count =0;


for (let i = 0; i < bools.length; i++) {  // on parcours le tableau
    if (bools[i]) {
      count++;  // on, rajoute un au  cases cochées
     
    }
  }


    if (count>=2){ // si il y a plus de filtres qui ont des checkboxs cliquées
        if(isnumbercoreschecked == true && isgenerationschecked== true&& thermalconsumptionchecked == true) {  // si des checkboxs  de nombre de coeur, de génération et  de comsommation thermique  sont cochés
          
            isnumbercoreschecked = true
           
            let sixcorescheck = e.target;   
            let cpucore = corevalue   // on va utiliser la valeur précèdement  récupérée  avec les ischecked 1,2,3
           
            numbersofcores.forEach((e) => {
                e.classList.remove('selected');  //on enleve selected au nom de la classe
            })
            sixcorescheck.classList.add('selected');
           
            let gencheck = e.target;   
            let gen = `${isChecked2.name}` // on va utiliser la valeur précèdement  récupérée  avec les ischecked 1,2,3
              
            generations.forEach((e) => {   
                e.classList.remove('selected'); //on enleve selected au nom de la classe
            })
            gencheck.classList.add('selected');
            thermalconsumptionchecked = true
           
            let tdpcheck = e.target;  // on va utiliser la valeur précèdement  récupérée  avec les ischecked 1,2,3
            let tdp = e.target.classList[1] //on va récupérer le deuxième  élément de liste contenant le nom de la classe  de (e) 
           
            thermalconsumption.forEach((e) => {
                e.classList.remove('selected');
            })
            tdpcheck.classList.add('selected');
            if (cpucore === 'all') { // si les filtres renvoie tout les articles
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore&& cpu.generation == gen && cpu.tdp == tdpvalue); // on filtres avec les trois valeurs répcupérées précèdement
       
            getSneakers();
            if(filteredSneakers.length <= 0){  // si il n 'y pas d'article renvoyé par la recherche (aucun résultats)
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
            

        } else if(isnumbercoreschecked == true && isgenerationschecked== true){  // si une checkbox de generation et de nombre de coeurs  sont cochées
            
        isnumbercoreschecked = true
       
        let sixcorescheck = e.target;
        let cpucore = corevalue
             // meme principe
        numbersofcores.forEach((e) => {
            e.classList.remove('selected');
        })
        sixcorescheck.classList.add('selected');
       
        let gencheck = e.target;
        let gen = `${isChecked2.name}`
       
        generations.forEach((e) => {
            e.classList.remove('selected');
        })                                               // meme principe
        gencheck.classList.add('selected');
        if (cpucore === 'all') {
            filteredSneakers = cpus;
            getSneakers();
        } else {
        filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore&& cpu.generation == gen);
  
        getSneakers();
        if(filteredSneakers.length <= 0){
            container.innerHTML = `<p>Aucun processeur trouvé</p>`
        }
       
        }
    

    }else if (isnumbercoreschecked == true && thermalconsumptionchecked==true){

        

        isnumbercoreschecked = true
       
        let sixcorescheck = e.target;
        let cpucore = corevalue
                 // meme principe 
        numbersofcores.forEach((e) => {
            e.classList.remove('selected');
        })
        sixcorescheck.classList.add('selected');
       
       
        let tdpcheck = e.target;
        let tdp = e.target.classList[1]
       
        thermalconsumption.forEach((e) => {
            e.classList.remove('selected');               // meme principe
        })
        tdpcheck.classList.add('selected');
        if (cpucore === 'all') {
            filteredSneakers = cpus;
            getSneakers();
        } else {
        filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore && cpu.tdp == tdpvalue);
  
        getSneakers();
        if(filteredSneakers.length <= 0){
            container.innerHTML = `<p>Aucun processeur trouvé</p>`      // meme principe 
        }
       
        }
    }else if (isgenerationschecked == true && thermalconsumptionchecked == true){

      
        
       
        let gencheck = e.target;
        let gen = `${isChecked2.name}`
        
        generations.forEach((e) => {
            e.classList.remove('selected');       // meme principe
        })
        gencheck.classList.add('selected');
       
       
        let tdpcheck = e.target;
        let tdp = tdpvalue
        
        thermalconsumption.forEach((e) => {
            e.classList.remove('selected');                         // meme principe
        })                                       
        tdpcheck.classList.add('selected');
        if (tdp === 'all') {
            filteredSneakers = cpus;
            getSneakers();
        } else {
        filteredSneakers = cpus.filter(cpu => cpu.generation == gen && cpu.tdp == tdp);
        
        getSneakers();
        if(filteredSneakers.length <= 0){
            container.innerHTML = `<p>Aucun processeur trouvé</p>`
        }
       
        }
    }

    }else{ // si seulemente un checkbox du filtre nombre de coeur à été  cochée
        selectsixcores(e) 
    }


    

}


function checkgenchecked(e){    //fonction check pour la génération fonctionne presque comme checknumberofcore

    let corevalue
    let genvalue
    let tdpvalue
    const isChecked = Array.prototype.find.call(generations, checkbox => checkbox.checked);


    const isChecked2 = Array.prototype.find.call(numbersofcores, checkbox => checkbox.checked);
    const isChecked3= Array.prototype.find.call(thermalconsumption, checkbox => checkbox.checked); // meme principe


    
    if (isChecked2) {
        
    
    isnumbercoreschecked = true
    corevalue = `${isChecked2.name}` 
    
  
    } else {
    
    isnumbercoreschecked = false
    }

    if (isChecked) {
   
    isgenerationschecked = true
    tdpvalue = `${isChecked.name}`
    
   
    } else {
    
    isgenerationschecked = false        
    }

    if (isChecked3){
        thermalconsumptionchecked = true
        tdpvalue = `${isChecked3.name}`
       


    } else {
        
        thermalconsumptionchecked = false
        }
 

let bools = [isgenerationschecked,isnumbercoreschecked,isproductlinechecked,thermalconsumptionchecked]
let count =0;

    
for (let i = 0; i < bools.length; i++) {
    if (bools[i]) {
      count++;
          // meme principe
    }
  }


    if (count>=2){
      
        if(isnumbercoreschecked == true && isgenerationschecked== true&& thermalconsumptionchecked == true) {
           
            isnumbercoreschecked = true
           
            let sixcorescheck = e.target;
            let cpucore = corevalue
            
            numbersofcores.forEach((e) => {
                e.classList.remove('selected');
            })
            sixcorescheck.classList.add('selected');

            thermalconsumptionchecked = true
           
            let tdpcheck = e.target;
            let tdp = e.target.classList[1]
         
            thermalconsumption.forEach((e) => {
                e.classList.remove('selected');
            })
            tdpcheck.classList.add('selected');
            let gencheck = e.target;
            let gen = `${isChecked.name}`
            
            generations.forEach((e) => {
                e.classList.remove('selected');
            })
            gencheck.classList.add('selected');
            if (cpucore === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore&& cpu.generation == gen && cpu.tdp == tdpvalue);
      
            getSneakers();
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        }else if ( isnumbercoreschecked == true && isgenerationschecked== true){
       
            isnumbercoreschecked = true
           
            let sixcorescheck = e.target;
            let cpucore = corevalue
            
            numbersofcores.forEach((e) => {
                e.classList.remove('selected');
            })
            sixcorescheck.classList.add('selected');
           
            let gencheck = e.target;
            let gen = `${isChecked.name}`
            
            generations.forEach((e) => {
                e.classList.remove('selected');
            })
            gencheck.classList.add('selected');
            if (cpucore === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore&& cpu.generation == gen);
      
            getSneakers()
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        
        
    
        }else if (isgenerationschecked == true && thermalconsumptionchecked == true){

           
            
           
            let gencheck = e.target;
            let gen = `${isChecked.name}`
            
            generations.forEach((e) => {
                e.classList.remove('selected');
            })
            gencheck.classList.add('selected');
           
          
            let tdpcheck = e.target;
            let tdp = tdpvalue
       
            thermalconsumption.forEach((e) => {
                e.classList.remove('selected');
            })
            tdpcheck.classList.add('selected');
            if (tdp === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.generation == gen && cpu.tdp == tdp);
            getSneakers();
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        }
        }else{
       selectgen(e)  
    }
   

}


function checktdpchecked(e){  // meme principe que pour les fonctions précèdentes
    let corevalue
    let genvalue
    let tdpvalue
    const isChecked = Array.prototype.find.call(generations, checkbox => checkbox.checked);


    const isChecked2 = Array.prototype.find.call(numbersofcores, checkbox => checkbox.checked);
    const isChecked3= Array.prototype.find.call(thermalconsumption, checkbox => checkbox.checked);

    if (isChecked2) {
    
    isnumbercoreschecked = true
    corevalue = `${isChecked2.name}` 
   
    } else {
   
    isnumbercoreschecked = false
    }
  
    if (isChecked) {
   
    isgenerationschecked = true
    genvalue =`${isChecked.name}`
   
   
    } else {
    
    isgenerationschecked = false
    }
    if (isChecked3){
        thermalconsumptionchecked = true
        tdpvalue = `${isChecked3.name}`


    } else {
        
        thermalconsumptionchecked = false
        }
    

let bools = [isgenerationschecked,isnumbercoreschecked,isproductlinechecked,thermalconsumptionchecked]
let count =0;

    
for (let i = 0; i < bools.length; i++) {
    if (bools[i]) {
      count++;
     
    }
  }


    if (count>=2){
        if(isnumbercoreschecked == true && isgenerationschecked== true&& thermalconsumptionchecked == true) {
          
            isnumbercoreschecked = true
      
            let sixcorescheck = e.target;
            let cpucore = corevalue
          
            numbersofcores.forEach((e) => {
                e.classList.remove('selected');
            })
            sixcorescheck.classList.add('selected');
          
            let gencheck = e.target;
            let gen = `${isChecked.name}`
           
            generations.forEach((e) => {
                e.classList.remove('selected');
            })
            gencheck.classList.add('selected');
            thermalconsumptionchecked = true
           
            let tdpcheck = e.target;
            let tdp = e.target.classList[1]
    
            thermalconsumption.forEach((e) => {
                e.classList.remove('selected');
            })
            tdpcheck.classList.add('selected');
            if (cpucore === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore&& cpu.generation == gen && cpu.tdp == tdpvalue);
          
            getSneakers();
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        }
        
     else if ( isnumbercoreschecked == true && isgenerationschecked== true){
        
            isnumbercoreschecked = true
          
            let sixcorescheck = e.target;
            let cpucore = corevalue
          
            numbersofcores.forEach((e) => {
                e.classList.remove('selected');
            })
            sixcorescheck.classList.add('selected');
         
            let gencheck = e.target;
            let gen = `${isChecked.name}`
          
            generations.forEach((e) => {
                e.classList.remove('selected');
            })
            gencheck.classList.add('selected');
            if (cpucore === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore&& cpu.generation == gen);
            
            getSneakers()
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        
        
    
        }else if (isgenerationschecked == true && thermalconsumptionchecked == true){

            let gencheck = e.target;
            let gen = genvalue
           
            generations.forEach((e) => {
                e.classList.remove('selected');
            })
            gencheck.classList.add('selected');
           
        
            let tdpcheck = e.target;
            let tdp = tdpvalue
            
            thermalconsumption.forEach((e) => {
                e.classList.remove('selected');
            })
            tdpcheck.classList.add('selected');
            if (tdp === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.generation == gen && cpu.tdp == tdp);
          
            getSneakers();
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        } else if (isnumbercoreschecked == true && thermalconsumptionchecked==true){

           
    
            isnumbercoreschecked = true
         
            let sixcorescheck = e.target;
            let cpucore = corevalue
         
            numbersofcores.forEach((e) => {
                e.classList.remove('selected');
            })
            sixcorescheck.classList.add('selected');
           
          
            let tdpcheck = e.target;
            let tdp = e.target.classList[1]
  
            thermalconsumption.forEach((e) => {
                e.classList.remove('selected');
            })
            tdpcheck.classList.add('selected');
            if (cpucore === 'all') {
                filteredSneakers = cpus;
                getSneakers();
            } else {
            filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore && cpu.tdp == tdpvalue);
     
            getSneakers();
            if(filteredSneakers.length <= 0){
                container.innerHTML = `<p>Aucun processeur trouvé</p>`
            }
           
            }
        }
    
        }else{
       selecttdp(e)  
    }
}


function selectItem(e){

isproductlinechecked= true

let picker = e.target;
let color = e.target.classList[2]

pickers.forEach((e) => {
    e.classList.remove('selected');
})
picker.classList.add('selected');





filterByColor(color);
}


    
function selectsixcores(e){     //on assigne les données aquise précèdement pour la cherche d'article à partir du nombre de coeur
    
    isnumbercoreschecked = true

    let sixcorescheck = e.target;
    let cpucore = e.target.classList[1]  //on va récupérer le deuxième  élément de liste contenant le nom de la classe  de (e) 
  
    numbersofcores.forEach((e) => {
        e.classList.remove('selected'); //on enlève selected du nom class
    })
    sixcorescheck.classList.add('selected');





   
    filterBycoresSix(cpucore);  //on assigne les données aquise précèdement pour la cherche d'article à partir du tdp
    }

function selecttdp(e){  //on assigne les données aquise précèdement pour la cherche d'article à partir du tdp
    thermalconsumptionchecked = true
  
    let tdpcheck = e.target;
    let tdp = e.target.classList[1]  //on va récupérer le deuxième  élément de liste contenant le nom de la classe  de (e) 
  
    thermalconsumption.forEach((e) => {
        e.classList.remove('selected');
    })
    tdpcheck.classList.add('selected');
    
   
    filterByTDP(tdp);  // appel de la fonction de la recherche d'article à partir du tdp
    }

function selectgen(e){ // appel de la fonction de la recherche d'article à partir de la génération
    
    let gencheck = e.target;
    let gen = e.target.classList[1]    // le principe est le meme que dans les fonctions précèdentes
   
    generations.forEach((e) => {
        e.classList.remove('selected');
    })
    gencheck.classList.add('selected');

        filterBygen(gen);
    }



    function filterBycoresSix (cpucore) {  //recherche d'article selon le nombre de coeur


if (cpucore === 'all') {
            filteredSneakers = cpus;
            getSneakers();
        } else {
        filteredSneakers = cpus.filter(cpu => cpu.cores == cpucore);
        if(filteredSneakers.length <= 0){
            container.innerHTML = `<p>Aucun processeur trouvé</p>`
        }
        getSneakers();
        }}
    


    function filterByTDP (tdp) {  //recherche d'article selon le tdp

        if (tdp === 'all') {
            filteredSneakers = cpus;
            getSneakers();
        } else {
        filteredSneakers = cpus.filter(cpu => cpu.tdp== tdp);
        if(filteredSneakers.length <= 0){
            container.innerHTML = `<p>Aucun processeur trouvé</p>`
        }
        getSneakers();
        }
    }

 function   filterBygen(gen){  //recherche d'article selon la génération

    if (gen === 'all') {
        filteredSneakers = cpus;
        getSneakers();
    } else {
    filteredSneakers = cpus.filter(cpu => cpu.generation== gen);
    if(filteredSneakers.length <= 0){
        container.innerHTML = `<p>Aucun processeur trouvé</p>`
    }
    getSneakers();
    }

}
 


function filterByColor (color) {  //recherche d'article selon la catégorie

    if (color === 'all') {
        filteredSneakers = cpus;
        getSneakers();
    } else {
    filteredSneakers = cpus.filter(cpu => cpu.colors === color);
    if(filteredSneakers.length <= 0){
        container.innerHTML = `<p>Aucune sneaker trouvée...</p>`
    }
    getSneakers();
    }
}

// tri  par prix décroissant/croissant

const  priceBtn = document.querySelector('.price-btn')
const  priceBtnless = document.querySelector('.price-btnless')
priceBtn.addEventListener('click', sortByPrice)
priceBtnless.addEventListener('click', sortByPriceless)

function comparedByPrice(a, b){
    return a.price - b.price;
}

function comparedByPriceless(a, b){
    return  b.price - a.price ;
}


function sortByPrice(){
    filteredSneakers.sort(comparedByPrice);
    getSneakers();
}

function sortByPriceless(){
    filteredSneakers.sort(comparedByPriceless);
    getSneakers();
}




const cartIcon = document.querySelector('.cart-icon');
const cartCtn = document.querySelector('.cart-ctn');
//Toggles cart
function toggleCart(){
    cartCtn.classList.toggle('open-cart');
   
    if(cartCtn.classList.contains('open-cart')){
        cartIcon.src = 'icons/close.png';
    } else {
        cartIcon.src ='icons/cpushopping.png';
    }
}
cartIcon.addEventListener('click', toggleCart);

//Local storage

let cartList = JSON.parse(localStorage.getItem('cart') || '[]'); //panier vide dans le local storage

function addSneaker (id){
    let cpu = cpus.find(cpu => cpu.id === id);  //recherche de l'article avec l'id correspondant
    
    let cpuprice = cpu.id      
  

    cartList.push(cpu); //ajout  de cpu à cart
    localStorage.setItem('cart', JSON.stringify(cartList)); // ajout  au local storage de la valeur convertie en json de cart
    
    loadCart(); // chargement du panier
}

function loadCart(){  // fonction qui affiche les chargement du panier
    let totalpricevalue = 0.0 ;
    cartCtn.innerHTML = "<h1 id='mybasket'>Mon Panier</h1></br></br></br><button id='removeall'> Vider le panier </button> </br></br></br>";  // ajout du bouton permettant de supprimer le panier
    let removeall = document.querySelector('#removeall') 
    removeall.onclick = removeAll // appel de la fonction removeall lors du clic du bouton
    
    cartList.forEach(cpu => { //pour chaque article
        let reductionpercentage = 0; 
      
        let cpusale  =0;
        if(cpu.reduction>0) {  // si l'article du panier présente une réduction 
            reductionpercentage = 1 -cpu.reduction  //on soustrait  la valeur  de la réduction à 1
             cpusale= cpu.price * reductionpercentage  //on multiplie l'ancien prix par ce résultat
             let sneakerCart = document.createElement("div");  // div qui va contenir un article et un bouton pour supprimer l'article du panier
             sneakerCart.classList.add("cart-item");  
             sneakerCart.innerHTML = `  
             <img src="${cpu.img_1}" class="cart-sneaker-img" alt="sneaker"/>
             <div>${cpu.name}</div>
             <div id="price">${cpusale}$</div>
             <button id="toremove" onclick="removeFromCart(${cpu.id})">Enlever</button>
             `;
             cartCtn.appendChild(sneakerCart);
             let articleprice = cpusale   
             totalpricevalue = totalpricevalue + articleprice // on ajoute le prix de la réduction au prix total
        }else{ //sinon
          
            let sneakerCart = document.createElement("div");// div qui va contenir un article et un bouton pour supprimer l'article du panier
            sneakerCart.classList.add("cart-item"); 
            sneakerCart.innerHTML = `
            <img src="${cpu.img_1}" class="cart-sneaker-img" alt="sneaker"/>
            <div>${cpu.name}</div>
            <div id="price">${cpu.price}$</div>
            <button id="toremove" onclick="removeFromCart(${cpu.id})">Enlever</button>
            `;
            cartCtn.appendChild(sneakerCart);
            let articleprice = cpu.price
            totalpricevalue = totalpricevalue + articleprice // ajout du prix au total
        } 
       
    })
 
    let totalprice = document.createElement("p") // texte du bouton commander
    
    let order = document.createElement("button") // bouton commander
    let orderdiv = document.createElement("div") // div du bouton et du texte 
   

    order.innerText = "Commander"
    order.id =  "orderbutton"
    orderdiv.id ="orderdiv"
    totalprice.innerHTML=` <p><b>Total :</b></p>`
  
    totalprice.textContent =  "Total      :" + totalpricevalue
    cartCtn.appendChild(totalprice)
    cartCtn.appendChild(orderdiv)
 
    orderdiv.appendChild(order)
}

function removeFromCart(id) { // suppression de l'article 
    let indexToRemove = cartList.findIndex(cpu => cpu.id === id);  // on récupère l'indice  résultant de la recherche de l'article dans cart
    cartList.splice(indexToRemove, 1);  // on enlève l'article de cart
    localStorage.setItem('cart', JSON.stringify(cartList)) // on applique le changement au local storage
    loadCart();  //chargement du panier
}

function removeAll(){
    
    cartList = []  // on vide  le panier (cart) 
    localStorage.setItem('cart', JSON.stringify(cartList)) // application au chargement local
    loadCart() //chargement du panier
 
}

loadSneakers(); //chargement des articles




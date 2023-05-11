
const url = "http://localhost:8000"


let description = document.querySelector('#description') 
let getid = document.querySelector('#tohidden')  //permet de récupérer l'id pour le fetch
let id = getid.innerText
let emptydiv = document.querySelector('.emptydiv')
let name0 = document.querySelector("#name")
let price = document.querySelector('#price')
let coloravailable = document.querySelector('#coloravailable')
let color = document.querySelector('#color')
let table = document.querySelector("#tab")
let trailers = document.querySelector("#trailers")
let globaldesc = description.textContent

const shopping = document.createElement('button')
shopping.id = "buttonshopnow"
shopping.innerText = "ajouter au panier "
shopping.onclick = function(){
    detailcart()
}
emptydiv.appendChild(shopping)


//addSneaker 

let img1 = document.getElementsByClassName("img"); //recupere les images
let button = document.getElementsByClassName("inline"); // les boutons
let count = 0;
    function lambda(){ // change la couleur du bouton cliqué et l'image affiché par le carrousel
        for (let i = 0; i< img1.length; i++){
            img1[i].classList.add("none");
            button[i].classList.add("white");
        }
        button[count].classList.remove("white");
        img1[count].classList.remove("none");
    }
    function left(){ //bouton gauche gére le defilement de l'image si ce bouton est cliqué
        count--;
        
        if (count<0){ //chaque image a une nombre pour savoir ou en est
            count =2;
            lambda()
        }
       console.log(count)
       lambda()
        }
    
    function right(){ //droit 
        count++;
      
        if (count > 2){
            count=0;
            lambda()
        }
        console.log(count)
        lambda()
        
    }
    function take(){ // 1er boule noir
        count = 0;   
        lambda();  
    }
    function take1(){ // 2 puis trois et ainsi de suite
        count = 1;   
        lambda();  
    }
    function take2(){
        count = 2;   
        lambda();  
    }
 

function analysedescription(){
let str = description.textContent
let str1 =String(str)
shopping.style.visibility = "visible"
price.style.visibility= "hidden" // visibilité  cachée de base
table.style.display = "none"


console.log(str.length)
if (str.length>=150){ // si il y a plus de 150 cacatère
description.textContent=str1.slice(0,149) + "..." //  le contenu texte ne vaut plus que les 150 premiers caractères

const viewmore = document.createElement("button")  // création du boutton voir plus 
viewmore.innerText = "voir plus"
viewmore.onclick = viewbutton  //on appelle la fonction qui affichera toute la description
viewmore.id ="seemore"    
description.appendChild(viewmore) //on rajoute le bouton à viewmore

}



console.log(str1.slice(0,149))
    
}

function  viewbutton(e){
    
    description.textContent =globaldesc //la description retrouve son contenu d'origine
    
    price.style.visibility= "visible"  //les élèments sont de nouveaux visibles
   
   
    table.style.display ="block"
   console.log(e.target)
    const viewless = document.createElement("button") //création d'un bouton pour cacher le contenu pour qu'il est > 150 caractères affichés
    description.appendChild(viewless)
    viewless.innerText= "voir moins"
    viewless.id = "viewless" 
    viewless.onclick = function(){
        viewless.remove()  // le boutton est supprimé
        analysedescription()
    }
    
   
 
    
}








analysedescription()
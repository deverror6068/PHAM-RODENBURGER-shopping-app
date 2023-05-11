

//const btn = document.querySelector('.cpus.btn')

//btn.addEventListener('click', getcpus);



let cpus 
let cartList = JSON.parse(localStorage.getItem('cart') || '[]');


//let cpus;
let filteredcpus;





function detailcart(){

    fetch(`${url}/cpus`)
  
    //fetch(`${url}/details/:id`)
    
    .then(response => {
        return response.json()
        
    })
    .then(data =>{
        cpus =data.cpus; //données récupérées  du fichier json
        let cpu
        
         cpu= cpus.find(s => s.id == id)  // on trie à partir de l'id recupérée
        cartList.push(cpu);
        localStorage.setItem('cart', JSON.stringify(cartList)) // on ajoute l'item au local storage
    })
    .catch (error => {
        console.log('error : '+ error);
    })
   
}



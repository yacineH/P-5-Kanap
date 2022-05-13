//variables globale node du DOM
const $nodDivImg=document.querySelector('.item__img');
const $nodTitle=document.getElementById('title');
const $nodPrice=document.getElementById('price');
const $nodDesc=document.getElementById('description');
const $nodColors=document.getElementById('colors');
const $totalProduct=document.getElementById('quantity');

/**
 * Fait un appel fetch api pour recuperer le données du produit selectionné
 * @param { string } id 
 * @returns 
 */
const getProduct = id =>fetch(`http://localhost:3000/api/products/${id}`);

/**
 * Génère le code Html a partir des données du produit
 * @param { product } product 
 */
const fillProduct = product =>
{
   const $nodImg = document.createElement('img');
   $nodImg.setAttribute('src',`${product.imageUrl}`);
   $nodImg.setAttribute('alt',`${product.altTxt}`);
   $nodDivImg.appendChild($nodImg);
   
   $nodTitle.textContent=product.name;
   $nodPrice.textContent=product.price;
   $nodDesc.textContent=product.description;

   for(let i=0;i<product.colors.length;i++)
   {
       const item=document.createElement('option');
       item.setAttribute('value',product.colors[i]);
       item.textContent=product.colors[i];

       $nodColors.appendChild(item);
   }
}

/**
 * Récupère id du produit
 * @param { string } chemin 
 * @returns { string }
 */
const getIdUrl=(chemin) =>
{
  var url=new URL(chemin);
  return url.searchParams.get('id');
}

/**
 * Ajoute item dans le panier avec utilisation de localstorage du navigateur
 * @param { {id:string,total:Number,color:string} } item 
 */
const addItemCart = (item) =>
{
  //conteur des elements dans le panier 
   let conteur=0;

   //localstorage est vide
   if(localStorage.length>0)
   {
        conteur=localStorage.length;
        let itemTrouve=false;

        for(let i=1; i<=conteur ;i++)
        {
            let element=JSON.parse(localStorage.getItem(`item ${i}`));
            //verification si l'element a ajouter existe dans le panier et avec la meme couleur
            if((element.id === item.id) && (element.color === item.color))
            {
                itemTrouve=true;
               // element.total = (+(element.total) + +(item.total)).toString();
                element.total = (parseInt(element.total) + parseInt(item.total)).toString();
                localStorage.setItem(`item ${i}`,JSON.stringify(element));
                break;
            }
        }        
        if(!itemTrouve) localStorage.setItem(`item ${++conteur}`, JSON.stringify(item));
   }
   else
   {  
      localStorage.setItem(`item ${++conteur}`, JSON.stringify(item));
   }
}

/**
 * Ajout un event click avec sa callback au addToCart
 * @param { string } idParam 
 */
const addEventCart=(idParam)=>
{
  document.getElementById('addToCart').addEventListener('click',function(event)
  {
    event.preventDefault();
    event.stopPropagation();
    addItemCart({id:idParam,total:$totalProduct.value,color:$nodColors.value});
  });
}


/**
 * Entrée d'éxecution
 */
const main = async () =>
{
    getProduct(getIdUrl(window.location.href))
    .then(res => res.json())
    .then(product => fillProduct(product))
    .catch(err => console.log("error to retrive product",err));

    addEventCart(getIdUrl(window.location.href));
}

main();
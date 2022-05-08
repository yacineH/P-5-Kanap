
/**
 * Fait un appel fetch api pour recuperer
 * tous les produts du site
 * @param { string } url
 * @returns  { promise } 
 */
const retrieveProducts = (url) => fetch(url)
    

/**
 * Crée le noeud html du produit 
 * @param { product } product 
 * @returns { HTMLElement } 
 */
const createNoeudProduct = product =>
{
   const $nodProduct=document.createElement('a');
   $nodProduct.setAttribute('href',`./product.html?id=${product._id}`);
   const $nodArticle=document.createElement('article');
   
   const $nodImage=document.createElement('img');
   $nodImage.setAttribute('src',`${product.imageUrl}`);
   $nodImage.setAttribute('alt',`${product.altTxt}`);
   
   const $nodTitle=document.createElement('h3');
   $nodTitle.classList.add('productName');
   $nodTitle.textContent=`${product.name}`;
   
   const $nodTxt=document.createElement('p');
   $nodTxt.classList.add('productDescription');
   $nodTxt.textContent=`${product.description}`;

   $nodArticle.appendChild($nodImage);
   $nodArticle.appendChild($nodTitle);
   $nodArticle.appendChild($nodTxt);
   
   $nodProduct.appendChild($nodArticle);

   return $nodProduct;
}

/**
 * Ajoute dans le conteneur html les cards des produits
 * @param { product[] } products 
 */
const createProductsCard= products =>
{ 
    for(let i=0;i<products.length;i++)
    {
      document.getElementById("items").appendChild(createNoeudProduct(products[i]))    ;
    }
}
/**
 * Entrée d'éxecution
 * fait appel a la fonction retrieveProducts
 * une fois les produits recupérés elle fait 
 * appel a createProductsCard pour générer la card pour chaque produit
 */
const main = async () =>
{
  retrieveProducts('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(products=> createProductsCard(products))
    .catch(err => console.log("error to retrive products from api",err));
}

main();
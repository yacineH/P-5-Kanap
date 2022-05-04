const $containerProducts=document.getElementById("items");

const retrieveProducts = () => 
       fetch('http://localhost:3000/api/products')
       .then(res => res.json())
       .catch(err => console.log("error to retrive products from api",err));


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


const createProductsCard= products =>
{ 
    for(let i=0;i<products.length;i++)
    {
       $containerProducts.appendChild(createNoeudProduct(products[i]))    ;
    }
}

const main = async ()=>{

    const products=await retrieveProducts();

    createProductsCard(products);
}

main();
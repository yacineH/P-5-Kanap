
const urlApi='http://localhost:3000/api/products/';
const $container=document.getElementById("cart__items");
const $prix=document.getElementById("totalPrice");

let totalPayer=0;

const getProduct = id =>
fetch(`${urlApi}${id}`)
.then(res => res.json())
.catch(err => console.log("error to retrive product",err));



const calculPrix =async () =>
{
    totalPayer =0;
    for(let i=0; i < localStorage.length; i++)
    {
      let key=localStorage.key(i);
      let item= JSON.parse(localStorage.getItem(key));
      let product = await getProduct(item.id);
      totalPayer = totalPayer + (item.total * product.price);
    }

    $prix.textContent=totalPayer;
}

const fillProduct = (product,colorSelected,totalSelected,key) =>
{
  //noeud Article
  $nodArticle=document.createElement("article");
  $nodArticle.classList.add("cart__item");
  $nodArticle.setAttribute('data-id',`${product._id}`);
  $nodArticle.setAttribute('data-color',`${colorSelected}`);

  //noeud div_image
  $nodDivImage=document.createElement("div");
  $nodDivImage.classList.add("cart__item__img");
  $nodImage=document.createElement("img");
  $nodImage.setAttribute('src',`${product.imageUrl}`);
  $nodImage.setAttribute('alt',`${product.altTxt}`);
  $nodDivImage.appendChild($nodImage);
  $nodArticle.appendChild($nodDivImage);
  
  //noeud div content
  $nodDivContent=document.createElement("div");
  $nodDivContent.classList.add("cart__item__content");
  //noeud description
  $nodDivContentDesc=document.createElement("div");
  $nodDivContentDesc.classList.add("cart__item__content__description");
  $nodTitle=document.createElement("h2");
  $nodTitle.textContent=product.name;
  $nodColor=document.createElement("p");
  $nodColor.textContent=colorSelected;
  $nodPrice=document.createElement("p");
  $nodPrice.textContent=product.price + '€';
  $nodDivContentDesc.appendChild($nodTitle);
  $nodDivContentDesc.appendChild($nodColor);
  $nodDivContentDesc.appendChild($nodPrice);
  $nodDivContent.appendChild($nodDivContentDesc);
  //noeud settings div-1
  $nodSettings=document.createElement("div");
  $nodSettings.classList.add("cart__item__content__settings");
  $nodSettingsQuantity=document.createElement("div");
  $nodSettingsQuantity.classList.add("cart__item__content__settings__quantity");
  $nodQuantity=document.createElement("p");
  $nodQuantity.textContent='Qté : ';
  $nodInput=document.createElement("input");
  $nodInput.setAttribute('type','number');
  $nodInput.setAttribute('name','itemQuantity');
  $nodInput.setAttribute('min','1');
  $nodInput.setAttribute('id',`${key}`);
  $nodInput.setAttribute('max','100');
  $nodInput.setAttribute('value',`${totalSelected}`);
  $nodInput.classList.add('itemQuantity');
  
  $nodSettingsQuantity.appendChild($nodQuantity);
  $nodSettingsQuantity.appendChild($nodInput);
  $nodSettings.appendChild( $nodSettingsQuantity);
  //noeud settings div-2
  $nodSettingsDelete=document.createElement("div");
  $nodSettingsDelete.classList.add("cart__item__content__settings__delete");
  $nodDelete=document.createElement("p");
  $nodDelete.classList.add('deleteItem');
  $nodDelete.textContent="Supprimer";
  $nodDelete.addEventListener('click',function(e){
    localStorage.removeItem(key);
    window.location.reload();
  });
  $nodSettingsDelete.appendChild($nodDelete);
  $nodSettings.appendChild($nodSettingsDelete);  
  $nodDivContent.appendChild($nodSettings);
  
  //final
  $nodArticle.appendChild($nodDivContent);

  //ajout dans le container
  $container.appendChild($nodArticle);

  //addeventListener
  document.getElementById(key).addEventListener('change',async function(e){
    let item= JSON.parse(localStorage.getItem(key));
    item.total=document.getElementById(key).value;
    localStorage.setItem(key,JSON.stringify(item));

    await calculPrix();
  });
}


const main =async () =>
{
  for(let i=0; i < localStorage.length; i++)
  {
    let key=localStorage.key(i);
    let item= JSON.parse(localStorage.getItem(key));
    let product = await getProduct(item.id);
    fillProduct(product,item.color,item.total,key);
  }
   await calculPrix();
};

main();
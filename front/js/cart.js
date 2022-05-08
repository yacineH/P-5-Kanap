
const urlApi='http://localhost:3000/api/products/';
const urlPost='http://localhost:3000/api/products/order';

const $container=document.getElementById("cart__items");
const $prix=document.getElementById("totalPrice");
const $order=document.getElementById("order");
const $firstName=document.getElementById("firstName");
const $firstNameError=document.getElementById("firstNameErrorMsg");
const $lastName=document.getElementById("lastName");
const $lastNameError=document.getElementById("lastNameErrorMsg");
const $address=document.getElementById("address");
const $addressError=document.getElementById("addressErrorMsg");
const $city=document.getElementById("city");
const $cityError=document.getElementById("cityErrorMsg");
const $email=document.getElementById("email");
const $emailError=document.getElementById("emailErrorMsg");
const $form=document.querySelector(".cart__order__form");

let totalPayer=0;
let isValidForm,isValidFirst,isValidLast,isValidCity,isValidAddress,isValidEmail=false;

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

const disableSubmit = (param)=>{
  if(!param)
  {
   $order.setAttribute('disabled',true);
  }
  else{
   $order.removeAttribute('disabled');
  }
}

const allValidation = ()=>{
  isValidForm = isValidFirst && isValidCity && isValidAddress && isValidEmail && isValidLast;
  disableSubmit(isValidForm);
}

const createContact = (first,last,em,addr,cit) =>
{
  return {firstName:first,lastName:last,email:em,address:addr,city:cit};
}

const allProductsCart = ()=>
{
   let products=[];

   for(let i=0; i < localStorage.length; i++)
   {
     let key=localStorage.key(i);
     let item= JSON.parse(localStorage.getItem(key));
     products.push(item.id);
   }
   return products;
}

const addEvents = () =>
{
  $form.addEventListener('submit',function(event)
  {
    event.preventDefault();
    let client=createContact($firstName.value,$lastName.value,$email.value,$address.value,$city.value);
    let listProducts= allProductsCart();


    fetch(urlPost, 
      {
       method: "POST",
       mode:"cors",
       headers: {
        "Content-Type": "application/json",
        "Accept":"application/json"
      },
      body: JSON.stringify({
            contact:client,
            products:listProducts})
    })
    .then(async (response) => { 
      if(response.ok)
      {
        console.log(response);
        return await response.json();        
      }
      else
      {
        console.log('Mauvaise réponse du réseau');
      }
    })
    .then(content=>{
      let orderId=content.orderId;
      window.location.assign(`http://127.0.0.1:5500/front/html/confirmation.html?orderId=${orderId}`);
    })
    .catch(error=> {
      console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
    });
  }); 

  $firstName.addEventListener('change',function(event){
    let valeur= event.target.value.trim();
    if(!valeur || valeur === "")
    {
      $firstNameError.textContent="* Champ obligatoire";
    }
    else{
      $firstNameError.textContent="";
      isValidFirst=true;
      allValidation();
    }
  });

  $lastName.addEventListener('change',function(event){
    let valeur= event.target.value.trim();
    if(!valeur || valeur === "")
    {
      $lastNameError.textContent="* Champ obligatoire";
    }
    else{
      $lastNameError.textContent="";
      isValidLast=true;
      allValidation();
    }
  });

  $address.addEventListener('change',function(event){
    let valeur= event.target.value.trim();
    if(!valeur || valeur === "")
    {
      $addressError.textContent="* Champ obligatoire";
    }
    else{
      $addressError.textContent="";
      isValidAddress=true;
      allValidation();
    }
  });

  $city.addEventListener('change',function(event){
    let valeur= event.target.value.trim();
    if(!valeur || valeur === "")
    {
      $cityError.textContent="* Champ obligatoire";
    }
    else{
      $cityError.textContent="";
      isValidCity=true;
      allValidation();
    }
  });

  $email.addEventListener('change',function(event){
    let valeur= event.target.value.trim();
    let masque=/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!valeur || valeur === "")
    {
      $emailError.textContent="* Champ obligatoire";
    }
    else if(!masque.test(valeur)){
      $emailError.textContent="Email incorrecte";
    }
    else{
      $emailError.textContent="";
      isValidEmail=true;
      allValidation();
    }
  });
};


const main =async () =>
{
  addEvents();
 
  for(let i=0; i < localStorage.length; i++)
  {
    let key=localStorage.key(i);
    let item= JSON.parse(localStorage.getItem(key));
    let product = await getProduct(item.id);
    fillProduct(product,item.color,item.total,key);
  }
 
  await calculPrix();
  disableSubmit(isValidForm);
};

main();





// fetch(urlPost, 
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//          contact:{firstName:"yacine",lastName:"yacine",email:"cine@gmail.com",address:"paris",city:"paris"},
//          products:["107fb5b75607497b96722bda5b504926","107fb5b75607497b96722bda5b504926"]})
//   })
//   .then(async (response) => {
//      try{
//       // console.log(response);
//       const contenu =await response.json();
//       console.log("order: ",contenu.orderId);
//      }catch(e)
//      {
//        console.log(e);
//      }
//   });
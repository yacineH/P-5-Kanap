
const strUrl=window.location.href;
const urlApi='http://localhost:3000/api/products/';
const $nodDivImg=document.querySelector('.item__img');
const $nodTitle=document.getElementById('title');
const $nodPrice=document.getElementById('price');
const $nodDesc=document.getElementById('description');
const $nodColors=document.getElementById('colors');
const $totalProduct=document.getElementById('quantity');

let idParam="";

const getProduct = id =>
       fetch(`${urlApi}${id}`)
       .then(res => res.json())
       .catch(err => console.log("error to retrive product",err));



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


const getIdUrl=(chemin) =>
{
  var url=new URL(chemin);
  return url.searchParams.get('id');
}

class itemCart{
    constructor(id,total,color){
        this.id=id;
        this.total=total;
        this.color=color;
    }
}


const addItem = (item) =>
{
   let conteur=0;

   if(localStorage.length>0)
   {
        conteur=localStorage.length;
        let itemTrouve=false;

        for(let i=1; i<=conteur ;i++)
        {
            let element=JSON.parse(localStorage.getItem(`item ${i}`));
            if((element.id === item.id) && (element.color === item.color))
            {
                itemTrouve=true;
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

const main = async () =>
{
    var idParam=getIdUrl(strUrl);

    productSelected=await getProduct(idParam);
    fillProduct(productSelected);

    document.getElementById('addToCart').addEventListener('click',function(e){

    addItem({id:idParam,total:$totalProduct.value,color:$nodColors.value});

    });
}

main();
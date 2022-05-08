$orderId=document.getElementById("orderId");


const main =() =>{
    var url=new URL(location.href);
     $orderId.textContent= url.searchParams.get('orderId');

};

main();
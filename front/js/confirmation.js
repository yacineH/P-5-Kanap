

/**
 * Entrée d'execution
 * a partir de l'url on recupère orderId et puis l'ajouter dans le DOM
 */
const main = () =>
{
  document.getElementById("orderId").textContent= new URL(location.href).searchParams.get('orderId');
  localStorage.clear();
}

main();
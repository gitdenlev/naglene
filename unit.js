let cart = {
  'cucula21' : 2,
  'cucula22' : 2,
  'cucula23' : 2,
  'cucula24' : 2,
  'cucula25' : 2,
  'cucula26' : 2,
  'cucula27' : 2,
  'cucula28' : 2,
}

// зменшення кількості
//видалення товару
documen.onclick = event => {
  //console.log(event.target.classList);
  if (event.target.classList.contains('Add cart')){
    plusFunction(event.target.dataset.id); 
  }
}
// збільшення кількості
const plusFunction = id => {
  cart[id]++;
  renderCart();
}
const renderCart = () =>{
  console.log(cart);
}
renderCart();
const create = document.querySelector("#create");

const formDiv = document.querySelector(".form");

const closeBtn = document.querySelector(".close");
const form = document.querySelector("form");
const productDiv = document.querySelector(".product")



const productsArr = JSON.parse(localStorage.getItem("products"))  || []


let updateIndex =  null


let ui = ()=>{
productDiv.innerHTML =''
    productsArr.forEach((elem,index) =>{
        productDiv.innerHTML+=` <div class="cards">
          <div class="img">
            <img
              src="${elem.image}"
              alt=""
            />
          </div>

          <div class="text">
            <p>${elem.productName}</p>
            <p>${elem.description}</p>
            <p>₹-${elem.price}</p>
          </div>
          <div class="btn">
            <button onclick = "updateProduct('${elem.productName}') " class="bt-1">Update</button>
            <button onclick = "deleteProduct ('${index}')" class="bt-2"><i class="ri-delete-bin-6-line"></i></button>
          </div>
        </div>`
    })
}

ui()

create.addEventListener("click", () => {
  formDiv.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  formDiv.style.display = "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let productName = e.target[0].value;
  let description = e.target[1].value;
  let price = e.target[2].value;
  let image = e.target[3].value;

if (
  productName.trim() === "" ||
  description.trim() === "" ||
  price.trim() === "" ||
  image.trim()=== ""
) {
  alert("Please fill all fields");
  return;
}

let obj ={
    productName,
    description,
    price,
    image
}

if (updateIndex  !== null) {
    productsArr[updateIndex] = obj
    updateIndex  = null
    localStorage.setItem("products", JSON.stringify(productsArr))
}else{

productsArr.push(obj)
localStorage.setItem("products", JSON.stringify(productsArr))
}


ui()

form.reset()
  formDiv.style.display = "none";

});


const updateProduct = (name) =>{
    formDiv.style.display = "flex";

let product = productsArr.find((elem) => elem.productName === name)
updateIndex = productsArr.findIndex((elem) => elem.productName === name)
  
form[0].value =product.productName
form[1].value =product.description

form[2].value =product.price

form[3].value =product.image


}

const deleteProduct  =(index) =>{
    productsArr.splice(index, 1)
 localStorage.setItem(
        "products",
        JSON.stringify(productsArr)
    )   
     ui()
}
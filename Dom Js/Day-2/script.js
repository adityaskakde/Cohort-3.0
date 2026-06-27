// let  h1 = document.querySelector("h1")



// h1.style.color ="yellow"
// h1.style.fontFamily ="Courier"
// h1.style.fontSize="80px"


// h1.textContent = "I am update by Dom"



// // textContent -> only change or update text
// // innerHTML
// // innerText




let bulb = document.querySelector(".bulb")

let btn = document.querySelector("button")


// let  flag = true

// btn.addEventListener("click", () =>{
  
//     if (flag) {
//           bulb.style.backgroundColor  = "yellow"
//           btn.textContent = "Off"
//           flag = false
//     }
//     else{
//     bulb.style.backgroundColor  = "transparent"
//           btn.textContent = "On"
//           flag = true
//     }
// })


btn.addEventListener("click" , () =>{

    if (    bulb.classList.toggle("lightup")
) {
    btn.textContent="Off"
        
    }
    else{
        btn.textContent ="On"
    }
})
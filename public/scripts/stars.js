const star1 = document.getElementById("1")
const star2 = document.getElementById("2")
const star3 = document.getElementById("3")
const star4 = document.getElementById("4")
const star5 = document.getElementById("5")
const stars = document.getElementsByClassName("fa-star")

const input = document.getElementById("stars")

star1.addEventListener("click", ()=> {
    for(let i = 0; i < stars.length; i++){
        if(i > 0){
            if(stars[i].style.color !== "#FFFFFF"){
                stars[i].style.color = "#FFFFFF"
            }
        } else {
            stars[i].style.color = "#FFFB00"
        }
    }
    input.setAttribute("value", "1")
})

star2.addEventListener("click", ()=> {
    for(let i = 0; i < stars.length; i++){
        if(i > 1){
            if(stars[i].style.color !== "#FFFFFF"){
                stars[i].style.color = "#FFFFFF"
            }
        } else {
            stars[i].style.color = "#FFFB00"
        }
    }
    input.setAttribute("value", "2")
})

star3.addEventListener("click", ()=> {
    for(let i = 0; i < stars.length; i++){
        if(i > 2){
            if(stars[i].style.color !== "#FFFFFF"){
                stars[i].style.color = "#FFFFFF"
            }
        } else {
            stars[i].style.color = "#FFFB00"
        }
    }
    input.setAttribute("value", "3")
})

star4.addEventListener("click", ()=> {
    for(let i = 0; i < stars.length; i++){
        if(i > 3){
            if(stars[i].style.color !== "#FFFFFF"){
                stars[i].style.color = "#FFFFFF"
            }
        } else {
            stars[i].style.color = "#FFFB00"
        }
    }
    input.setAttribute("value", "4")
})

star5.addEventListener("click", ()=> {
    for(let i = 0; i < stars.length; i++){
        if(i > 4){
            if(stars[i].style.color !== "#FFFFFF"){
                stars[i].style.color = "#FFFFFF"
            }
        } else {
            stars[i].style.color = "#FFFB00"
        }
    }
    input.setAttribute("value", "5")
})

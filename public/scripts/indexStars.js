const pStars = document.getElementsByClassName("p-stars")

for(let i = 0; i < pStars.length; i++){
    let value = pStars[i].getAttribute("value")
    let stars = pStars[i].getElementsByClassName("bgs-star")
    for(let b = 0; b < value; b++){
        stars[b].style.color = "#FFFB00"
    }
}






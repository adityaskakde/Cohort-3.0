let  container = document.querySelector(".container")


let playlist = document.createElement("div")
playlist.classList.add("playlist")

let cover = document.createElement("img")
cover.setAttribute("src","https://i.pinimg.com/1200x/9e/05/3c/9e053c677df835d39cdb64cba6c2a80e.jpg")


let title =document.createElement("h1")

title.textContent ="My Playlist"


let song1 = document.createElement("div");
song1.classList.add("song");
song1.textContent = "🎵 Believer";

let song2 = document.createElement("div");
song2.classList.add("song");
song2.textContent = "🎵 Heat Waves";


let song3 = document.createElement("div");
song3.classList.add("song");
song3.textContent = "🎵 Shape Of You";



playlist.appendChild(cover)
playlist.appendChild(title)
playlist.appendChild(song1)
playlist.appendChild(song2)
playlist.appendChild(song3)
container.appendChild(playlist);


let latest = document.createElement("div")
latest.classList.add ("song")
latest.textContent ="Starboy"
playlist.prepend(latest)




let newsong = document.createElement("div");

newsong.classList.add("song");

newsong.textContent = "🎧 Blinding Lights";

playlist.replaceChild(newsong , song2);

song3.remove();


console.log(playlist.children);

console.log(playlist.firstElementChild);

console.log(playlist.lastElementChild);
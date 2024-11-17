const images = [
    "images/1.png",
    "images/1.png",
    "images/2.png",
    "images/2.png",
    "images/3.png",
    "images/3.png",
    "images/4.png",
    "images/4.png",
    "images/5.png",
    "images/5.png",
    "images/6.png",
    "images/6.png",
    "images/7.png",
    "images/7.png",
    "images/8.png",
    "images/8.png"
];

// Tableau contenant tous les nombres disponibles
let numbers = Array.from({ length: 16 }, (_, i) => i);

// Fonction pour tirer un nombre aléatoire unique
function getUniqueRandomNumber() {
  if (numbers.length === 0) {
    return null;
  }

  // Sélectionner un index aléatoire dans le tableau
  let randomIndex = Math.floor(Math.random() * numbers.length);

  // Extraire le nombre de cet index
  let randomNumber = numbers.splice(randomIndex, 1)[0];

  return randomNumber;
}

function isSame(choice1, choice2){
    if(choice1.classList[0] === choice2.classList[0]){
        return true;
    }else{
        return false;
    }
}

function clear(articles){
    for(let i = 0; i<articles.length; i++){
        if(articles[i].classList.contains('show') && !articles[i].classList.contains("found")){
            let classArray = Array.from(articles[i].classList);
            const index = classArray.indexOf('show');
            classArray.splice(index, 1, "hide");
            articles[i].className = classArray.join(" ");
        }
    }
    
    
}

function show(card){
    if(card.classList.contains('hide')){
        let classArray = Array.from(card.classList);
        const index = classArray.indexOf('hide');
        classArray.splice(index, 1, 'show');
        card.className = classArray.join(" ");
    }
}

function isWin(articles){
    let win = [];
    for(let i =0; i<articles.length; i++){
        articles[i].classList.contains('found') ? win.push(true) : win.push(false);
    }
    if(win.includes(false)){
        return false;
    }else{
        return true;
    }
}

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 1000;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(3, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

document.addEventListener('DOMContentLoaded', function(){
    const container = document.querySelector('.memory-container');
    for(let i = 0; i<images.length; i++){
        const randId = getUniqueRandomNumber();
        const article = document.createElement('article');
        article.className = images[randId];
        article.classList.add('hide');
        const img = document.createElement('img');
        img.src = images[randId];
        container.appendChild(article);
        article.appendChild(img);
    }

    //Timer
    const timer = document.querySelector('.timer');
    let elapsedTime = 0;
    let startTime = Date.now() - elapsedTime;
    let timerInterval = setInterval(function () {
      elapsedTime = Date.now() - startTime;
      timer.textContent = timeToString(elapsedTime);
    }, 10);

    //Game logic
    const body = document.querySelector('body');
    const articles =document.querySelectorAll('article');
    const attemptsP = document.querySelector('.attempts span');
    const playAgain = document.createElement('button');
    playAgain.innerText = "Play again";
    let attempt = 0;
    let click = 0;
    let card1;
    let card2;
    for(let i = 0; i<articles.length; i++){
        articles[i].addEventListener('click', (e)=>{
            if(click !== "clearing"){
                click<2 && click++;
                click=== 1 ? card1 = articles[i] : null;
                click===2 ? card2 = articles[i] : null;
                show(articles[i]);
                if(click === 2 && card1!==undefined && card2 !== undefined && !isSame(card1, card2)){
                    attempt++;
                    attemptsP.innerText = attempt;
                    click = "clearing";
                    setTimeout(() =>{
                        click = 0;
                        clear(articles);
                        card1 = "";
                        card2 = "";
                    },2000)
                }else if(click === 2 && card1!==undefined && card2 !== undefined && isSame(card1,card2)){
                    attempt++;
                    click = 0;
                    card1.classList.add('found');
                    card2.classList.add('found');
                    card1 = "";
                    card2 = "";
                }
                if(attempt>=8){
                    if(isWin(articles) === true){
                        clearInterval(timerInterval);
                        body.appendChild(playAgain);
                    }
                }
            }
            
        })
    }
    playAgain.addEventListener('click', ()=>{
        this.location.reload();
    })
})
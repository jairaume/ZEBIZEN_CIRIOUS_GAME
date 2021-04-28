const username = document.getElementById('username')
const createBtn = document.getElementById('createBtn')
const joinCreate = document.getElementById('joinCreate');
const gameId = document.getElementById('gameId')
const form = document.getElementById('formLogin');
const expand = document.getElementById('expand');

let join = false;

form.addEventListener('submit', (event) => {
    console.log('Connection')
    event.preventDefault();
    logger.connexion(username.value, gameId.value);
});

gameId.addEventListener('keyup', (event)=>{
    joinCreate.innerHTML = !gameId.value ? 'Créer' : 'Rejoindre';
    join = join ? false : true;
});

gameId.addEventListener('focus',()=>{
    showBack(gameId.parentNode.parentNode);
});
gameId.addEventListener('blur',()=>{
    showFront(gameId.parentNode.parentNode);
});
/*
expand.addEventListener('mouseover',()=>{
    showBack(expand.firstElementChild);
    console.log('in')
});
expand.addEventListener('mouseout',()=>{
    console.log('out')
    if(document.activeElement != gameId) showFront(expand.firstElementChild);
});*/


function showBack(div){
    div.style.transform = 'rotateX(180deg)';
}

function showFront(div){
    div.style.transform = '';
}
/* axios
post:
https://mock-api.driven.com.br/api/v6/uol/participants
https://mock-api.driven.com.br/api/v6/uol/status


get:
const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

promessa.then(chegouDados); qaundo dos dados chegar, vai chamar a função (seta o paramelhod a função chamada com aresposta do servidor)
function chegouDados (resposta) {
    resposta.data // é o que importa pra gente agora
}
*/

/*
const elementoQueQueroQueApareca = document.querySelector('.mensagem');
elementoQueQueroQueApareca.scrollIntoView();
*/

function enviaMensagem () {
    
}

function scrolllMenu () {
    document.querySelector(".menuLateral").classList.toggle("visibility");
}
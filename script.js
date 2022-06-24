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

let nameUser;
let nome;
let mensagens;
let idConect;

function setName () {
    nameUser = prompt("Informe sua Graça:");
    nome = {
        name: nameUser
    }
    getConect();
}

setName();


function getConect () {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);

    promise.then(testaConect);
    promise.catch(validaEntrada);
}

function testaConect (status) {
    console.log(status);
    if(status.status === 400){
        alert("Nome de usuário já est asendo utilziado. Tente outro...");
        setName();
    }
    if(status.status === 200){
        idConect = setInterval(mantemConect, 5000);
    }
}

function mantemConect () {
    console.log("mantendo ...")
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);
    promise.then(conectOK);
    promise.catch(desconecta);
}

function desconecta (erro) {
    clearInterval(idConect);
}

function conectOK (status) {
    console.log(status);
}

function validaEntrada (erro) {
    console.log(erro);
}


function buscarMensagem () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(popularMensagem);
}

function popularMensagem (resposta) {
    if (resposta.status === 200) {
        console.log("Deuuu boooom");
    }
    mensagens = resposta.data;
    renderizarMensagens();
}

function renderizarMensagens() {
  const ul = document.querySelector(".mensagemArea");
  ul.innerHTML = "";

  for (let i = 0; i < mensagens.length; i++) {
    ul.innerHTML += `
        <li class="msn msnPrivate">${mensagens[i].name}  ${mensagens[i].text}
        </li>`;
  }
}

function enviaMensagem () {
    const mensagem = document.querySelector(".newMensagem").value;
  
    const newMensagem = {
        from: nameUser,
        to: "Todos",
        text: mensagem,
        type: "message" // ou "private_message" para o bônus
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMensagem);

    promise.then(buscarMensagem);
    promise.catch(alertaErro);
}

    function alertaErro(error) {
    if (error.response.status === 404) {
        alert("Não foi encontrado!");
    }
    if (error.response.status === 422) {
        alert("Verique todos os campos da receita!");
    }
      if (error.response.status === 409) {
        alert("Já existe uma receita com esse título!");
    }
}   







function scrolllMenu () {
    document.querySelector(".menuLateral").classList.toggle("visibility");
}
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

let nameUser = prompt("Informe sua Graça:");
let mensagens;

/*Testando Cód baseado no TasteCamp*/


function scrolllMenu () {
    document.querySelector(".menuLateral").classList.toggle("visibility");
}

function buscarMensagem () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(popularMensagem);
}

function popularReceitas(resposta) {
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
        <li class="msn msnPrivate">${mensagens[i].message}
        </li>`;
  }
}

function enviaMensagem () {
    const mensagem = document.querySelector(".newMensagem").value;
  
    const newMensagem = {
    	from: nameUser,
		/*to: "Todos",*/
		text: mensagem,
		type: "message",
		time: "08:01:17"
	};

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
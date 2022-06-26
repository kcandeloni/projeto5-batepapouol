let nameUser;
let nome;
let mensagens;
let idConect;
let idMensagem;

let elementoQueQueroQueApareca;

function setName () {
    nameUser = document.querySelector(".nameLogin").value;
    nome = {
        name: nameUser
    }
    if(nameUser){
        login();
    }else{
        console.log("Entrada Invalida!");
        setName();
    }
}

function login () {
    document.querySelector(".telaEntrada button").classList.add("closeTela");
    document.querySelector(".nameLogin").classList.add("closeTela");
    document.querySelector(".loader").classList.add("openTela");
    getConect();
}

function getConect () {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);

    promise.then(testaConect);
    promise.catch(validaEntrada);

    idMensagem = setInterval(buscarMensagem, 3000);
}



function testaConect (status) {
    console.log(status);
    if(status.status === 400){
        desconecta();
    }
    if(status.status === 200){
        buscarMensagem();
        idConect = setInterval(mantemConect, 5000);
        document.querySelector(".telaEntrada").classList.add("someTela");
        setTimeout(function(){
            document.querySelector(".telaEntrada").classList.add("closeTela");
        }, 4000);
    }
    else {
        console.log(status.status)
        desconecta();
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
    clearInterval(idMensagem);
    window.location.reload();
}

function conectOK (status) {
    console.log(status);
}

function validaEntrada (erro) {
    alert("Nome em uso!\nInforme um nome diferete.");
    desconecta();
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
    mensagens = mensagens.filter(function(elem){if(elem.type === "private_message" && elem.to !== nameUser){return false}return true});
    const ul = document.querySelector(".mensagemArea");
    ul.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++) {
        if(mensagens[i].type === "status"){
            ul.innerHTML += `
            <li class="msn"><spam class="colorTime">(${mensagens[i].time})</spam> <spam class="nameMsn">${mensagens[i].from}</spam> ${mensagens[i].text}
            </li>`;
        }else if(mensagens[i].type === "message"){
            ul.innerHTML += `
            <li class="msn msnUser"><spam class="colorTime">(${mensagens[i].time})</spam> <spam class="nameMsn">${mensagens[i].from}</spam> para <spam class="nameMsn">${mensagens[i].to}</spam>: ${mensagens[i].text}
            </li>`;
        }else if(mensagens[i].type === "private_message"){
            ul.innerHTML += `
            <li class="msn msnPrivate"><spam class="colorTime">(${mensagens[i].time})</spam> <spam class="nameMsn">${mensagens[i].from}</spam> reservadamente para <spam class="nameMsn">${mensagens[i].to}</spam>: ${mensagens[i].text}
            </li>`;
        }
    }
    elementoQueQueroQueApareca = document.querySelector('.msn:last-child');
    elementoQueQueroQueApareca.scrollIntoView();
}

function enviaMensagem () {
    const mensagem = document.querySelector(".newMensagem").value;
    document.querySelector(".newMensagem").value = "";
    if(mensagem){
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
    elementoQueQueroQueApareca = document.querySelector('.msn:last-child');
    elementoQueQueroQueApareca.scrollIntoView();
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
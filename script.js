let nameUser;
let nome;
let mensagens;
let idConect;
let idMensagem;
let idParticipantes;
let toMsn = "Todos"
let typeMsn = "message";

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
    clearInterval(idParticipantes);
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
    mensagens = mensagens.filter(function(elem){if(elem.type === "private_message" && elem.to !== nameUser && elem.from !== nameUser){return false}return true});
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
            <li data-identifier="visibility" class="msn msnPrivate"><spam class="colorTime">(${mensagens[i].time})</spam> <spam class="nameMsn">${mensagens[i].from}</spam> reservadamente para <spam class="nameMsn">${mensagens[i].to}</spam>: ${mensagens[i].text}
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
            to: toMsn,
            text: mensagem,
            type: typeMsn // ou "private_message" para o bônus
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
        alert(error.response.status);
    }
    if (error.response.status === 422) {
        alert(error.response.status);
    }
      if (error.response.status === 409) {
        alert(error.response.status);
    }
}   

function scrollMenu () {
    
    document.querySelector(".menu").classList.toggle("visibility");
    document.querySelector(".fundoMenu").classList.toggle("visibility");
    if(document.querySelector(".menu").classList.contains("visibility")){
        idParticipantes = setInterval(getParticipantes, 10000);
        getParticipantes();
    }else{console.log("não entrei nos parcipantes"); clearInterval(idParticipantes);}
}

function getParticipantes () {
    toMsn = "Todos"
    typeMsn = "message";
    selectType('Publico');
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise
        .then(renderizaParticipantes)
        .catch(erroParticipantes);
}

function renderizaParticipantes(participants){
    console.log(participants.data);
    participants = participants.data.filter(function(elem){if(elem.name === nameUser){return false}return true});
    const ul = document.querySelector(".participantesMenu");
    ul.innerHTML = `<li class="offIcon checkIcon" onClick="selectUser('Todos');selectItem(this);">
    <span><ion-icon name="people"></ion-icon><span>Todos</span></span><ion-icon name="checkmark-sharp"></ion-icon>
</li>`;

    for (let i = 0; i < participants.length; i++) {
        ul.innerHTML += `<li data-identifier="participant" class="offIcon" onClick="selectUser('${participants[i].name}');selectItem(this);">
            <span><ion-icon name="people"></ion-icon><span>${participants[i].name}</span></span><ion-icon name="checkmark-sharp"></ion-icon>
            </li>`;
    }
}

function selectUser (elem) {
    toMsn = elem;
    if(elem === "Todos"){
        typeMsn = "message";
        document.querySelector(".typeMsn li").classList.add("checkIcon");
        document.querySelector(".typeMsn li:nth-child(2)").classList.remove("checkIcon");
    }
}

function selectType (elem) {
    if(elem === "privadoDanadinho" && toMsn !== "Todos"){// Não quer enviar uma mensagem privada pra Todos, neh?
        typeMsn = "private_message";
        document.querySelector(".typeMsn li").classList.remove("checkIcon");
        document.querySelector(".typeMsn li:nth-child(2)").classList.add("checkIcon");
    }else{
        typeMsn = "message";
        document.querySelector(".typeMsn li").classList.add("checkIcon");
        document.querySelector(".typeMsn li:nth-child(2)").classList.remove("checkIcon");
    }
}

function selectItem (elem) {
    document.querySelector(".participantesMenu .checkIcon").classList.remove("checkIcon");
    elem.classList.add("checkIcon");
}

function erroParticipantes(erro){
    console.log("erro participantes"+ erro);
}

let enterMensagem = document.querySelector(".newMensagem");
enterMensagem.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
       event.preventDefault();
        enviaMensagem();
   }
});

let enterNome = document.querySelector(".nameLogin");
enterNome.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
       event.preventDefault();
        setName();
   }
});
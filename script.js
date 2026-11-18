
/* =====================================
   CONFIGURAÇÕES DO PROJETO
===================================== */

const API_URL = "https://akabab.github.io/superhero-api/api/all.json";

const CHAVE_FAVORITOS = "marvelFavoritos";
const CHAVE_TEMA = "marvelTema";

// Arrays que armazenam os personagens e favoritos.
let personagensMarvel = [];

let favoritos = [];

try {
    favoritos = JSON.parse(
        localStorage.getItem(CHAVE_FAVORITOS)
    ) || [];
} catch (erro) {
    favoritos = [];
}

/* =====================================
   INICIALIZAÇÃO
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    configurarTema();

    configurarExplorar();

    configurarFerramentas();

    configurarFormulario();

});

/* =====================================
   MODO ESCURO
===================================== */

function configurarTema() {

    const botaoTema = document.querySelector("#alternarTema");

    if (!botaoTema) return;

    const temaSalvo = localStorage.getItem(CHAVE_TEMA);

    if (temaSalvo === "escuro") {
        document.body.classList.add("escuro");
    }

    botaoTema.addEventListener("click", () => {

        document.body.classList.toggle("escuro");

        const temaAtual =
            document.body.classList.contains("escuro")
                ? "escuro"
                : "claro";

        localStorage.setItem(CHAVE_TEMA, temaAtual);

    });

}

/* =====================================
   BUSCAR PERSONAGENS NA API
===================================== */

async function carregarPersonagens() {

    const statusApi = document.querySelector("#statusApi");

    statusApi.textContent = "Carregando personagens...";

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        // Seleciona somente os personagens da Marvel.
        personagensMarvel = dados.filter(personagem =>
            personagem.biography.publisher === "Marvel Comics"
        );

        statusApi.textContent =
            personagensMarvel.length + " personagens encontrados.";

        aplicarFiltros();

    } catch (erro) {

        statusApi.textContent =
            "Não foi possível carregar os personagens. Verifique sua conexão e tente novamente.";

    }

}

/* =====================================
   MOSTRAR CARTÕES DOS PERSONAGENS
===================================== */

function mostrarPersonagens(lista) {

    const container = document.querySelector("#listaPersonagens");

    container.replaceChildren();

    if (lista.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.textContent =
            "Nenhum personagem encontrado.";

        container.appendChild(mensagem);

        return;

    }

    lista.forEach(personagem => {

        const cartao = document.createElement("article");

        cartao.classList.add("cartao", "cartao-personagem");

        // Figura e imagem.
        const figura = document.createElement("figure");

        const imagem = document.createElement("img");

        imagem.src = personagem.images.md;

        imagem.alt = "Imagem de " + personagem.name;

        imagem.loading = "lazy";

        imagem.classList.add("imagem-personagem");

        figura.appendChild(imagem);

        // Informações do personagem.
        const conteudo = document.createElement("div");

        conteudo.classList.add("personagem-conteudo");

        const nome = document.createElement("h2");

        nome.textContent = personagem.name;

        const alinhamento = document.createElement("p");

        alinhamento.textContent =
            "Alinhamento: " +
            traduzirAlinhamento(personagem.biography.alignment);

        const editora = document.createElement("p");

        editora.textContent =
            "Editora: " + personagem.biography.publisher;

        const primeiraAparicao = document.createElement("p");

        primeiraAparicao.textContent =
            "Primeira aparição: " +
            (personagem.biography.firstAppearance || "Não informado");

        // Botão de favorito.
        const botaoFavorito = document.createElement("button");

        botaoFavorito.type = "button";

        botaoFavorito.classList.add("botao-favorito");

        const estaFavoritado = favoritos.includes(personagem.id);

        botaoFavorito.classList.toggle("marcado", estaFavoritado);

        botaoFavorito.textContent =
            estaFavoritado ? "♥ Favoritado" : "♡ Favoritar";

        botaoFavorito.addEventListener("click", () => {

            alternarFavorito(personagem.id);

            aplicarFiltros();

        });

        conteudo.append(
            nome,
            alinhamento,
            editora,
            primeiraAparicao,
            botaoFavorito
        );

        cartao.append(figura, conteudo);

        container.appendChild(cartao);

    });

}

/* =====================================
   TRADUZIR ALINHAMENTO
===================================== */

function traduzirAlinhamento(alinhamento) {

    const traducoes = {
        good: "Herói",
        bad: "Vilão",
        neutral: "Neutro"
    };

    return traducoes[alinhamento] || "Desconhecido";

}

/* =====================================
   FAVORITOS
===================================== */

function alternarFavorito(id) {

    if (favoritos.includes(id)) {

        favoritos = favoritos.filter(
            favoritoId => favoritoId !== id
        );

    } else {

        favoritos.push(id);

    }

    localStorage.setItem(
        CHAVE_FAVORITOS,
        JSON.stringify(favoritos)
    );

}

/* =====================================
   BUSCA E FILTROS
===================================== */

function aplicarFiltros() {

    const campoBusca = document.querySelector("#campoBusca");

    const filtro = document.querySelector("#filtroAlinhamento");

    const apenasFavoritos =
        document.querySelector("#mostrarFavoritos");

    const termo = campoBusca.value.toLowerCase().trim();

    const resultado = personagensMarvel.filter(personagem => {

        const nomeCorresponde =
            personagem.name.toLowerCase().includes(termo);

        const alinhamentoCorresponde =
            filtro.value === "todos" ||
            personagem.biography.alignment === filtro.value;

        const favoritoCorresponde =
            !apenasFavoritos.checked ||
            favoritos.includes(personagem.id);

        return nomeCorresponde &&
            alinhamentoCorresponde &&
            favoritoCorresponde;

    });

    mostrarPersonagens(resultado);

    const statusApi = document.querySelector("#statusApi");

    statusApi.textContent =
        resultado.length + " personagem(ns) encontrados.";

}

/* =====================================
   CONFIGURAR PÁGINA EXPLORAR
===================================== */

function configurarExplorar() {

    const container = document.querySelector("#listaPersonagens");

    if (!container) return;

    const campoBusca = document.querySelector("#campoBusca");

    const filtro = document.querySelector("#filtroAlinhamento");

    const apenasFavoritos =
        document.querySelector("#mostrarFavoritos");

    campoBusca.addEventListener("input", aplicarFiltros);

    filtro.addEventListener("change", aplicarFiltros);

    apenasFavoritos.addEventListener("change", aplicarFiltros);

    carregarPersonagens();

}


/* =====================================
   TDE 01 - CALCULADORA
===================================== */

// Quatro operações matemáticas.

function somar(a, b) {
    return a + b;
}

function subtrair(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {

    if (b === 0) {
        return "Não é possível dividir por zero.";
    }

    return a / b;
}

// Função que recebe outra função como callback.

function calcular(a, b, operacao) {
    return operacao(a, b);
}

// Atributos utilizados na estatística.

const ATRIBUTOS = [
    "intelligence",
    "strength",
    "speed",
    "durability",
    "power",
    "combat"
];

// Calcula a média dos atributos de todos os personagens.

function calcularMediaAtributos(lista) {

    const medias = lista.map(personagem => {

        const soma = ATRIBUTOS.reduce((total, atributo) => {

            return total + Number(personagem.powerstats[atributo]);

        }, 0);

        return soma / ATRIBUTOS.length;

    });

    const mediasValidas = medias.filter(Number.isFinite);

    if (mediasValidas.length === 0) {
        return 0;
    }

    const somaMedias = mediasValidas.reduce(
        (total, media) => total + media,
        0
    );

    return somaMedias / mediasValidas.length;

}

// Carrega os dados necessários para as estatísticas.

async function carregarDadosFerramentas() {

    const resultadoMedia = document.querySelector("#resultadoMedia");

    try {

        resultadoMedia.textContent = "Carregando dados da API...";

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        const personagens = dados.filter(personagem =>
            personagem.biography.publisher === "Marvel Comics"
        );

        const media = calcularMediaAtributos(personagens);

        resultadoMedia.textContent =
            "Média geral dos atributos: " + media.toFixed(2);

    } catch (erro) {

        resultadoMedia.textContent =
            "Não foi possível calcular a média.";

    }

}

// Configura os eventos da calculadora.

function configurarFerramentas() {

    const botaoCalcular = document.querySelector("#calcularOperacao");

    if (!botaoCalcular) return;

    // Objeto com as operações usando arrow functions.

    const operacoes = {

        somar: (a, b) => somar(a, b),

        subtrair: (a, b) => subtrair(a, b),

        multiplicar: (a, b) => multiplicar(a, b),

        dividir: (a, b) => dividir(a, b)

    };

    // Função anônima utilizada no evento de clique.

    botaoCalcular.addEventListener("click", function () {

        const valorA = Number(
            document.querySelector("#valorA").value
        );

        const valorB = Number(
            document.querySelector("#valorB").value
        );

        const operacaoEscolhida =
            document.querySelector("#operacao").value;

        const resultado = calcular(
            valorA,
            valorB,
            operacoes[operacaoEscolhida]
        );

        document.querySelector("#resultadoCalculo").textContent =
            "Resultado: " + resultado;

    });

    const botaoMedia = document.querySelector("#calcularMedia");

    botaoMedia.addEventListener("click", carregarDadosFerramentas);

}

/* =====================================
   FORMULÁRIO DE CONTATO
===================================== */

async function enviarFormulario(evento) {

    // Impede que a página recarregue.
    evento.preventDefault();

    const formulario = document.querySelector("#formContato");

    const status = document.querySelector("#statusFormulario");

    // Captura os dados preenchidos.
    const dadosFormulario = {

        nome: document.querySelector("#nome").value,

        email: document.querySelector("#email").value,

        assunto: document.querySelector("#assunto").value,

        mensagem: document.querySelector("#mensagem").value

    };

    status.textContent = "Enviando mensagem...";

    try {

        const resposta = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dadosFormulario)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dadosResposta = await resposta.json();

        status.textContent =
            "Mensagem enviada com sucesso! Status HTTP: " +
            resposta.status +
            ". ID: " +
            dadosResposta.id;

        formulario.reset();

    } catch (erro) {

        status.textContent =
            "Não foi possível enviar a mensagem. Tente novamente.";

    }

}

/* CONFIGURAÇÃO DO FORMULÁRIO */

function configurarFormulario() {

    const formulario = document.querySelector("#formContato");

    if (!formulario) return;

    formulario.addEventListener("submit", enviarFormulario);

}

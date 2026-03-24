// elementos para o  modal
const modal = document.getElementById("modal");
const btnMais = document.getElementById("btnMais"); // botão +
const btnCancelar = document.getElementById("btnCancelar");
const btnAddGasto = document.getElementById("btnAddGasto");
// Para o tabs
let gastos = [];
let categoriaAtiva = "Geral";

const tabGeral = document.getElementById("tabGeral");
const inputGasto = document.getElementById("inputGasto");
const btnConcluir = document.getElementById("btnConcluir");
const tabsContainer = document.querySelector(".tabs");

// Logica do Modal aqui Docinho
function abrirModal() {
  modal.style.display = "flex";
}

// fechar modal docinho
btnCancelar.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

btnMais.addEventListener("click", abrirModal);
btnAddGasto.addEventListener("click", abrirModal);

// Fim da logica do modal


// Logica de tabs
// Tabs criadas 
function criarTab(nome) {
  const novaTab = document.createElement("button");
  
  novaTab.classList.add("tab-btn");
  novaTab.textContent = nome;

  novaTab.addEventListener("click", () => {
    ativarTab(nome, novaTab);
  });

  // insere antes do botão "+"
  tabsContainer.insertBefore(novaTab, btnMais);
}

btnConcluir.addEventListener("click", () => {
  const nome = inputGasto.value.trim();

  if (nome === "") {
    alert("Digite um nome!");
    return;
  }

  // salva no array
  gastos.push(nome);

  // cria na tela
  criarTab(nome);

  // limpa input
  inputGasto.value = "";

  // fecha modal
  modal.style.display = "none";
});

// Logica para selecionar Tabs

function ativarTab(nome, elemento) {

  // salva qual está ativa
  categoriaAtiva = nome;

  // remove active de todas
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => tab.classList.remove("active"));

  // adiciona active na clicada
  elemento.classList.add("active");

  console.log("Categoria ativa:", categoriaAtiva);
}

// Logica ta tab Geral

tabGeral.addEventListener("click", () => {
  ativarTab("Geral", tabGeral);
});
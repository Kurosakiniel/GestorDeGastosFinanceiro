// elementos para o  modal
const modal = document.getElementById("modal");
const btnMais = document.querySelectorAll(".tab-btn")[1]; // botão +
const btnCancelar = document.getElementById("btnCancelar");
const btnAddGasto = document.getElementById("btnAddGasto");
// Para o tabs
let gastos = [];

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

// Tabs criadas 
function criarTab(nome) {
  const novaTab = document.createElement("button");
  
  novaTab.classList.add("tab-btn");
  novaTab.textContent = nome;

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
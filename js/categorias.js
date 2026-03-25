// 📦 ESTADO GLOBAL
let categorias = [];
let categoriaAtiva = "Geral";

// 🧱 CRIAR CATEGORIA (dados)
function criarCategoria(nome) {
  categorias.push({
    nome: nome,
    gastos: []
  });
}

// 🧩 CRIAR TAB (interface)
function criarTab(nome) {
  const novaTab = document.createElement("button");

  novaTab.classList.add("tab-btn");
  novaTab.textContent = nome;

  novaTab.addEventListener("click", () => {
    ativarTab(nome, novaTab);
  });

  document.querySelector(".tabs")
    .insertBefore(novaTab, document.getElementById("btnMais"));
}

// 🎯 ATIVAR TAB
function ativarTab(nome, elemento) {
  categoriaAtiva = nome;

  // remove active de todas
  document.querySelectorAll(".tab-btn")
    .forEach(tab => tab.classList.remove("active"));

  // ativa a clicada
  elemento.classList.add("active");

  // atualiza tela
  atualizarTela();
  renderizarTudo();
}

// ❌ EXCLUIR CATEGORIA
function excluirCategoria() {

  if (categoriaAtiva === "Geral") {
    alert("Não dá pra excluir a categoria Geral!");
    return;
  }

  // remove do array
  categorias = categorias.filter(c => c.nome !== categoriaAtiva);

  // remove da interface
  document.querySelectorAll(".tab-btn").forEach(tab => {
    if (tab.textContent === categoriaAtiva) {
      tab.remove();
    }
  });

  // volta pra Geral
  categoriaAtiva = "Geral";

  const tabGeral = document.getElementById("tabGeral");

  document.querySelectorAll(".tab-btn")
    .forEach(tab => tab.classList.remove("active"));

  tabGeral.classList.add("active");

  atualizarTela();
  renderizarTudo();
  salvarDados();
}
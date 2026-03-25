document.addEventListener("DOMContentLoaded", iniciarApp);

// 🚀 Inicializa o app
function iniciarApp() {
  carregarDados();
  configurarEventos();
  ativarTab("Geral", document.getElementById("tabGeral"));
}

// 🎯 TODOS OS EVENTOS DO SISTEMA
function configurarEventos() {

  // 👉 Abrir modal de criar categoria
  document.getElementById("btnMais")
    .addEventListener("click", abrirModal);

  document.getElementById("btnAddGasto")
    .addEventListener("click", abrirModal);

  // 👉 Fechar modal categoria
  document.getElementById("btnCancelar")
    .addEventListener("click", fecharModal);

  // 👉 Criar nova categoria
  document.getElementById("btnConcluir")
    .addEventListener("click", () => {

      const nome = document.getElementById("inputGasto").value.trim();

      if (!nome) {
        alert("Digite um nome!");
        return;
      }

      criarCategoria(nome);
      salvarDados();
      criarTab(nome);

      document.getElementById("inputGasto").value = "";
      fecharModal();
    });

  // 👉 VOLTAR PRO GERAL
  document.getElementById("tabGeral")
    .addEventListener("click", () => {
      ativarTab("Geral", document.getElementById("tabGeral"));
    });

  // 👉 Abrir modal de gasto
  document.getElementById("btnAddDentro")
    .addEventListener("click", () => {
      document.getElementById("modalGasto").style.display = "flex";
    });

  // 👉 Cancelar modal de gasto
  document.getElementById("cancelarGasto")
    .addEventListener("click", () => {
      document.getElementById("modalGasto").style.display = "none";
    });

  // 👉 Salvar gasto
  document.getElementById("salvarGasto")
    .addEventListener("click", () => {

      const descricao = document.getElementById("descricaoGasto").value.trim();
      const valor = parseFloat(document.getElementById("valorGasto").value);

      if (!descricao || isNaN(valor)) {
        alert("Preencha tudo!");
        return;
      }

      adicionarGasto(descricao, valor);

      document.getElementById("descricaoGasto").value = "";
      document.getElementById("valorGasto").value = "";

      document.getElementById("modalGasto").style.display = "none";

      renderizarTudo();
    });

  // 👉 EXCLUIR CATEGORIA 🔥 (AQUI Ó)
  document.getElementById("btnExcluirCategoria")
    .addEventListener("click", excluirCategoria);

  // 👉 Fechar modal clicando fora
  document.getElementById("modal")
    .addEventListener("click", (e) => {
      if (e.target.id === "modal") {
        fecharModal();
      }
    });
}

// 📦 MODAL
function abrirModal() {
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// 💾 LOCAL STORAGE
function salvarDados() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
}

function carregarDados() {
  const dados = localStorage.getItem("categorias");

  if (!dados) return;

  categorias = JSON.parse(dados);

  categorias.forEach(c => criarTab(c.nome));
}
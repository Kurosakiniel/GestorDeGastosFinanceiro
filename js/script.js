// elementos para o  modal

const modal = document.getElementById("modal");
const btnMais = document.getElementById("btnMais"); // botão +
const btnCancelar = document.getElementById("btnCancelar");
const btnAddGasto = document.getElementById("btnAddGasto");

// Para o tabs

let categorias = [];
let categoriaAtiva = "Geral";

const tabGeral = document.getElementById("tabGeral");
const inputGasto = document.getElementById("inputGasto");
const btnConcluir = document.getElementById("btnConcluir");
const tabsContainer = document.querySelector(".tabs");

// Pagina de conteúdo vazio ( é pra as tabs ficarem sumidinha )

const conteudoVazio = document.querySelector(".conteudo-vazio");
const conteudoCategoria = document.getElementById("conteudoCategoria");

// Modal dentro da tab ai
const modalGasto = document.getElementById("modalGasto");
const btnAddDentro = document.getElementById("btnAddDentro");
const cancelarGasto = document.getElementById("cancelarGasto");
const salvarGasto = document.getElementById("salvarGasto");

const descricaoGasto = document.getElementById("descricaoGasto");
const valorGasto = document.getElementById("valorGasto");

// Para tabela
const tabelaGastos = document.getElementById("tabelaGastos");

// Para os Cardzin
const cardsPorcentagem = document.getElementById("cardsPorcentagem");

// Grafico aqui oh
let grafico = null;

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
  categorias.push({
    nome: nome,
    gastos: []
  });

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
  atualizarTela();
  renderizarTabela();
  renderizarGrafico();
  renderizarCards();
}

// Logica ta tab Geral

tabGeral.addEventListener("click", () => {
  ativarTab("Geral", tabGeral);
});

// aqui atualiza as telas das tabs

function atualizarTela() {
  
  if (categoriaAtiva === "Geral") {
    // mostra tela vazia
    conteudoVazio.classList.remove("d-none");
    conteudoCategoria.classList.add("d-none");
  } else {
    // mostra tela da categoria
    conteudoVazio.classList.add("d-none");
    conteudoCategoria.classList.remove("d-none");
  }
  
  console.log(conteudoCategoria);
}

// Modal da tab especifica

// abrir
btnAddDentro.addEventListener("click", () => {
  modalGasto.style.display = "flex";
});

// fechar
cancelarGasto.addEventListener("click", () => {
  modalGasto.style.display = "none";
});

// Aqui é pra salvar o gasto na categoria especifica, Jr
salvarGasto.addEventListener("click", () => {
  const descricao = descricaoGasto.value.trim();
  const valor = parseFloat(valorGasto.value);

  if (descricao === "" || isNaN(valor)) {
    alert("Preencha tudo!");
    return;
  }

  // encontra categoria ativa
  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (categoria) {
    categoria.gastos.push({
      descricao: descricao,
      valor: valor
    });
  }

  console.log(categorias);

  // limpar
  descricaoGasto.value = "";
  valorGasto.value = "";

  modalGasto.style.display = "none";
  renderizarTabela();
  renderizarGrafico();
  
});

// Aqui renderiza a tabela dentro do tab especifico

function renderizarTabela() {

  tabelaGastos.innerHTML = "";

  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (!categoria) return;

  categoria.gastos.forEach(gasto => {

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>Gasto</td>
      <td>${gasto.descricao}</td>
      <td>R$ ${gasto.valor}</td>
    `;

    tabelaGastos.appendChild(linha);
  });
}

// Função para renderizar o grafico

function renderizarGrafico() {

  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  const ctx = document.getElementById("graficoGastos");

  // 🔥 sempre destrói o gráfico anterior
  if (grafico) {
    grafico.destroy();
    grafico = null;
  }

  // 🚨 se não tiver categoria ou gastos
  if (!categoria || categoria.gastos.length === 0) {
    return;
  }

  const labels = categoria.gastos.map(g => g.descricao);
  const valores = categoria.gastos.map(g => g.valor);

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Gastos (R$)",
        data: valores,
        backgroundColor: "#36a2eb",
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}

// fUNÇÃO DOS CARDS

function renderizarCards() {

  cardsPorcentagem.innerHTML = "";

  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (!categoria || categoria.gastos.length === 0) return;

  // soma total
  const total = categoria.gastos.reduce((acc, g) => acc + g.valor, 0);

  categoria.gastos.forEach(gasto => {

    const porcentagem = ((gasto.valor / total) * 100).toFixed(1);

    const card = document.createElement("div");

    card.classList.add("card", "p-3");

    card.style.width = "150px";

    card.innerHTML = `
      <h6>${gasto.descricao}</h6>
      <p>${porcentagem}%</p>
    `;

    cardsPorcentagem.appendChild(card);

  });
}
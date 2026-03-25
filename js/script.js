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

// Excluir Categoria
const btnExcluirCategoria = document.getElementById("btnExcluirCategoria");

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

    if (!temGastosNoGeral()) {
      // tela vazia
      conteudoVazio.classList.remove("d-none");
      conteudoCategoria.classList.add("d-none");
    } else {
      // mostra dashboard
      conteudoVazio.classList.add("d-none");
      conteudoCategoria.classList.remove("d-none");

      // ESCONDE O QUE NÃO QUER
      tabelaContainer.classList.add("d-none");
      btnExcluirCategoria.classList.add("d-none");
      btnAddDentro.classList.add("d-none");
    }

  } else {
    // categorias normais
    conteudoVazio.classList.add("d-none");
    conteudoCategoria.classList.remove("d-none");

    // MOSTRA DE VOLTA
    tabelaContainer.classList.remove("d-none");
    btnExcluirCategoria.classList.remove("d-none");
    btnAddDentro.classList.remove("d-none");
  }
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
  renderizarCards();
});

// Aqui renderiza a tabela dentro do tab especifico

function renderizarTabela() {

  tabelaGastos.innerHTML = "";

  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (!categoria) return;

  categoria.gastos.forEach((gasto, index) => {

    const linha = document.createElement("tr");
    
    linha.innerHTML = `
      <td>Gasto</td>
      <td>${gasto.descricao}</td>
      <td>R$ ${gasto.valor}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-excluir">🗑️</button>
      </td>
    `;

    // AQUI TÁ O QUE FALTA
    const btnExcluir = linha.querySelector(".btn-excluir");

    btnExcluir.addEventListener("click", () => {
      categoria.gastos.splice(index, 1);

      renderizarTabela();
      renderizarGrafico();
      renderizarCards();
    });

    tabelaGastos.appendChild(linha);
  });
}

// Função para renderizar o grafico

function renderizarGrafico() {

  if (grafico) {
    grafico.destroy();
    grafico = null;
  }

  const ctx = document.getElementById("graficoGastos");

  // CASO GERAL
  if (categoriaAtiva === "Geral") {

    if (!temGastosNoGeral()) return;

    const labels = categorias.map(c => c.nome);

    const valores = categorias.map(c =>
      c.gastos.reduce((acc, g) => acc + g.valor, 0)
    );

    grafico = new Chart(ctx, {
      type: "pie", // 👈 aqui é pizza
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: [ // 👈 ESSAS CORES BUGARAM NO GRÁFICO QUE FICA ABAIXO DA TABELA, AGORA É TUDO AZUL !!
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4bc0c0",
            "#9966ff"
          ]
        }]
      }
    });
    return;
  }

  // RESTO (já existente)
  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (!categoria || categoria.gastos.length === 0) return;

  const labels = categoria.gastos.map(g => g.descricao);
  const valores = categoria.gastos.map(g => g.valor);

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: valores
      }]
    }
  });
}

// fUNÇÃO DOS CARDS

function renderizarCards() {

  cardsPorcentagem.innerHTML = "";

  // 🔥 CASO GERAL
  if (categoriaAtiva === "Geral") {

    if (!temGastosNoGeral()) return;

    // total geral
    const totalGeral = categorias.reduce((acc, c) => {
      return acc + c.gastos.reduce((soma, g) => soma + g.valor, 0);
    }, 0);

    categorias.forEach(categoria => {

      const totalCategoria = categoria.gastos.reduce((acc, g) => acc + g.valor, 0);

      if (totalCategoria === 0) return;

      const porcentagem = ((totalCategoria / totalGeral) * 100).toFixed(1);

      const card = document.createElement("div");
      card.classList.add("card", "p-3");

      card.innerHTML = `
        <h6>${categoria.nome}</h6>
        <p>${porcentagem}%</p>
      `;

      cardsPorcentagem.appendChild(card);
    });

    return;
  }

  // 🔥 CASO NORMAL (o que você já tinha)
  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (!categoria || categoria.gastos.length === 0) return;

  const total = categoria.gastos.reduce((acc, g) => acc + g.valor, 0);

  categoria.gastos.forEach(gasto => {

    const porcentagem = ((gasto.valor / total) * 100).toFixed(1);

    const card = document.createElement("div");
    card.classList.add("card", "p-3");

    card.innerHTML = `
      <h6>${gasto.descricao}</h6>
      <p>${porcentagem}%</p>
    `;

    cardsPorcentagem.appendChild(card);
  });
}

// Excluir catégoria aqui
btnExcluirCategoria.addEventListener("click", () => {

  if (categoriaAtiva === "Geral") {
    alert("Não dá pra excluir a categoria Geral!");
    return;
  }

  // remove do array
  categorias = categorias.filter(c => c.nome !== categoriaAtiva);

  // remove a tab da tela
  const tabs = document.querySelectorAll(".tab-btn");

  tabs.forEach(tab => {
    if (tab.textContent === categoriaAtiva) {
      tab.remove();
    }
  });

  // volta pra Geral
  categoriaAtiva = "Geral";

  // ativa visualmente
  document.querySelectorAll(".tab-btn").forEach(tab => tab.classList.remove("active"));
  tabGeral.classList.add("active");

  // atualiza tela
  atualizarTela();
  renderizarTabela();
  renderizarGrafico();
  renderizarCards();

});

// Verificar se tem dados de gastos ( pra deixar o geral bonitinho)
function temGastosNoGeral() {
  return categorias.some(c => c.gastos.length > 0);
}
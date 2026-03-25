// gráfico global 
let grafico = null;

// ATUALIZA A TELA (mostra geral ou categoria)
function atualizarTela() {

  const conteudoVazio = document.querySelector(".conteudo-vazio");
  const conteudoCategoria = document.getElementById("conteudoCategoria");
  const tabelaContainer = document.getElementById("tabelaContainer");
  const btnExcluirCategoria = document.getElementById("btnExcluirCategoria");
  const btnAddDentro = document.getElementById("btnAddDentro");

  if (categoriaAtiva === "Geral") {

    if (!temGastosNoGeral()) {
      conteudoVazio.classList.remove("d-none");
      conteudoCategoria.classList.add("d-none");
    } else {
      conteudoVazio.classList.add("d-none");
      conteudoCategoria.classList.remove("d-none");

      tabelaContainer.classList.add("d-none");
      btnExcluirCategoria.classList.add("d-none");
      btnAddDentro.classList.add("d-none");
    }

  } else {
    conteudoVazio.classList.add("d-none");
    conteudoCategoria.classList.remove("d-none");

    tabelaContainer.classList.remove("d-none");
    btnExcluirCategoria.classList.remove("d-none");
    btnAddDentro.classList.remove("d-none");
  }
}

// VERIFICA SE TEM GASTO NO GERAL
function temGastosNoGeral() {
  return categorias.some(c => c.gastos.length > 0);
}

// Renderizador aqui
function renderizarTudo() {
  renderizarTabela();
  renderizarGrafico();
  renderizarCards();
}

// Render da TABELA
function renderizarTabela() {

  const tabelaGastos = document.getElementById("tabelaGastos");
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

    const btnExcluir = linha.querySelector(".btn-excluir");

    btnExcluir.addEventListener("click", () => {
      categoria.gastos.splice(index, 1);
      salvarDados();
      renderizarTudo();
    });

    tabelaGastos.appendChild(linha);
  });
}

// Render do GRÁFICO
function renderizarGrafico() {

  if (grafico) {
    grafico.destroy();
    grafico = null;
  }

  const ctx = document.getElementById("graficoGastos");

  //  GERAL Aqui
  if (categoriaAtiva === "Geral") {

    if (!temGastosNoGeral()) return;

    const labels = categorias.map(c => c.nome);

    const valores = categorias.map(c =>
      c.gastos.reduce((acc, g) => acc + g.valor, 0)
    );

    grafico = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: [
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

  //  CATEGORIA ( A tab )
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

// CARDS ( os bixin que mostra porcentagem especifico )
function renderizarCards() {

  const cardsPorcentagem = document.getElementById("cardsPorcentagem");
  cardsPorcentagem.innerHTML = "";

  // GERAL
  if (categoriaAtiva === "Geral") {

    if (!temGastosNoGeral()) return;

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

  // CATEGORIA (Do tabs especifico)
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
class UIRenderer {
    constructor(gestor) {
        this.gestor = gestor;
    }

    // Método chamado pelo Observer
    atualizar(categorias) {
        this.renderizarTabs(categorias);
        this.renderizarTabela();
        this.renderizarCards(categorias);
        this.atualizarVisibilidadeInterface();
    }

    renderizarTabs(categorias) {
        const tabsContainer = document.querySelector(".tabs");
        const btnMais = document.getElementById("btnMais");
        const tabGeral = document.getElementById("tabGeral");

        if (!tabsContainer || !btnMais) return;

        // Limpa apenas as abas dinâmicas
        const botoesAtuais = tabsContainer.querySelectorAll("button");
        botoesAtuais.forEach(btn => {
            if (btn.id !== "tabGeral" && btn.id !== "btnMais") {
                btn.remove();
            }
        });

        // Cria novas abas
        categorias.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = "tab-btn";
            if (this.gestor.categoriaAtiva === cat.nome) btn.classList.add("active");
            btn.textContent = cat.nome;
            btn.onclick = () => this.gestor.setCategoriaAtiva(cat.nome);
            tabsContainer.insertBefore(btn, btnMais);
        });

        // Ativa/Desativa aba Geral
        if (this.gestor.categoriaAtiva === "Geral") tabGeral.classList.add("active");
        else tabGeral.classList.remove("active");
    }

    renderizarTabela() {
        const corpoTabela = document.getElementById("tabelaGastos");
        if (!corpoTabela) return;
        corpoTabela.innerHTML = "";

        const catAtual = this.gestor.categorias.find(c => c.nome === this.gestor.categoriaAtiva);
        const lista = catAtual ? catAtual.gastos : [];

        lista.forEach(gasto => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${gasto.descricao}</td>
                <td>R$ ${gasto.valor.toFixed(2)}</td>
            `;
            corpoTabela.appendChild(tr);
        });
    }

    renderizarCards(categorias) {
        const container = document.getElementById("cardsPorcentagem");
        if (!container) return;
        container.innerHTML = "";

        const totalGeral = categorias.reduce((acc, c) => acc + c.gastos.reduce((s, g) => s + g.valor, 0), 0);
        
        categorias.forEach(c => {
            const somaCat = c.gastos.reduce((s, g) => s + g.valor, 0);
            if (somaCat === 0) return;
            const perc = totalGeral > 0 ? ((somaCat / totalGeral) * 100).toFixed(1) : 0;

            const card = document.createElement("div");
            card.className = "card p-3";
            card.innerHTML = `<h6>${c.nome}</h6><p>${perc}%</p>`;
            container.appendChild(card);
        });
    }

    atualizarVisibilidadeInterface() {
        const vazio = document.querySelector(".conteudo-vazio");
        const conteudo = document.getElementById("conteudoCategoria");
        const btnAddDentro = document.getElementById("btnAddDentro");
        const tabelaContainer = document.getElementById("tabelaContainer");
        const btnExcluir = document.getElementById("btnExcluirCategoria");

        const temGastos = this.gestor.temGastosNoGeral();

        if (this.gestor.categoriaAtiva === "Geral") {
            vazio.classList.toggle("d-none", temGastos);
            conteudo.classList.toggle("d-none", !temGastos);
            if (tabelaContainer) tabelaContainer.classList.add("d-none");
            if (btnAddDentro) btnAddDentro.classList.add("d-none");
            if (btnExcluir) btnExcluir.classList.add("d-none");
        } else {
            vazio.classList.add("d-none");
            conteudo.classList.remove("d-none");
            if (tabelaContainer) tabelaContainer.classList.remove("d-none");
            if (btnAddDentro) btnAddDentro.classList.remove("d-none");
            if (btnExcluir) btnExcluir.classList.remove("d-none");
        }
    }
}
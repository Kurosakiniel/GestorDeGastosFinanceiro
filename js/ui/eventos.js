class EventosManager {
    constructor(gestor) {
        this.gestor = gestor;
    }

    configurar() {
        // Tab Geral
        document.getElementById("tabGeral").onclick = () => this.gestor.setCategoriaAtiva("Geral");

        // Modal Categoria
        document.getElementById("btnMais").onclick = () => this.abrirModal("modal");
        document.getElementById("btnAddGasto").onclick = () => this.abrirModal("modal");
        document.getElementById("btnCancelar").onclick = () => this.fecharModal("modal");

        document.getElementById("btnConcluir").onclick = () => {
            const input = document.getElementById("inputGasto");
            if (input.value.trim()) {
                this.gestor.adicionarCategoria(input.value.trim());
                input.value = "";
                this.fecharModal("modal");
            }
        };

        // Modal Gasto
        document.getElementById("btnAddDentro").onclick = () => this.abrirModal("modalGasto");
        document.getElementById("cancelarGasto").onclick = () => this.fecharModal("modalGasto");

        document.getElementById("salvarGasto").onclick = () => {
            const desc = document.getElementById("descricaoGasto").value;
            const valor = document.getElementById("valorGasto").value;
            if (desc && valor) {
                this.gestor.adicionarGasto(desc, valor);
                this.fecharModal("modalGasto");
            }
        };

        document.getElementById("btnExcluirCategoria").onclick = () => {
            if (confirm("Excluir esta categoria?")) {
                this.gestor.excluirCategoria(this.gestor.categoriaAtiva);
            }
        };
    }

    abrirModal(id) { document.getElementById(id).style.display = "flex"; }
    fecharModal(id) { document.getElementById(id).style.display = "none"; }
}
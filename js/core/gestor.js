class Sujeito {
    constructor() {
        this.observadores = [];
    }

    assinar(obs) {
        this.observadores.push(obs);
    }

    notificar(dados) {
        this.observadores.forEach(obs => {
            if (typeof obs.atualizar === "function") {
                obs.atualizar(dados);
            }
        });
    }
}

class GestorFinanceiro extends Sujeito {
    constructor() {
        super();
        // Carrega os dados do LocalStorage ou inicia vazio
        this.categorias = JSON.parse(localStorage.getItem("categorias")) || [];
        // Estado da aba selecionada
        this.categoriaAtiva = "Geral";
    }

    // Gerencia qual aba está selecionada
    setCategoriaAtiva(nome) {
        this.categoriaAtiva = nome;
        // Notificamos os observadores (UI, Gráfico) para redesenhar com o novo foco
        this.notificar(this.categorias);
    }

    adicionarCategoria(nome) {
        // PADRÃO CRIACIONAL: Factory
        const nova = CategoriaFactory.criar(nome);
        this.categorias.push(nova);
        this.categoriaAtiva = nome; 
        this.salvar();
    }

    adicionarGasto(descricao, valor) {
        // Encontra a categoria que está aberta no momento (exceto 'Geral')
        const cat = this.categorias.find(c => c.nome === this.categoriaAtiva);
        
        if (cat) {
            cat.gastos.push({ 
                id: Date.now(),
                descricao: descricao, 
                valor: parseFloat(valor) 
            });
            this.salvar();
        } else {
            console.warn("Selecione uma categoria específica para adicionar gastos.");
        }
    }

    excluirCategoria(nome) {
        if (nome === "Geral") return;

        this.categorias = this.categorias.filter(c => c.nome !== nome);
        
        // Se a categoria excluída era a ativa, voltamos para a "Geral"
        if (this.categoriaAtiva === nome) {
            this.categoriaAtiva = "Geral";
        }
        
        this.salvar();
    }

    salvar() {
        // Persistência no LocalStorage
        localStorage.setItem("categorias", JSON.stringify(this.categorias));
        // O Observer brilha aqui: um único comando atualiza tudo que estiver "assinado"
        this.notificar(this.categorias);
    }

    // Helper para verificar se existem gastos no sistema todo
    temGastosNoGeral() {
        return this.categorias.some(c => c.gastos.length > 0);
    }
}
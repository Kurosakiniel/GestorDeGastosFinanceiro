class CategoriaFactory {
    static criar(nome) {
        return {
            id: Date.now() + Math.random(), // Garante ID único mesmo em criações rápidas
            nome: nome,
            gastos: []
        };
    }
}
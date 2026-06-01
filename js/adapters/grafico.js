class GraficoAdapter {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chart = null;
    }

    // Método que o Observer chama
    atualizar(categorias) {
        const ctx = document.getElementById(this.canvasId);
        if (!ctx) return;

        const dadosFormatados = this.prepararDados(categorias);

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: dadosFormatados.labels,
                datasets: [{
                    data: dadosFormatados.valores,
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
                }]
            }
        });
    }

    prepararDados(categorias) {
        return {
            labels: categorias.map(c => c.nome),
            valores: categorias.map(c => c.gastos.reduce((sum, g) => sum + g.valor, 0))
        };
    }
}
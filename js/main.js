document.addEventListener("DOMContentLoaded", () => {
    // 1. Instância do Core
    const gestor = new GestorFinanceiro();

    // 2. Instância dos Observadores
    const grafico = new GraficoAdapter("graficoGastos");
    const ui = new UIRenderer(gestor);

    // 3. Conecta os padrões (Observer)
    gestor.assinar(grafico);
    gestor.assinar(ui);

    // 4. Inicializa os eventos
    const eventos = new EventosManager(gestor);
    eventos.configurar();

    // 5. Carregamento inicial (força a UI a desenhar o que está no localStorage)
    gestor.salvar(); 
});
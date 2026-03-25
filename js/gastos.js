// ➕ ADICIONAR GASTO
function adicionarGasto(descricao, valor) {

  const categoria = categorias.find(c => c.nome === categoriaAtiva);

  if (!categoria) return;

  categoria.gastos.push({
    descricao: descricao,
    valor: valor
  });

  salvarDados();
}
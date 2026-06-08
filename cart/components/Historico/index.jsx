export default function Historico({ aoVoltar, itensHistorico }) {
  return (
    <div className="historico-container">
      <button onClick={aoVoltar}>⬅ Voltar para a Home</button>
      <h2>📜 Histórico de Compras</h2>
      
      {itensHistorico.length === 0 ? (
        <p>Você ainda não realizou nenhuma compra.</p>
      ) : (
        itensHistorico.map((compra) => (
          <div key={compra.id} className="card-compra">
            <p>Data: {compra.data} - Total: R$ {compra.total.toFixed(2)}</p>
            <ul>
              {compra.itens.map((item, index) => (
                <li key={index}>{item.nome}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
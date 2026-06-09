import './styles.css';

export default function Historico({ aoVoltar, itensHistorico }) {
  return (
    <div className="historico-container">
      <div className="historico-header-bar">
        <h2>📜 Histórico de Compras</h2>
        <button className="btn-voltar" onClick={aoVoltar}>⬅ Voltar para a Home</button>
      </div>
      
      {itensHistorico.length === 0 ? (
        <div className="historico-vazio">
          <p>Você ainda não realizou nenhuma compra.</p>
        </div>
      ) : (
        <div className="historico-grid">
          {itensHistorico.map((compra) => (
            <div key={compra.id} className="card-compra">
              
              <div className="card-compra-header">
                <span className="compra-data">📅 {compra.data}</span>
                <span className="compra-total">R$ {compra.total.toFixed(2).replace('.', ',')}</span>
              </div>
              
              <div className="card-compra-body">
                <p className="titulo-itens">Itens do pedido:</p>
                {compra.itens.map((item, index) => (
                  <div key={index} className="item-linha">
                    <span className="item-nome">{item.nome}</span>
                    <span className="item-preco">R$ {Number(item.preco).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
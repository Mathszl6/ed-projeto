import './styles.css'; 

export default function Card({ produto, aoAdicionar }) {
  return (
    <div className="card-container">
      
      <div className="card-header">
        <h3 className="card-title">{produto.nome}</h3>
        <span className="card-price">
          R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div className="card-body">
        <p className="card-description">
          {produto.descricao || "Sem descrição informada."}
        </p>
        
        <div className="card-footer">
          <span className="card-stock">
            📦 Estoque: {produto.quantidade} un.
          </span>

          <button 
            className="btn-adicionar" 
            onClick={() => aoAdicionar(produto)}
          >
            Adicionar
          </button>
        </div>
      </div>

    </div>
  );
}
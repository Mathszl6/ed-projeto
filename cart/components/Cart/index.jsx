import './styles.css';

export default function Cart({ isOpen, onClose, itens, aoRemover, aoDesfazer, aoFinalizar }) {
  if (!isOpen) return null; 

  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0);

  return (
    <div className="modal-overlay">
      
      <div className="modal-content">
        
        <div className='cart'>
          <h2 className='title-cart'>🛒 Seu Carrinho</h2>
          <button onClick={onClose} className='btn-close'>✖</button>
        </div>
        
        <button onClick={aoDesfazer} className='btn-desfazer'>
          ↩️ Desfazer Última Ação
        </button>

        {itens.length === 0 ? (
          <p className='text'>O carrinho está vazio.</p>
        ) : (
          <div className='map'>
            {itens.map((item, index) => (
              <div key={index} className='index'>
                <span>{item.nome}</span>
                <div className='price'>
                    <span style={{ fontWeight: 'bold' }}>R$ {Number(item.preco).toFixed(2)}</span>
                    <button onClick={() => aoRemover(item.id)} className='btn-close'>X</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
          <h3>Total: R$ {total.toFixed(2).replace('.', ',')}</h3>
          <button onClick={aoFinalizar} disabled={itens.length === 0} style={{ width: '100%', padding: '12px', background: itens.length > 0 ? '#005b96' : '#ccc', color: '#fff', border: 'none', borderRadius: '5px', cursor: itens.length > 0 ? 'pointer' : 'not-allowed' }}>
            Finalizar Compra
          </button>
        </div>

      </div>
    </div>
  );
}
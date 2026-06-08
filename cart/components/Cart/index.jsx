import './styles.css';

export default function Cart({ isOpen, onClose, itens, aoRemover, aoDesfazer, aoFinalizar }) {
  if (!isOpen) return null; 

  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0);

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      
      <div className="modal-content" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '450px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #005b96', paddingBottom: '10px', marginBottom: '15px' }}>
          <h2 style={{ color: '#005b96', margin: 0 }}>🛒 Seu Carrinho</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
        </div>
        
        <button onClick={aoDesfazer} style={{ width: '100%', marginBottom: '15px', background: '#00a8cc', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ↩️ Desfazer Última Ação
        </button>

        {itens.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', padding: '20px 0' }}>O carrinho está vazio.</p>
        ) : (
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {itens.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', background: '#f5f7fa', padding: '10px', marginBottom: '8px', borderRadius: '4px' }}>
                <span>{item.nome}</span>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <span style={{ fontWeight: 'bold' }}>R$ {Number(item.preco).toFixed(2)}</span>
                    <button onClick={() => aoRemover(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>
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
import { useState } from "react";
import './styles.css'; // Não esqueça de importar o CSS!

export default function Modal({ isOpen, onClose, aoSalvar }) {
  // Estado corrigido para "produto" e com o campo "descricao"
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    quantidade: '',
    descricao: ''
  });

  // Funções necessárias para o formulário não travar a tela
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    aoSalvar(produto); // Envia os dados para a tela principal
  };

  // Se o modal não estiver aberto, não mostra nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Novo Produto 📦</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          
          <div>
            <label className="form-label">Nome:</label>
            <input 
              type="text" name="nome" value={produto.nome} 
              onChange={handleChange} required className="form-input" 
            />
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Preço (R$):</label>
              <input 
                type="number" name="preco" step="0.01" value={produto.preco} 
                onChange={handleChange} required className="form-input" 
              />
            </div>
            
            <div className="form-col">
              <label className="form-label">Estoque:</label>
              <input 
                type="number" name="quantidade" min="0" value={produto.quantidade} 
                onChange={handleChange} required className="form-input" 
              />
            </div>
          </div>

          <div>
            <label className="form-label">Descrição:</label>
            <textarea 
              name="descricao" value={produto.descricao} 
              onChange={handleChange} rows="3" className="form-input" 
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
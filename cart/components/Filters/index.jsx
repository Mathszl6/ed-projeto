import './styles.css'; 
import { FiSearch, FiFilter } from 'react-icons/fi'

export default function Filters({ termoBusca, setTermoBusca, criterioOrdenacao, setCriterioOrdenacao }) {
    return (
        <div className="filters-container">
            <div className="box-input">
                <FiSearch style={{ color: '#9ca3af', marginLeft: '6px', fontSize: '18px' }} />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="input-busca"
                />
            </div>

            <div className="box-select">
                <FiFilter style={{ color: '#9ca3af', marginRight: '4px', fontSize: '18px' }} />
                <select 
                  value={criterioOrdenacao} 
                  onChange={(e) => setCriterioOrdenacao(e.target.value)} 
                  className="select-ordenacao"
                >
                    <option value="">Ordem de Cadastro (Padrão)</option>
                    <option value="nome">Ordenar por nome (A-Z)</option>
                    <option value="preco_menor">Preço (Menor para Maior)</option>
                    <option value="preco_maior">Preço (Maior para Menor)</option>
                </select>
            </div>
        </div>
    )
}
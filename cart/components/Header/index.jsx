import { useState } from 'react';
import './styles.css';
import { FaCartShopping, FaPlus, FaClockRotateLeft } from "react-icons/fa6"; // 🔥 Ícone adicionado aqui
import Modal from '../Modal'; 

export default function Header ({ aoSalvarProduto, quantidadeCarrinho, aoAbrirCarrinho, aoAbrirHistorico }) {
    const [isOpen, setIsOpen] = useState(false);

    const lidarComProdutoSalvo = (novoProduto) => {
        aoSalvarProduto(novoProduto); 
        setIsOpen(false); 
    };

    return(
        <div className='header-container' style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center' }}>
            <div className='boxTitle'>
                <FaCartShopping className='icon' />
                <h1>Carrinho de Compras</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* Botão Histórico */}
                <button className='btn' onClick={aoAbrirHistorico} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaClockRotateLeft /> 
                    <span>Histórico</span>
                </button>

                {/* Botão Carrinho */}
                <button className='btn' onClick={aoAbrirCarrinho} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaCartShopping /> 
                    <span>Carrinho</span>
                    {quantidadeCarrinho > 0 && (
                        <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '12px' }}>
                            {quantidadeCarrinho}
                        </span>
                    )}
                </button>

                {/* Botão Cadastro */}
                <button className='btn' onClick={() => setIsOpen(true) }>
                    <FaPlus className='icon'/> 
                    <p className='title-btn'>Cadastrar</p>
                </button>
            </div>

            <Modal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                aoSalvar={lidarComProdutoSalvo} 
            />
        </div>
    )
}
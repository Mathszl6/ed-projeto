import { useState } from 'react';
import './styles.css';
import { FaCartShopping, FaPlus } from "react-icons/fa6";
import Modal from '../Modal'; 

// função que o App mandou através das props
export default function Header ({ aoSalvarProduto }) {
    const [isOpen, setIsOpen] = useState(false);

    // qunado o modal terminar, ele chama essa função
    const lidarComProdutoSalvo = (novoProduto) => {
        // envia o produto lá para o app
        aoSalvarProduto(novoProduto); 
        
        // pode fechar o modal
        setIsOpen(false); 
    };

    return(
        <div className='header-container'>
            <div className='boxTitle'>
                <FaCartShopping className='icon' />
                <h1>Carrinho de Compras</h1>
            </div>
            
            <div>
                <button className='btn' onClick={() => setIsOpen(true) }>
                    <FaPlus className='icon'/> 
                    <p className='title-btn'>Cadastrar produto</p>
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
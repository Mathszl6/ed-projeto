import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Header from '../components/Header' 
import Card from '../components/Card'
import Cart from '../components/Cart'
import Historico from '../components/Historico'

function App() {
  //produtos mockados para teste
const [produtos, setProdutos] = useState([
    { id: 1, nome: "Teclado Mecânico Custom", preco: "350.00", quantidade: 5 },
    { id: 2, nome: "Mouse Gamer", preco: "120.00", quantidade: 10 }
  ])
  
  const [carrinho, setCarrinho] = useState([]) 
  const [historicoLocal, setHistoricoLocal] = useState([]) 
  const [historicoDeRemocoes, setHistoricoDeRemocoes] = useState([]);
  const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false)
  const [telaAtual, setTelaAtual] = useState('home') 

 //teste simulando o back 
  const adicionarProduto = (novoProduto) => {
    //pega o id do produto -> a data é o id
    const produtoComId = { ...novoProduto, id: Date.now() } 
    setProdutos([...produtos, produtoComId])
    alert("Produto cadastrado na memória local!")
  }

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]) 
  }

  const removerDoCarrinho = (produtoId) => {
    //procura o produto que vai ser removido
    const produtoRemovido = carrinho.find(item => item.id === produtoId);
    
    //salva esse produto no historico de remocoes (para o botao de desfazer alteracao funcionar)
    setHistoricoDeRemocoes([...historicoDeRemocoes, produtoRemovido]);
    
    //remove do carrinho, utilizando o id
    setCarrinho(carrinho.filter(item => item.id !== produtoId));
}

const desfazerUltimaAcao = () => {
    if (historicoDeRemocoes.length === 0) {
        alert("Nada para desfazer!");
        return;
    }

    //pega o ultimo item que foi removido
    const ultimoRemovido = historicoDeRemocoes[historicoDeRemocoes.length - 1];
    
    //coloca ele de volta no carrinho
    setCarrinho([...carrinho, ultimoRemovido]);
    
    //tira ele do historico de remocoes
    setHistoricoDeRemocoes(historicoDeRemocoes.slice(0, -1));
}

const finalizarCompra = () => {
    if (carrinho.length === 0) return;

    //verifica o estoque
    for (let itemCarrinho of carrinho) {
      const produtoOriginal = produtos.find(p => p.id === itemCarrinho.id);
      if (produtoOriginal.quantidade <= 0) {
        alert(`O produto ${produtoOriginal.nome} não tem mais estoque!`);
        return; // para a funcao, para nao finalizar a compra
      }
    }

    //cria registro e atualiza
    const totalCompra = carrinho.reduce((acc, item) => acc + Number(item.preco), 0);
    const novaCompra = { 
      id: Date.now(), 
      data: new Date().toLocaleDateString(),
      total: totalCompra, 
      itens: [...carrinho] 
    };
    
    const produtosAtualizados = produtos.map((prod) => {
      const qtdNoCarrinho = carrinho.filter(item => item.id === prod.id).length;
      return { ...prod, quantidade: Math.max(0, prod.quantidade - qtdNoCarrinho) }; // Math.max garante que não desça de 0
    });

    setProdutos(produtosAtualizados);
    setHistoricoLocal((prev) => [...prev, novaCompra]);
    setCarrinho([]); 
    setIsCarrinhoOpen(false);
    setTelaAtual('historico');
  };

return (
   <div className='container'>
      <Header 
        aoSalvarProduto={adicionarProduto} 
        quantidadeCarrinho={carrinho.length}
        aoAbrirCarrinho={() => setIsCarrinhoOpen(true)}
        aoAbrirHistorico={() => setTelaAtual('historico')}
      />
      
      {/* para navegar entre as telas */}
      {telaAtual === 'home' ? (
        <main className='box-main'>
          <h2 className='title'>Meus Produtos</h2>
          <div className="produtos-grid">
            {produtos.map((produto) => (
              <Card key={produto.id} produto={produto} aoAdicionar={adicionarAoCarrinho} />
            ))}
          </div>
        </main>
      ) : (
        <Historico aoVoltar={() => setTelaAtual('home')} itensHistorico={historicoLocal} />
      )}

      <Cart
        isOpen={isCarrinhoOpen}
        onClose={() => setIsCarrinhoOpen(false)}
        itens={carrinho} 
        aoRemover={removerDoCarrinho}
        aoDesfazer={desfazerUltimaAcao}
        aoFinalizar={finalizarCompra}
      />
   </div>
  )
}

export default App
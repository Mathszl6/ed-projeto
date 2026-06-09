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
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([]) 
  const [historicoLocal, setHistoricoLocal] = useState([]) 
  const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false)
  const [telaAtual, setTelaAtual] = useState('home') 

  // Carrega tudo da API logo quando o site abre
  useEffect(() => {
    carregarTudo();
  }, [])

  // Centraliza as requisições GET
  const carregarTudo = () => {
    axios.get('http://127.0.0.1:8000/produtos').then(res => setProdutos(res.data)).catch(console.error)
    axios.get('http://127.0.0.1:8000/carrinho').then(res => setCarrinho(res.data)).catch(console.error)
    axios.get('http://127.0.0.1:8000/historico').then(res => setHistoricoLocal(res.data)).catch(console.error)
  }

  // Cadastro de produto (Array Estático)
  const adicionarProduto = (novoProduto) => {
    axios.post('http://127.0.0.1:8000/produtos', novoProduto)
      .then(res => {
         carregarTudo()
         alert(res.data.mensagem)
      })
      .catch(error => {
         if (error.response && error.response.data) alert(error.response.data.detail);
      })
  }

  // Adiciona ao Carrinho (Lista Encadeada)
  const adicionarAoCarrinho = (produto) => {
    const quantidadeJaNoCarrinho = carrinho.filter(item => item.id === produto.id).length;
    if (quantidadeJaNoCarrinho >= produto.quantidade) {
      alert(`Ops! O estoque máximo de ${produto.nome} é de ${produto.quantidade} unidades.`);
      return; 
    }
    axios.post('http://127.0.0.1:8000/carrinho', produto)
      .then(res => carregarTudo())
      .catch(console.error)
  }

  // Remover do Carrinho (Lista Encadeada e Pilha)
  const removerDoCarrinho = (produtoId) => {
    axios.delete(`http://127.0.0.1:8000/carrinho/${produtoId}`)
      .then(res => carregarTudo())
      .catch(console.error)
  }

  // Desfazer (Pilha de ações)
  const desfazerUltimaAcao = () => {
    axios.post('http://127.0.0.1:8000/carrinho/desfazer')
      .then(res => carregarTudo())
      .catch(error => {
        if (error.response && error.response.data) alert(error.response.data.detail);
      })
  }

  // Finalizar Compra
  const finalizarCompra = () => {
    if (carrinho.length === 0) return;
    axios.post('http://127.0.0.1:8000/compra/finalizar')
      .then(res => {
        carregarTudo();
        setIsCarrinhoOpen(false);
        setTelaAtual('historico');
        alert(res.data.mensagem);
      })
      .catch(error => {
        if (error.response && error.response.data) alert(error.response.data.detail);
      })
  }

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
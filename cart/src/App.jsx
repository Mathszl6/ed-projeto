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
import Filters from '../components/Filters'

function App() {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([]) 
  const [historicoLocal, setHistoricoLocal] = useState([]) 
  const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false)
  const [telaAtual, setTelaAtual] = useState('home') 

  // Estados dos filtros
  const [termoBusca, setTermoBusca] = useState('')
  const [criterioOrdenacao, setCriterioOrdenacao] = useState('nome')

  // 1. Carrega Carrinho e Histórico
  const carregarTudo = () => {
    axios.get('http://127.0.0.1:8000/carrinho').then(res => setCarrinho(res.data)).catch(console.error)
    axios.get('http://127.0.0.1:8000/historico').then(res => setHistoricoLocal(res.data)).catch(console.error)
  }

  // 2. Carrega Produtos do Backend e aplica filtros
  const carregarProdutos = () => {
    axios.get('http://127.0.0.1:8000/produtos')
      .then(res => {
        let resultados = res.data;
        
        // Simula a Busca
        resultados = resultados.filter(produto => 
          produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
        );

        // Simula a Ordenação
        if (criterioOrdenacao === 'nome') {
          resultados.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (criterioOrdenacao === 'preco_menor') {
          resultados.sort((a, b) => a.preco - b.preco);
        } else if (criterioOrdenacao === 'preco_maior') {
          resultados.sort((a, b) => b.preco - a.preco);
        }

        setProdutos(resultados);
      })
      .catch(console.error)
  }

  // 3. Roda uma vez ao abrir o site para pegar carrinho e histórico
  useEffect(() => {
    carregarTudo();
  }, [])

  // 4. Roda os produtos sempre que o usuário digitar ou mudar a ordenação
  useEffect(() => {
    carregarProdutos();
  }, [termoBusca, criterioOrdenacao])

  // Cadastro de produto (Array Estático)
  const adicionarProduto = (novoProduto) => {
    axios.post('http://127.0.0.1:8000/produtos', novoProduto)
      .then(res => {
         carregarProdutos(); // Recarrega do backend pra refletir na tela
         alert(res.data.mensagem);
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

  // Remover do Carrinho (Lista Encadeada e Stack)
  const removerDoCarrinho = (produtoId) => {
    axios.delete(`http://127.0.0.1:8000/carrinho/${produtoId}`)
      .then(res => carregarTudo())
      .catch(console.error)
  }

  // Desfazer (Pilha de ações / Stack)
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
        carregarProdutos(); // Atualiza o estoque que diminuiu
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
      
      {telaAtual === 'home' ? (
        <main className='box-main'>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className='title' style={{ margin: 0 }}>Meus Produtos</h2>
            <Filters
              termoBusca={termoBusca}
              setTermoBusca={setTermoBusca}
              criterioOrdenacao={criterioOrdenacao}
              setCriterioOrdenacao={setCriterioOrdenacao}
            />
          </div>

          {/* Grid de Produtos */}
          <div className="produtos-grid">
            {produtos.length > 0 ? (
              produtos.map((produto) => (
                <Card key={produto.id} produto={produto} aoAdicionar={adicionarAoCarrinho} />
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', marginTop: '20px', color: '#666' }}>
                Nenhum produto encontrado com o nome "{termoBusca}".
              </p>
            )}
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
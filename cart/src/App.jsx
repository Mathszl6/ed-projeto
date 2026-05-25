import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Header from '../components/Header' 
import Card from '../components/Card' // 🔥 IMPORTAMOS O CARD AQUI! (Ajuste a pasta se precisar)

function App() {
  const [produtos, setProdutos] = useState([])
  //funcao que adiciona um novo produto -> pega oq ja estava salvo, joga dentro de uma lista nova e adiciona o novo produto no final dessa lista
  const adicionarProduto = (novoProduto) => {
    setProdutos([...produtos, novoProduto])
  }

  return (
   <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Header aoSalvarProduto={adicionarProduto} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#333' }}>Meus Produtos Cadastrados</h2>
        
        {produtos.length === 0 ? (
          <p style={{ color: '#777' }}>Nenhum produto cadastrado ainda. Clique em "Cadastrar produto" lá em cima!</p>
        ) : (
          
          <div className="produtos-grid">
            {produtos.map((produto) => (
              <Card key={produto.id} produto={produto} />
            ))}
          </div>

        )}
      </main>
   </div>
  )
}

export default App
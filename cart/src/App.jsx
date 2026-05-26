import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Header from '../components/Header' 
import Card from '../components/Card' // 🔥 IMPORTAMOS O CARD AQUI! (Ajuste a pasta se precisar)

function App() {
  const [produtos, setProdutos] = useState([])
  // useEffect para conseguir buscar a lista no back assim que o site carrega, ate com F5
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/produtos')
      .then(response => {
        setProdutos(response.data)
      })
      .catch(error => console.error("Erro ao buscar os produtos da API:", error))
  }, [])

  // funcao que adiciona um novo produto mandando pro FastAPI
  const adicionarProduto = (novoProduto) => {
    axios.post('http://127.0.0.1:8000/produtos', novoProduto)
      .then(response => {
        setProdutos([...produtos, novoProduto])
        alert(response.data.mensagem)
      })
      .catch(error => {
        if (error.response && error.response.data) {
          alert(error.response.data.detail) // Mostra o erro do array cheio/repetido
        } else {
          alert("Erro de comunicação com o backend.")
        }
      })
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
# Estruturas de Dados - Projeto 02: Carrinho de Compras

## Integrantes do Grupo
- Matheus Felipe Dias da Silva (TADS 3)
- Rafaela Virginio Franco (TADS 4)

## Sobre o Projeto
Sistema que simula um carrinho de compras de uma loja virtual desenvolvido para a disciplina de Estruturas de Dados. 
O backend foi desenvolvido inteiramente em **Python** (utilizando FastAPI) e o frontend em **React** (utilizando Vite).

---

## Como Executar o Projeto

Para testar a aplicação, é necessário rodar o Backend e o Frontend separadamente.

### Pré-requisitos
- [Python 3.x](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/) (inclui o `npm`)

### 1. Rodando o Backend (Python)
Abra um terminal na raiz do projeto, navegue até a pasta `backend` e execute os comandos abaixo:

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências necessárias
pip install fastapi uvicorn pydantic

# Execute o servidor backend
python main.py
```
O backend ficará disponível em: `http://127.0.0.1:8000`. 
*Dica: Você pode acessar o Swagger da API em `http://127.0.0.1:8000/docs`.*

### 2. Rodando o Frontend (React/Vite)
Abra um **novo terminal** na raiz do projeto, navegue até a pasta `cart` e execute os comandos abaixo:

```bash
# Entre na pasta do frontend
cd cart

# Instale as dependências do projeto
npm install

# Execute o servidor de desenvolvimento
npm run dev
```
Acesse o link gerado no terminal (geralmente `http://localhost:5173/`) no seu navegador.

---

## Estruturas de Dados Utilizadas (Backend)

Conforme os requisitos da disciplina, as seguintes estruturas de dados foram implementadas manualmente e utilizadas no backend (`backend/main.py`):

- **Array Estático**: Gerenciamento do estoque de produtos (com capacidade predefinida de 10 itens, pode ser alterado mudando o campo `capacidade` na linha 114).
- **Pilha (Stack)**: Utilizada para a funcionalidade de "Desfazer a última ação" de remoção de itens do carrinho.
- **Lista Encadeada (Linked List)**: Gerenciamento dos itens que estão no carrinho e do histórico de compras.
- **List Comprehensions**: Utilizado na listagem de produtos para busca rápida pelo nome.

---

## Funcionalidades
- [x] Cadastrar produto com nome, preço, quantidade em estoque e descrição;
- [x] Adicionar produto ao carrinho com quantidade desejada;
- [x] Remover produto do carrinho;
- [x] Desfazer a última ação no carrinho (Pilha);
- [x] Exibir resumo do carrinho com total atualizado;
- [x] Finalizar compra e atualizar estoque;
- [x] Exibir histórico de compras realizadas (Lista encadeada);
- [x] Ordenar a lista de produtos por nome ou por preço;
- [x] Buscar produto por nome;

## A definir em aula
- Localização rápida de produto por código (tabela hash)

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import time


class Array:
    """Array Estático (Já existia)"""
    def __init__(self, capacidade: int = 10):
        self._capacidade: int = capacidade
        self._tamanho: int = 0
        # Aqui tem alocação de memória com espaços predefinidos
        self._dados: List[Any] = [None] * capacidade

    def inserir(self, item: Dict[str, Any]) -> None:
        # Verificacao de nomes duplicados, se tiver, nao cadastra
        for i in range(self._tamanho):
            if self._dados[i]["nome"].lower() == item["nome"].lower():
                raise OverflowError("Um produto com esse nome já existe no sistema.")

        if self._tamanho >= self._capacidade:
            raise OverflowError("A capacidade máxima de itens foi atingida.")

        self._dados[self._tamanho] = item
        self._tamanho += 1

    def listar(self) -> List[Dict[str, Any]]:
        resultado = []
        for i in range(self._tamanho):
            resultado += [self._dados[i]]
        return resultado
        
    def atualizar_estoque(self, id_produto: int, qtd_comprada: int):
        # Atualiza a quantidade do produto pelo ID
        for i in range(self._tamanho):
            if self._dados[i]["id"] == id_produto:
                nova_qtd = self._dados[i]["quantidade"] - qtd_comprada
                if nova_qtd < 0:
                    nova_qtd = 0
                self._dados[i]["quantidade"] = nova_qtd
                break

class Node:
    # Nó para as listas e pilhas onde simulamos alocação de memória por ponteiro.
    def __init__(self, data: Any):
        self.data = data
        self.next: Optional['Node'] = None

class Stack:
    # usamos pilha para gerenciar as ações de 'Desfazer'.
    def __init__(self):
        self.top: Optional[Node] = None
        
    def push(self, data: Any):
        new_node = Node(data)
        new_node.next = self.top
        self.top = new_node
        
    def pop(self) -> Any:
        if self.top is None:
            return None
        dado_removido = self.top.data
        self.top = self.top.next
        return dado_removido

class LinkedList:
    # Lista Encadeada para o carrinho e histórico.
    def __init__(self):
        self.head: Optional[Node] = None
        
    def insert(self, data: Any):
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return
        
        atual = self.head
        while atual.next is not None:
            atual = atual.next
        atual.next = new_node
        
    def remove_by_id(self, id_alvo: int) -> Any:
        # Remove a primeira aparição do ID
        atual = self.head
        anterior = None
        
        while atual is not None:
            if atual.data.get("id") == id_alvo:
                if anterior is None:
                    self.head = atual.next
                else:
                    anterior.next = atual.next
                return atual.data
            anterior = atual
            atual = atual.next
            
        return None
        
    def clear(self):
        self.head = None
        
    def list_all(self) -> List[Any]:
        resultado = []
        atual = self.head
        while atual is not None:
            resultado += [atual.data]
            atual = atual.next
        return resultado


# Chamando as classes e definindo a capacidade máxima de 10 itens para o estoque
estoque = Array(capacidade=10)
carrinho_lista = LinkedList()
historico_lista = LinkedList()
pilha_desfazer = Stack()


# Pydantic para validar a requisição
class Produto(BaseModel):
    id: Optional[int] = None
    nome: str
    preco: float
    quantidade: int
    descricao: str

app = FastAPI(title="Carrinho de Compras - Completo")

# Para o Frontend em React conseguir se comunicar sem erro de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
@app.post("/produtos", status_code=201)
def cadastrar_produto(produto: Produto):
    try:
        dict_prod = produto.model_dump()
        if not dict_prod.get("id"):
            dict_prod["id"] = int(time.time() * 1000)
        estoque.inserir(dict_prod)
        return {"mensagem": "Produto cadastrado com sucesso no estoque!", "produto": dict_prod}
    except OverflowError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno.")

@app.get("/produtos")
def listar_produtos():
    return estoque.listar()

# Carrinho
@app.get("/carrinho")
def listar_carrinho():
    return carrinho_lista.list_all()

@app.post("/carrinho")
def adicionar_ao_carrinho(produto: dict):
    carrinho_lista.insert(produto)
    return {"mensagem": "Produto inserido na lista do Carrinho."}

@app.delete("/carrinho/{produto_id}")
def remover_do_carrinho(produto_id: int):
    removido = carrinho_lista.remove_by_id(produto_id)
    if removido:
        pilha_desfazer.push(removido) # Salva na pilha para poder desfazer
        return {"mensagem": "Removido do carrinho e guardado na pilha."}
    raise HTTPException(status_code=404, detail="Produto não encontrado no carrinho.")

@app.post("/carrinho/desfazer")
def desfazer_remocao():
    produto = pilha_desfazer.pop()
    if produto is None:
        raise HTTPException(status_code=400, detail="A pilha de desfazimento está vazia!")
    
    # Devolve o item que tava no topo da pilha para o carrinho
    carrinho_lista.insert(produto)
    return {"mensagem": "Última remoção desfeita com sucesso!", "produto": produto}

# Finalizar compra e ver historico
@app.post("/compra/finalizar")
def finalizar_compra():
    itens_comprados = carrinho_lista.list_all()
    if len(itens_comprados) == 0:
        raise HTTPException(status_code=400, detail="O carrinho está vazio.")
        
    total = sum(float(item["preco"]) for item in itens_comprados)
    
    # Dicionário temporário para contar quantos de cada produto estão sendo comprados
    qtd_por_produto = {}
    for item in itens_comprados:
        prod_id = item["id"]
        qtd_por_produto[prod_id] = qtd_por_produto.get(prod_id, 0) + 1
        
    # Atualiza estoque real no Array
    for prod_id, qtd in qtd_por_produto.items():
        estoque.atualizar_estoque(prod_id, qtd)
        
    nova_compra = {
        "id": int(time.time() * 1000),
        "data": time.strftime("%d/%m/%Y %H:%M:%S"),
        "total": total,
        "itens": itens_comprados
    }
    
    # Salva no histórico
    historico_lista.insert(nova_compra)
    
    # Limpa as memórias da compra atual
    carrinho_lista.clear()
    while pilha_desfazer.pop() is not None:
        pass
        
    return {"mensagem": "Compra finalizada com sucesso!"}

@app.get("/historico")
def listar_historico():
    return historico_lista.list_all()

if __name__ == "__main__":
    # Executa o backend na porta 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)

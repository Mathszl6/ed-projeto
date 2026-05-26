import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Array:
    def __init__(self, capacidade: int = 10):
        self.capacidade = capacidade
        self.tamanho = 0
        self.dados = [None] * capacidade #definimos a quantidade de itens a serem colocados aqui

    def inserir(self, item):
        # Verificacao de nomes duplicados, se tiver, nao cadastra
        for i in range(self.tamanho):
            if self.dados[i]["nome"].lower() == item["nome"].lower():
                raise Exception(f"O produto '{item['nome']}' já existe no carrinho.")

        if self.tamanho >= self.capacidade:
            raise Exception("A capacidade máxima de itens foi atingida.")

        self.dados[self.tamanho] = item
        self.tamanho += 1

    def listar(self):
        resultado = []
        for i in range(self.tamanho):
            resultado += [self.dados[i]]
        return resultado

# Pydantic para validar a requisição
class Produto(BaseModel):
    nome: str
    preco: float
    quantidade: int
    descricao: str


app = FastAPI()


# Para o Frontend em React conseguir se comunicar sem erro de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Autoriza qualquer outro host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chamamos a classe e damos a capacidade max de 10
estoque = Array(capacidade=10)


# Rotas
@app.post("/produtos", status_code=201)
def cadastrar_produto(produto: Produto):
    try:
        estoque.inserir(produto.model_dump())
        return {"mensagem": "Produto cadastrado com sucesso!", "produto": produto}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/produtos")
def listar_produtos():
    return estoque.listar()


if __name__ == "__main__":
    # Executa o backend na porta 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)

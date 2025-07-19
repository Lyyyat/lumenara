import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.jss";

const firebaseConfig = {
    apiKey: "AIzaSyBmnU28QAKRvijZcKTIzLhrRNbZDTzdqNM",
    authDomain: "lumenara-3acb5.firebaseapp.com",
    databaseURL: "https://lumenara-3acb5-default-rtdb.firebaseio.com",
    projectId: "lumenara-3acb5",
    storageBucket: "lumenara-3acb5.appspot.com",
    messagingSenderId: "309416608169",
    appId: "1:309416608169:web:571ba528cc32c2f73704b8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Elementos do formulário
const buscaCodigoProduto = document.getElementById('buscaCodigoProduto');
const editarNomeProduto = document.getElementById('editarNomeProduto');
const editarCategoriaProduto = document.getElementById('editarCategoriaProduto');
const editarQuantidadeProduto = document.getElementById('editarQuantidadeProduto');
const editarValorProduto = document.getElementById('editarValorProduto');
const dadosProduto = document.getElementById('dadosProduto');

// Botões
const btnBuscarProduto = document.getElementById('btnBuscarProduto');
const btnAtualizarProduto = document.getElementById('btnAtualizarProduto');
const btnExcluirProduto = document.getElementById('btnExcluirProduto');
const btnLimparBusca = document.getElementById('btnLimparBusca');

// Função para buscar produto
function buscarProduto() {
    const codigo = buscaCodigoProduto.value;
    
    if (!codigo) {
        alert('Digite um código para buscar');
        return;
    }

    get(ref(db, 'Produtos/' + codigo))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const produto = snapshot.val();
                editarNomeProduto.value = produto.nome;
                editarCategoriaProduto.value = produto.categoria || '';
                editarQuantidadeProduto.value = produto.quantidade || '';
                editarValorProduto.value = produto.valor || '';
                
                dadosProduto.style.display = 'block';
            } else {
                alert('Produto não encontrado!');
                dadosProduto.style.display = 'none';
            }
        })
        .catch((error) => {
            console.error('Erro ao buscar:', error);
            alert('Erro ao buscar produto');
        });
}

// Função para atualizar produto
function atualizarProduto() {
    const codigo = buscaCodigoProduto.value;
    
    if (!codigo) {
        alert('Nenhum produto selecionado para atualização');
        return;
    }

    update(ref(db, 'Produtos/' + codigo), {
        nome: editarNomeProduto.value,
        categoria: editarCategoriaProduto.value,
        quantidade: editarQuantidadeProduto.value,
        valor: editarValorProduto.value
    }).then(() => {
        alert('Produto atualizado com sucesso!');
    }).catch((error) => {
        console.error('Erro ao atualizar:', error);
        alert('Erro ao atualizar produto');
    });
}

// Função para excluir produto
function excluirProduto() {
    const codigo = buscaCodigoProduto.value;
    
    if (!codigo) {
        alert('Nenhum produto selecionado para exclusão');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este produto?')) {
        remove(ref(db, 'Produtos/' + codigo))
            .then(() => {
                alert('Produto excluído com sucesso!');
                limparBusca();
            })
            .catch((error) => {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir produto');
            });
    }
}

// Função para limpar busca
function limparBusca() {
    buscaCodigoProduto.value = '';
    editarNomeProduto.value = '';
    editarCategoriaProduto.value = '';
    editarQuantidadeProduto.value = '';
    editarValorProduto.value = '';
    dadosProduto.style.display = 'none';
}

// Event listeners
btnBuscarProduto.addEventListener('click', buscarProduto);
btnAtualizarProduto.addEventListener('click', atualizarProduto);
btnExcluirProduto.addEventListener('click', excluirProduto);
btnLimparBusca.addEventListener('click', limparBusca);
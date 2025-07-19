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
const codigoProduto = document.getElementById('codigoProduto');
const nomeProduto = document.getElementById('nomeProduto');
const categoriaProduto = document.getElementById('categoriaProduto');
const quantidadeProduto = document.getElementById('quantidadeProduto');
const valorProduto = document.getElementById('valorProduto');
const btnCadastrarProduto = document.getElementById('btnCadastrarProduto');
const btnLimparProduto = document.getElementById('btnLimparProduto');

// Função para cadastrar produto
function cadastrarProduto() {
    if (!codigoProduto.value || !nomeProduto.value) {
        alert('Código e Nome são obrigatórios!');
        return;
    }

    get(ref(db, 'Produtos/' + codigoProduto.value))
        .then((snapshot) => {
            if (snapshot.exists()) {
                alert('Já existe um produto com este código!');
            } else {
                set(ref(db, 'Produtos/' + codigoProduto.value), {
                    codigo: codigoProduto.value,
                    nome: nomeProduto.value,
                    categoria: categoriaProduto.value,
                    quantidade: quantidadeProduto.value,
                    valor: valorProduto.value
                }).then(() => {
                    alert('Produto cadastrado com sucesso!');
                    limparFormulario();
                }).catch((error) => {
                    console.error('Erro ao cadastrar:', error);
                    alert('Erro ao cadastrar produto');
                });
            }
        });
}

// Função para limpar formulário
function limparFormulario() {
    codigoProduto.value = '';
    nomeProduto.value = '';
    categoriaProduto.value = '';
    quantidadeProduto.value = '';
    valorProduto.value = '';
}

// Event listeners
btnCadastrarProduto.addEventListener('click', cadastrarProduto);
btnLimparProduto.addEventListener('click', limparFormulario);
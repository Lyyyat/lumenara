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

// Elementos do formulário de cadastro
const cpfCliente = document.getElementById('cpfCliente');
const nomeCliente = document.getElementById('nomeCliente');
const emailCliente = document.getElementById('emailCliente');
const telefoneCliente = document.getElementById('telefoneCliente');
const enderecoCliente = document.getElementById('enderecoCliente');
const cidadeCliente = document.getElementById('cidadeCliente');
const estadoCliente = document.getElementById('estadoCliente');

// Elementos do formulário de gerenciamento
const buscaCpfCliente = document.getElementById('buscaCpfCliente');
const editarNomeCliente = document.getElementById('editarNomeCliente');
const editarEmailCliente = document.getElementById('editarEmailCliente');
const editarTelefoneCliente = document.getElementById('editarTelefoneCliente');
const editarEnderecoCliente = document.getElementById('editarEnderecoCliente');
const editarCidadeCliente = document.getElementById('editarCidadeCliente');
const editarEstadoCliente = document.getElementById('editarEstadoCliente');
const dadosCliente = document.getElementById('dadosCliente');

// Botões
const btnCadastrarCliente = document.getElementById('btnCadastrarCliente');
const btnLimparCliente = document.getElementById('btnLimparCliente');
const btnBuscarCliente = document.getElementById('btnBuscarCliente');
const btnAtualizarCliente = document.getElementById('btnAtualizarCliente');
const btnExcluirCliente = document.getElementById('btnExcluirCliente');

// Função para cadastrar cliente
function cadastrarCliente() {
    // Validação básica
    if (!cpfCliente.value || !nomeCliente.value) {
        alert('CPF e Nome são obrigatórios!');
        return;
    }

    // Verifica se o cliente já existe
    get(ref(db, 'Clientes/' + cpfCliente.value))
        .then((snapshot) => {
            if (snapshot.exists()) {
                alert('Já existe um cliente cadastrado com este CPF!');
                return;
            } else {
                // Cadastra o novo cliente
                set(ref(db, 'Clientes/' + cpfCliente.value), {
                    cpf: cpfCliente.value,
                    nome: nomeCliente.value,
                    email: emailCliente.value,
                    telefone: telefoneCliente.value,
                    endereco: enderecoCliente.value,
                    cidade: cidadeCliente.value,
                    estado: estadoCliente.value
                }).then(() => {
                    alert('Cliente cadastrado com sucesso!');
                    limparFormularioCadastro();
                }).catch((error) => {
                    console.error('Erro ao cadastrar:', error);
                    alert('Erro ao cadastrar cliente');
                });
            }
        });
}

// Função para buscar cliente
function buscarCliente() {
    const cpf = buscaCpfCliente.value;
    
    if (!cpf) {
        alert('Digite um CPF para buscar');
        return;
    }

    get(ref(db, 'Clientes/' + cpf))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const cliente = snapshot.val();
                editarNomeCliente.value = cliente.nome;
                editarEmailCliente.value = cliente.email || '';
                editarTelefoneCliente.value = cliente.telefone || '';
                editarEnderecoCliente.value = cliente.endereco || '';
                editarCidadeCliente.value = cliente.cidade || '';
                editarEstadoCliente.value = cliente.estado || '';
                
                dadosCliente.style.display = 'block';
            } else {
                alert('Cliente não encontrado!');
                dadosCliente.style.display = 'none';
            }
        })
        .catch((error) => {
            console.error('Erro ao buscar:', error);
            alert('Erro ao buscar cliente');
        });
}

// Função para atualizar cliente
function atualizarCliente() {
    const cpf = buscaCpfCliente.value;
    
    if (!cpf) {
        alert('Nenhum cliente selecionado para atualização');
        return;
    }

    update(ref(db, 'Clientes/' + cpf), {
        nome: editarNomeCliente.value,
        email: editarEmailCliente.value,
        telefone: editarTelefoneCliente.value,
        endereco: editarEnderecoCliente.value,
        cidade: editarCidadeCliente.value,
        estado: editarEstadoCliente.value
    }).then(() => {
        alert('Cliente atualizado com sucesso!');
    }).catch((error) => {
        console.error('Erro ao atualizar:', error);
        alert('Erro ao atualizar cliente');
    });
}

// Função para excluir cliente
function excluirCliente() {
    const cpf = buscaCpfCliente.value;
    
    if (!cpf) {
        alert('Nenhum cliente selecionado para exclusão');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        remove(ref(db, 'Clientes/' + cpf))
            .then(() => {
                alert('Cliente excluído com sucesso!');
                limparFormularioGerenciamento();
                dadosCliente.style.display = 'none';
            })
            .catch((error) => {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir cliente');
            });
    }
}

// Funções para limpar formulários
function limparFormularioCadastro() {
    cpfCliente.value = '';
    nomeCliente.value = '';
    emailCliente.value = '';
    telefoneCliente.value = '';
    enderecoCliente.value = '';
    cidadeCliente.value = '';
    estadoCliente.value = '';
}

function limparFormularioGerenciamento() {
    buscaCpfCliente.value = '';
    editarNomeCliente.value = '';
    editarEmailCliente.value = '';
    editarTelefoneCliente.value = '';
    editarEnderecoCliente.value = '';
    editarCidadeCliente.value = '';
    editarEstadoCliente.value = '';
}

// Máscaras para campos
cpfCliente.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
});

buscaCpfCliente.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
});

telefoneCliente.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
});

editarTelefoneCliente.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
});

// Event listeners
btnCadastrarCliente.addEventListener('click', cadastrarCliente);
btnLimparCliente.addEventListener('click', limparFormularioCadastro);
btnBuscarCliente.addEventListener('click', buscarCliente);
btnAtualizarCliente.addEventListener('click', atualizarCliente);
btnExcluirCliente.addEventListener('click', excluirCliente);
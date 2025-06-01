// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBmnU28QAKRvijZcKTIzLhrRNbZDTzdqNM",
    authDomain: "lumenara-3acb5.firebaseapp.com",
    projectId: "lumenara-3acb5",
    storageBucket: "lumenara-3acb5.appspot.com",
    messagingSenderId: "309416608169",
    appId: "1:309416608169:web:571ba528cc32c2f73704b8"
};

// Inicializa Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Variáveis globais
let currentUser = null;
let currentIndex = 0;
let cardsPerPage = 4;
let produtosWrapper, produtoCards;

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initCarrossel();
    carregarProdutos();
    setupEventListeners();
    verificarUsuarioLogado();
    
    // Atualiza quando a janela é redimensionada
    window.addEventListener('resize', function() {
        updateCardsPerPage();
        updateCarrossel();
    });
});

// Inicializa o carrossel
function initCarrossel() {
    produtosWrapper = document.querySelector('.produtos-wrapper');
    produtoCards = document.querySelectorAll('.produto-card');
    updateCardsPerPage();
}

// Define quantos cards mostrar por página
function updateCardsPerPage() {
    const width = window.innerWidth;
    if (width < 480) cardsPerPage = 1;
    else if (width < 768) cardsPerPage = 2;
    else if (width < 1024) cardsPerPage = 3;
    else cardsPerPage = 4;
}

// Atualiza a posição do carrossel
function updateCarrossel() {
    produtoCards = document.querySelectorAll('.produto-card'); // Atualiza a lista de cards
    
    if (produtoCards.length === 0) return;
    
    const cardWidth = produtoCards[0].offsetWidth + 20; // Largura do card + gap
    const translateX = -currentIndex * cardWidth * cardsPerPage;
    produtosWrapper.style.transform = `translateX(${translateX}px)`;
    
    // Atualiza estado dos botões
    document.querySelector('.seta-esquerda').disabled = currentIndex === 0;
    document.querySelector('.seta-direita').disabled = 
        currentIndex >= Math.ceil(produtoCards.length / cardsPerPage) - 1;
}

// Carrega e exibe os produtos
function carregarProdutos() {
    if (!dados || dados.length === 0) {
        console.error('Nenhum dado de produto encontrado');
        return;
    }
    
    produtosWrapper.innerHTML = '';
    
    dados.forEach((produto, index) => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        produtoCard.dataset.index = index;
        
        produtoCard.innerHTML = `
            <img src="${produto.img}" alt="${produto.nome}" class="produto-img">
            <h3 class="produto-nome">${produto.nome}</h3>
            <p class="produto-descricao">${produto.descricao}</p>
            <p class="preco">Preço: R$ 59,90</p>
        `;
        
        produtosWrapper.appendChild(produtoCard);
        
        // Adiciona evento de clique na imagem
        produtoCard.querySelector('.produto-img').addEventListener('click', () => {
            abrirPopup(produto);
        });
    });
    
    // Atualiza a lista de cards após carregar
    produtoCards = document.querySelectorAll('.produto-card');
    updateCarrossel();
}

// Configura os event listeners
function setupEventListeners() {
    // Navegação do carrossel
    document.querySelector('.seta-esquerda').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarrossel();
        }
    });
    
    document.querySelector('.seta-direita').addEventListener('click', () => {
        if (currentIndex < Math.ceil(produtoCards.length / cardsPerPage) - 1) {
            currentIndex++;
            updateCarrossel();
        }
    });
    
    // Popup
    document.querySelector('.close-popup').addEventListener('click', fecharPopup);
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('produto-popup')) {
            fecharPopup();
        }
    });
    
    // Logout
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut()
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    console.error('Erro ao fazer logout:', error);
                });
        });
    }
    
    // Pesquisa
    const btnPesquisar = document.querySelector('button[onclick="pesquisar()"]');
    const campoPesquisa = document.getElementById('campo-pesquisa');
    
    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', pesquisar);
    }
    if (campoPesquisa) {
        campoPesquisa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                pesquisar();
            }
        });
    }
}

// Função para abrir o popup
function abrirPopup(produto) {
    const popup = document.getElementById('produto-popup');
    document.getElementById('popup-img').src = produto.img;
    document.getElementById('popup-nome').textContent = produto.nome;
    document.getElementById('popup-descricao').textContent = produto.descricao;
    document.getElementById('popup-link').href = produto.link;
    
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para fechar o popup
function fecharPopup() {
    document.getElementById('produto-popup').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função de pesquisa
function pesquisar() {
    const termo = document.getElementById('campo-pesquisa').value.toLowerCase();
    if (!termo.trim()) {
        carregarProdutos();
        return;
    }
    
    const resultados = dados.filter(produto => 
        produto.nome.toLowerCase().includes(termo) || 
        produto.descricao.toLowerCase().includes(termo)
    );
    
    if (resultados.length === 0) {
        produtosWrapper.innerHTML = '<p class="sem-resultados">Nenhum produto encontrado</p>';
        document.querySelector('.seta-esquerda').disabled = true;
        document.querySelector('.seta-direita').disabled = true;
        return;
    }
    
    // Atualiza temporariamente com os resultados
    const dadosOriginais = [...dados];
    dados = resultados;
    currentIndex = 0;
    carregarProdutos();
    dados = dadosOriginais;
}

// Verifica e atualiza o estado do usuário
function verificarUsuarioLogado() {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        updateHeaderUI(user);
        
        if (user) {
            console.log('Usuário logado:', user.email);
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        } else {
            console.log('Nenhum usuário logado');
        }
    });
}

// Atualiza a interface com o estado do usuário
function updateHeaderUI(user) {
    const headerBox = document.querySelector('.header-box');
    const siteLogo = document.querySelector('.site-logo');
    const userAvatar = document.querySelector('.user-avatar');
    const userGreeting = document.querySelector('.user-greeting');
    const loginButton = document.querySelector('.login');
    const logoutButton = document.querySelector('.logout');
    
    if (!headerBox || !siteLogo || !userAvatar || !userGreeting || !loginButton || !logoutButton) {
        console.error('Elementos do header não encontrados');
        return;
    }
    
    if (user) {
        // Usuário logado
        headerBox.classList.add('user-logged-in');
        
        // Avatar com primeira letra do email
        const username = user.email.split('@')[0];
        userAvatar.textContent = username.charAt(0).toUpperCase();
        userGreeting.textContent = `Olá, ${username}`;
        
        siteLogo.style.display = 'none';
        userAvatar.style.display = 'flex';
        userGreeting.style.display = 'block';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        // Usuário não logado
        headerBox.classList.remove('user-logged-in');
        
        siteLogo.style.display = 'block';
        userAvatar.style.display = 'none';
        userGreeting.style.display = 'none';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
}
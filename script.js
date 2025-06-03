const firebaseConfig = {
    apiKey: "AIzaSyBmnU28QAKRvijZcKTIzLhrRNbZDTzdqNM",
    authDomain: "lumenara-3acb5.firebaseapp.com",
    projectId: "lumenara-3acb5",
    storageBucket: "lumenara-3acb5.appspot.com",
    messagingSenderId: "309416608169",
    appId: "1:309416608169:web:571ba528cc32c2f73704b8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let currentUser = null;
let currentIndex = 0;
let cardsPerPage = 4;
let produtosWrapper, produtoCards;

document.addEventListener('DOMContentLoaded', function() {
    initCarrossel();
    carregarProdutos();
    setupEventListeners();
    verificarUsuarioLogado();
    a
    window.addEventListener('resize', function() {
        updateCardsPerPage();
        updateCarrossel();
    });
});

function initCarrossel() {
    produtosWrapper = document.querySelector('.produtos-wrapper');
    produtoCards = document.querySelectorAll('.produto-card');
    updateCardsPerPage();
}

function updateCardsPerPage() {
    const width = window.innerWidth;
    if (width < 480) cardsPerPage = 1;
    else if (width < 768) cardsPerPage = 2;
    else if (width < 1024) cardsPerPage = 3;
    else cardsPerPage = 4;
}

function updateCarrossel() {
    produtoCards = document.querySelectorAll('.produto-card');
    
    if (produtoCards.length === 0) return;
    
    const cardWidth = produtoCards[0].offsetWidth + 20;
    const translateX = -currentIndex * cardWidth * cardsPerPage;
    produtosWrapper.style.transform = `translateX(${translateX}px)`;
    
    document.querySelector('.seta-esquerda').disabled = currentIndex === 0;
    document.querySelector('.seta-direita').disabled = 
        currentIndex >= Math.ceil(produtoCards.length / cardsPerPage) - 1;
    
    produtoCards.forEach(card => {
        card.style.height = '100%';
    });
}

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
            <div class="produto-card-content">
                <img src="${produto.img}" alt="${produto.nome}" class="produto-img">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-descricao">${produto.descricao}</p>
                <div class="produto-footer">
                    <p class="preco">Preço: R$ 99,90</p>
                    <button class="btn-comprar">Comprar</button>
                </div>
            </div>
        `;
        
        produtosWrapper.appendChild(produtoCard);
        
        produtoCard.querySelector('.btn-comprar').addEventListener('click', () => {
            adicionarAoCarrinho(produto);
        });
    });
    
    produtoCards = document.querySelectorAll('.produto-card');
    updateCarrossel();
}


function adicionarAoCarrinho(produto) {
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = `"${produto.nome}" adicionado ao carrinho!`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
    
}

function setupEventListeners() {
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
    
    const dadosOriginais = [...dados];
    dados = resultados;
    currentIndex = 0;
    carregarProdutos();
    dados = dadosOriginais;
}

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

function filtrarPorCategoria(categoria) {
    if (categoria === "Todos") {
        carregarProdutos();
        return;
    }

    const produtosFiltrados = dados.filter(produto => 
        produto.categoria === categoria
    );

    if (produtosFiltrados.length === 0) {
        produtosWrapper.innerHTML = '<p class="sem-resultados">Nenhum produto encontrado nesta categoria</p>';
    } else {
        const dadosOriginais = [...dados];
        dados = produtosFiltrados;
        currentIndex = 0;
        carregarProdutos();
        dados = dadosOriginais;
    }
}


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
    
    if (user) {o
        headerBox.classList.add('user-logged-in');

        const username = user.email.split('@')[0];
        userAvatar.textContent = username.charAt(0).toUpperCase();
        userGreeting.textContent = `Olá, ${username}`;
        
        siteLogo.style.display = 'none';
        userAvatar.style.display = 'flex';
        userGreeting.style.display = 'block';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        headerBox.classList.remove('user-logged-in');
        
        siteLogo.style.display = 'block';
        userAvatar.style.display = 'none';
        userGreeting.style.display = 'none';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
}
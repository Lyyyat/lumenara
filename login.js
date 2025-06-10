const firebaseConfig = {
    apiKey: "AIzaSyBmnU28QAKRvijZcKTIzLhrRNbZDTzdqNM",
    authDomain: "lumenara-3acb5.firebaseapp.com",
    projectId: "lumenara-3acb5",
    storageBucket: "lumenara-3acb5.appspot.com",
    messagingSenderId: "309416608169",
    appId: "1:309416608169:web:571ba528cc32c2f73704b8"
};

console.log("Firebase apps:", firebase.apps);

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); 
}

const auth = firebase.auth();

console.log("Auth object:", auth);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const recoverButton = document.getElementById("recover-password-button");
const signupButton = document.getElementById("signup-button");

console.log("Elementos:", {
    emailInput,
    passwordInput,
    loginButton,
    recoverButton,
    signupButton
});

function validacao() {
    const email = emailInput.value;
    const senha = passwordInput.value;

    const habilita = email.length > 5 && senha.length > 5;
    loginButton.disabled = !habilita;
    recoverButton.disabled = email.length <= 5;
    
    console.log("Validação:", {email, senha, habilita});
}

loginButton.addEventListener("click", () => {
    const email = emailInput.value;
    const senha = passwordInput.value;
    
    console.log("Tentando login com:", {email, senha});

    auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            console.log("Login bem-sucedido:", userCredential.user);
            window.location.href = "index.html?login=success";
        })
        .catch(error => {
            console.error("Erro no login:", error);
            alert("Erro ao fazer login:\n" + error.message);
        });
});

recoverButton.addEventListener("click", () => {
    const email = emailInput.value;
    console.log("Tentando recuperar senha para:", email);
    
    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Email de recuperação enviado para " + email);
        })
        .catch(error => {
            console.error("Erro ao recuperar senha:", error);
            alert("Erro ao recuperar senha:\n" + error.message);
        });
});

signupButton.addEventListener("click", function() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    console.log("Tentando cadastrar:", {email, password});

    if (!email || !password) {
        alert("Por favor, preencha e-mail e senha.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Cadastro bem-sucedido:", userCredential.user);
            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Erro no cadastro:", error);
            alert("Erro ao cadastrar:\n" + error.message);
        });
});

emailInput.addEventListener("input", validacao);
passwordInput.addEventListener("input", validacao);
validacao(); 

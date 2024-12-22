import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// Obter o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configurar middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'segredo_super_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 30 } // Sessão válida por 30 minutos
}));

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota para exibir a página de login
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Processar login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = true;
        const dataHoraAtual = new Date().toLocaleString();
        res.cookie('ultimoAcesso', dataHoraAtual, { maxAge: 1000 * 60 * 60 * 24 }); // Cookie válido por 1 dia
        res.redirect('/');
    } else {
        res.send('<h1>Usuário ou senha inválidos! <a href="/login.html">Tente novamente</a></h1>');
    }
});

// Middleware para verificar autenticação
function verificarAutenticacao(req, res, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Página principal após login
app.get('/', verificarAutenticacao, (req, res) => {
    const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeira vez acessando!';
    const dataHoraAtual = new Date().toLocaleString();

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo!</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f0f8ff;
                    color: #333;
                }
                .container {
                    text-align: center;
                }
                .message {
                    margin-top: 20px;
                    background-color: #0077ff;
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    animation: fadeIn 2s ease-in-out infinite alternate;
                }
                .timestamp {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #fff;
                    padding: 5px 10px;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                @keyframes fadeIn {
                    0% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Bem-vindo de volta!</h1>
                <p>Seu último acesso foi em: ${ultimoAcesso}</p>
                <div class="message">Lembre-se de beber água regularmente!</div>
            </div>
            <div class="timestamp">Agora: ${dataHoraAtual}</div>
            <script>
                setInterval(() => {
                    const now = new Date().toLocaleString();
                    document.querySelector('.timestamp').innerText = 'Agora: ' + now;
                }, 1000);
            </script>
        </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
const port = 3000;

// Caminho para os arquivos estáticos
const publicPath = path.join(process.cwd(), 'pages', 'public');
app.use(express.static(publicPath));

// Middleware para sessões e cookies
app.use(cookieParser());
app.use(
    session({
        secret: 'M1nh4Chav3S3cr3t4',
        resave: false,
        saveUninitialized: true,
    })
);

// Início do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


// Middleware de autenticação
function verificarAutenticacao(req, res, next) {
  if (req.session.usuarioLogado) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

// Rota para autenticação
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === '123') {
    req.session.usuarioLogado = true;
    res.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
      httpOnly: true,
    });
    res.redirect('/');
  } else {
    res.send('<h1>Usuário ou senha inválidos!</h1>');
  }
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// Página inicial protegida
app.get('/', verificarAutenticacao, (req, res) => {
  const ultimoAcesso = req.cookies['dataHoraUltimoLogin'] || 'N/A';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Beber Água</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <header>
        <h1>Bem-vindo!</h1>
        <p>Último acesso: ${ultimoAcesso}</p>
      </header>
      <main>
        <div id="mensagem">Hora de beber água!</div>
      </main>
      <script src="/script.js"></script>
    </body>
    </html>
  `);
});

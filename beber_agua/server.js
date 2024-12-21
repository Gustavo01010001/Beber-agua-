const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Configurações do Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuração da sessão
app.use(
  session({
    secret: 'segredo-super-seguro', // Troque por um segredo seguro
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 dia
  })
);

// Rota inicial
app.get('/', (req, res) => {
  // Registra o horário do último acesso
  if (!req.session.lastAccess) {
    req.session.lastAccess = new Date().toLocaleString();
  }

  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Obter informações do último acesso
app.get('/last-access', (req, res) => {
  res.json({ lastAccess: req.session.lastAccess });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

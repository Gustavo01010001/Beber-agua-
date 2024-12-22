const mensagens = [
  "Hora de beber água!",
  "Que tal um copo d'água agora?",
  "Lembre-se: hidratação é saúde!",
  "Seu corpo agradece por beber água.",
];

function mostrarMensagem() {
  const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
  const elemento = document.getElementById("mensagem");
  elemento.textContent = mensagem;
}

const publicPath = path.join(__dirname, 'pages', 'public');
app.use(express.static(publicPath));

setInterval(mostrarMensagem, 5000); // Atualiza a cada 5 segundos

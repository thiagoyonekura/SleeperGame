// Cores disponíveis (lista)
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray'];

// Cores traduzidas (lista)
const cores = ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO', 'ROXO', 'LARANJA', 'ROSA', 'MARROM', 'CINZA'];

//  Declaração das variáveis do jogo (armazenar informações sobre o jogo)
let level = 1; // Nível atual do jogo
let score = 0; // Pontuação do jogador
let targetColor; // Cor alvo atual
let targetWord; // Palavra alvo atual
let buttons; // Cores dos botões
let timer; // Temporizador do jogo

// Função para embaralhar um array. A função shuffle é uma função auxiliar para embaralhar um array.
//  Ela utiliza o algoritmo Fisher-Yates para realizar o embaralhamento.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para iniciar o jogo
// A função startGame é responsável por iniciar o jogo. Ela reinicia a pontuação e o nível,
// atualiza as informações na tela, gera a cor alvo e a palavra alvo, gera os botões das cores,
//  limpa a mensagem na tela, reseta os eventos de clique dos botões e inicia o temporizador com 3 segundos.
function startGame() {
  score = 0; // Pontuação
  level = 1; // Nível
  updateLevel(); // Atualiza o nível na tela
  updateScore(); // Atualiza a pontuação na tela
  generateTarget(); // Gera a cor alvo e a palavra alvo
  generateButtons(); // Gera os botões das cores
  showMessage(''); // Limpa a mensagem na tela
  resetButtonEvents(); // Reseta os eventos de clique dos botões
  startTimer(3000); // Inicia o temporizador com 3 segundos
}

// Função para atualizar o nível na tela
function updateLevel() {
  document.getElementById('level').textContent = `Nível: ${level}`;
}

// Função para atualizar a pontuação na tela
function updateScore() {
  document.getElementById('score').textContent = `Pontuação: ${score}`;
}

// Função para exibir uma mensagem na tela
function showMessage(message) {
  document.getElementById('message').textContent = message;
}

// Função para selecionar aleatoriamente o alvo (cor e palavra)
// A função generateTarget seleciona aleatoriamente a cor alvo e a palavra alvo.
// Ela utiliza índices aleatórios para obter as cores e palavras correspondentes nas listas colors e cores,
// e em seguida atualiza o texto e a cor do elemento HTML que exibe a palavra alvo na tela.
function generateTarget() {
  const colorIndex = Math.floor(Math.random() * colors.length);
  const wordIndex = Math.floor(Math.random() * cores.length);
  targetColor = colors[colorIndex];
  targetWord = cores[wordIndex];
  document.getElementById('target').textContent = targetWord;
  document.getElementById('target').style.color = targetColor;
}

// Função para gerar os botões das cores
// A função generateButtons gera os botões das cores. Ela embaralha as cores disponíveis,
// define a cor de fundo dos botões de acordo com as cores embaralhadas e habilita os botões.
function generateButtons() {
  buttons = shuffle(colors.slice());
  const colorButtons = document.querySelectorAll('#buttons button:not(.ignore-button)');
  for (let i = 0; i < colorButtons.length; i++) {
    const button = colorButtons[i];
    button.style.backgroundColor = buttons[i];
    button.disabled = false; // Habilita os botões
  }
}

// Função para resetar os eventos de clique dos botões
// A função resetButtonEvents reseta os eventos de clique dos botões.
// Ela remove os event listeners existentes e adiciona um novo event listener para cada botão, associando-os à função checkAnswer.
function resetButtonEvents() {
  const colorButtons = document.querySelectorAll('#buttons button:not(.ignore-button)');
  colorButtons.forEach(button => {
    button.removeEventListener('click', checkAnswer);
    button.addEventListener('click', checkAnswer);
  });
}

// Função para verificar a resposta do jogador
// A função checkAnswer é responsável por verificar a resposta do jogador.
// Ela é acionada quando um botão é clicado. A função compara a cor selecionada pelo jogador com a cor alvo.
// Se forem iguais, a pontuação é incrementada, o nível é atualizado e são gerados novos alvos e botões.
// O tempo do temporizador também é ajustado de acordo com o nível. Se a resposta estiver incorreta, a função chama endGame para encerrar o jogo.
function checkAnswer(event) {
  clearTimeout(timer);
  const selectedColor = event.target.style.backgroundColor;
  if (selectedColor === targetColor) { // Verifica se a cor selecionada é a cor alvo
    score++; // Incrementa a pontuação
    updateScore(); // Atualiza a pontuação na tela
    if (score % 10 === 0) { // Verifica se a pontuação é um múltiplo de 10
      level++; // Incrementa o nível
      updateLevel(); // Atualiza o nível na tela
      if (level > 6) { // Verifica se o jogador concluiu todos os níveis
        showMessage('Parabéns! Você concluiu todos os níveis!');
        return;
      }
    }
    generateTarget(); // Gera um novo alvo
    generateButtons(); // Gera novos botões das cores
    showMessage(''); // Limpa a mensagem na tela
    let time = 3000; // Tempo inicial de 3 segundos
    if (level === 2) {
      time = 2000; // Tempo de 2 segundos no nível 2
    } else if (level === 3) {
      time = 2000; // Tempo de 2 segundos no nível 3
      shuffle(buttons); // Embaralha as cores dos botões
      generateButtons(); // Gera novos botões das cores
    } else if (level === 4 || level === 5) {
      time = 2000 - (level - 3) * 300; // Tempo diminui em 300ms a cada nível a partir do nível 4
      shuffle(buttons); // Embaralha as cores dos botões
      generateButtons(); // Gera novos botões das cores
    } else if (level === 6) {
      time = 1000; // Tempo de 1 segundo no nível 6
      shuffle(buttons); // Embaralha as cores dos botões
      generateButtons(); // Gera novos botões das cores
    }
    startTimer(time); // Reinicia o temporizador com o novo tempo
  } else {
    endGame(); // Encerra o jogo se a resposta estiver incorreta
  }
}

// Função para iniciar o temporizador
// A função startTimer inicia o temporizador do jogo. Ela recebe um tempo em milissegundos como parâmetro e atualiza
// o elemento HTML que exibe o tempo restante a cada 10 milissegundos. Quando o tempo acaba, a função chama endGame para encerrar o jogo.
function startTimer(time) {
  let totalMilliseconds = time;
  let minutes = Math.floor(totalMilliseconds / 60000);
  let seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  let milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

  let timerElement = document.getElementById('timer');
  timerElement.textContent = `Tempo restante: ${formatTime(minutes)}:${formatTime(seconds)}.${formatTime(milliseconds)}`;

  timer = setInterval(function () {
    totalMilliseconds -= 10; // Decrementa 10 milissegundos
    minutes = Math.floor(totalMilliseconds / 60000);
    seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

    timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}.${formatTime(milliseconds)}`;

    if (totalMilliseconds <= 0) { // Verifica se o tempo acabou
      clearInterval(timer);
      endGame(); // Encerra o jogo
    }
  }, 10);

  // Função auxiliar para formatar os números com dois dígitos
  // A função formatTime é uma função auxiliar usada para formatar os números de minutos, segundos e milissegundos com dois dígitos.
  function formatTime(time) {
    return time.toString().padStart(2, '0');
  }
}

// Função para encerrar o jogo
// Ela exibe a pontuação do jogador e desabilita os botões para evitar cliques adicionais.
function endGame() {
  showMessage('OOOOOOOPS! Você fez ' + score + ' pontos.');
  const colorButtons = document.querySelectorAll('#buttons button:not(.ignore-button)');
  colorButtons.forEach(button => {
    button.disabled = true; // Desabilita os botões para impedir cliques adicionais
  });
}

// Adiciona o evento de clique ao botão "Iniciar Jogo"
document.querySelector('.start-button').addEventListener('click', startGame);
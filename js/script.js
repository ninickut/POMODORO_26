/* ==========================
       ESTADO GLOBAL
========================== */
const state = {
  pomodoro: {
    modo: 'pomodoro',      // 'pomodoro', 'descansoCurto', 'descansoLongo'
    tempoRestante: 25 * 60, 
    rodando: false,
    intervaloId: null,     // armazenar setInterval
  },
  tarefas: [],             // { id, texto, feito }
};

/* ==========================
       SELETORES DO DOM
========================== */
const dom = {
  pomodoro: {
    display: document.getElementById('tempo-pomodoro'),
    btnIniciar: document.getElementById('btn-iniciar'),
    btnPausar: document.getElementById('btn-pausar'),
    btnReset: document.getElementById('btn-reset'),
    btnPomodoro: document.getElementById('modo-pomodoro'),
    btnDescansoCurto: document.getElementById('modo-descanso-curto'),
    btnDescansoLongo: document.getElementById('modo-descanso-longo'),
  },
  tarefas: {
    form: document.getElementById('todo-form'),
    input: document.getElementById('todo-input'),
    lista: document.getElementById('todo-list'),
  },
};

/* ==========================
       FUNÇÕES UTILITÁRIAS
========================== */
// Formata segundos para MM:SS
function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Atualiza display do timer
function atualizarDisplay() {
  dom.pomodoro.display.textContent = formatarTempo(state.pomodoro.tempoRestante);
}

// Gera ID único para tarefas
function gerarId() {
  return Date.now().toString();
}

/* ==========================
          POMODORO
========================== */
function iniciarTimer() {
  if (!state.pomodoro.rodando) {
    state.pomodoro.rodando = true;
    state.pomodoro.intervaloId = setInterval(() => {
      if (state.pomodoro.tempoRestante > 0) {
        state.pomodoro.tempoRestante--;
        atualizarDisplay();
      } else {
        clearInterval(state.pomodoro.intervaloId);
        state.pomodoro.rodando = false;
        alert('Tempo acabou!');
      }
    }, 1000);
  }
}

function pausarTimer() {
  if (state.pomodoro.rodando) {
    clearInterval(state.pomodoro.intervaloId);
    state.pomodoro.rodando = false;
  }
}

function resetarTimer() {
  switch (state.pomodoro.modo) {
    case 'pomodoro':
      state.pomodoro.tempoRestante = 25 * 60;
      break;
    case 'descansoCurto':
      state.pomodoro.tempoRestante = 5 * 60;
      break;
    case 'descansoLongo':
      state.pomodoro.tempoRestante = 15 * 60;
      break;
  }
  clearInterval(state.pomodoro.intervaloId);
  state.pomodoro.rodando = false;
  atualizarDisplay();
}

function mudarModo(novoModo) {
  state.pomodoro.modo = novoModo;
  resetarTimer();
  // Atualiza botão ativo
  const botoes = [dom.pomodoro.btnPomodoro, dom.pomodoro.btnDescansoCurto, dom.pomodoro.btnDescansoLongo];
  botoes.forEach(btn => btn.classList.remove('active'));
  switch (novoModo) {
    case 'pomodoro': dom.pomodoro.btnPomodoro.classList.add('active'); break;
    case 'descansoCurto': dom.pomodoro.btnDescansoCurto.classList.add('active'); break;
    case 'descansoLongo': dom.pomodoro.btnDescansoLongo.classList.add('active'); break;
  }
}

/* ==========================
         TO-DO LIST
========================== */
function adicionarTarefa(texto) {
  const tarefa = {
    id: gerarId(),
    texto,
    feito: false,
  };
  state.tarefas.push(tarefa);
  renderizarTarefas();
}

function removerTarefa(id) {
  state.tarefas = state.tarefas.filter(t => t.id !== id);
  renderizarTarefas();
}

function alternarTarefa(id) {
  const tarefa = state.tarefas.find(t => t.id === id);
  if (tarefa) tarefa.feito = !tarefa.feito;
  renderizarTarefas();
}

function renderizarTarefas() {
  dom.tarefas.lista.innerHTML = '';
  state.tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.textContent = tarefa.texto;
    li.className = tarefa.feito ? 'feito' : '';
    li.addEventListener('click', () => alternarTarefa(tarefa.id));

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'X';
    btnRemover.addEventListener('click', e => {
      e.stopPropagation(); // não dispara alternar
      removerTarefa(tarefa.id);
    });

    li.appendChild(btnRemover);
    dom.tarefas.lista.appendChild(li);
  });
}

/* ==========================
       EVENT LISTENERS
========================== */
// Pomodoro
dom.pomodoro.btnIniciar.addEventListener('click', iniciarTimer);
dom.pomodoro.btnPausar.addEventListener('click', pausarTimer);
dom.pomodoro.btnReset.addEventListener('click', resetarTimer);

dom.pomodoro.btnPomodoro.addEventListener('click', () => mudarModo('pomodoro'));
dom.pomodoro.btnDescansoCurto.addEventListener('click', () => mudarModo('descansoCurto'));
dom.pomodoro.btnDescansoLongo.addEventListener('click', () => mudarModo('descansoLongo'));

// To-Do List
dom.tarefas.form.addEventListener('submit', e => {
  e.preventDefault();
  const texto = dom.tarefas.input.value.trim();
  if (texto) {
    adicionarTarefa(texto);
    dom.tarefas.input.value = '';
  }
});

// Inicializa display
atualizarDisplay();

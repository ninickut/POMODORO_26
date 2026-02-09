document.addEventListener('DOMContentLoaded', () => {
  console.log('App iniciado');

   const state = {
    pomodoro: {
      modo: 'pomodoro', // 'pomodoro', 'descansoCurto', 'descansoLongo'
      tempoRestante: 25 * 60, // em segundos
      rodando: false,
    },
    tarefas: [], // cada tarefa: { id, texto, feito }
  };

  console.log(state);
  
});

const screens = document.querySelectorAll('.screen');
const cuttingSound = new Audio('Newsimgs/freesound_community-cutting-strawberries-35085.mp3');
const folcloreMusic = new Audio('Newsimgs/Folclore.mp3');
folcloreMusic.loop = true;
const winSong = new Audio('Newsimgs/winsong.mp3');
const gameOverSound = new Audio('Newsimgs/gameover.mp3');
const sugarSound = new Audio('Newsimgs/azucar.mp3');
const gameTimer = document.getElementById('game-timer');
const congratulationsDialog = document.getElementById('congratulations-dialog');
let erroresIngredientes = 0;
let maxErroresIngredientes = 3;
let gameTimerDeadline = 0;
let gameTimerInterval = null;
let azucarearAdvanceTimer = null;
let sugarSoundTimer = null;
let congratulationsDialogTimer = null;
const ingredientesRequeridos = new Set(
  document.querySelectorAll('#ingredientes-screen .ingrediente[data-requerido="true"]')
);
const ingredientesSinfRequeridos = new Set(
  document.querySelectorAll('#ingredientes-sinf-screen .ingrediente[data-requerido="true"]')
);
const ingredientesServirRequeridos = new Set(
  document.querySelectorAll('#soloaguayvaso .ingrediente')
);
const ingredientesSeleccionados = new Set();
const ingredientesSinfSeleccionados = new Set();
const ingredientesServirSeleccionados = new Set();
const licuarFrames = [
  'Newsimgs/Lic1.jpg.jpeg',
  'Newsimgs/Lic2.jpg.jpeg',
  'Newsimgs/Lic3.jpg.jpeg',
  'Newsimgs/Lic4.jpg.jpeg',
  'Newsimgs/Lic5.jpg.jpeg'
];
const servirFrames = [
  'Newsimgs/Vaso1.jpg.jpeg',
  'Newsimgs/Vaso2.jpg.jpeg',
  'Newsimgs/Vaso3.jpg.jpeg',
  'Newsimgs/Vaso4.jpg.jpeg'
];
const blenderSound = new Audio('Newsimgs/blender.mp3');
blenderSound.preload = 'auto';
const iceSound = new Audio('Newsimgs/ice.mp3');
const wineSound = new Audio('Newsimgs/wine.mp3');
let licuarAnimationTimer = null;
let servirAnimationTimer = null;
let folcloreGestureListener = null;

licuarFrames.slice(1).forEach((frameSource) => {
  const frame = new Image();
  frame.src = frameSource;
});

servirFrames.slice(1).forEach((frameSource) => {
  const frame = new Image();
  frame.src = frameSource;
});

function stopLicuarAnimation() {
  window.clearInterval(licuarAnimationTimer);
  licuarAnimationTimer = null;
  blenderSound.pause();
  blenderSound.currentTime = 0;
}

function stopServirAnimation() {
  window.clearInterval(servirAnimationTimer);
  servirAnimationTimer = null;
  iceSound.pause();
  iceSound.currentTime = 0;
  wineSound.pause();
  wineSound.currentTime = 0;
}

function startServirAnimation() {
  stopServirAnimation();

  const servirFrame = document.getElementById('servir-frame');
  let frameIndex = 0;
  servirFrame.src = servirFrames[frameIndex];

  iceSound.play().catch((error) => {
    console.error('No se pudo reproducir el sonido de hielo.', error);
  });

  servirAnimationTimer = window.setInterval(() => {
    frameIndex += 1;
    if (frameIndex >= servirFrames.length) {
      stopServirAnimation();
      showScreen('ganaste-screen');
      return;
    }

    servirFrame.src = servirFrames[frameIndex];
  }, 600);
}

iceSound.addEventListener('ended', () => {
  if (!document.getElementById('servir').classList.contains('active')) {
    return;
  }

  wineSound.currentTime = 0;
  wineSound.play().catch((error) => {
    console.error('No se pudo reproducir el sonido de vino.', error);
  });
});

function stopGameTimer() {
  window.clearInterval(gameTimerInterval);
  gameTimerInterval = null;
}

function stopFolcloreMusic() {
  if (folcloreGestureListener) {
    document.removeEventListener('pointerdown', folcloreGestureListener);
    document.removeEventListener('keydown', folcloreGestureListener);
    folcloreGestureListener = null;
  }

  folcloreMusic.pause();
  folcloreMusic.currentTime = 0;
}

function startFolcloreMusic() {
  if (!folcloreMusic.paused) {
    return;
  }

  folcloreMusic.play().catch((error) => {
    if (error.name === 'NotAllowedError') {
      if (!folcloreGestureListener) {
        folcloreGestureListener = () => {
          document.removeEventListener('pointerdown', folcloreGestureListener);
          document.removeEventListener('keydown', folcloreGestureListener);
          folcloreGestureListener = null;
          startFolcloreMusic();
        };
        document.addEventListener('pointerdown', folcloreGestureListener, { once: true });
        document.addEventListener('keydown', folcloreGestureListener, { once: true });
      }
      return;
    }

    console.error('No se pudo reproducir la música de fondo.', error);
  });
}

function stopWinSong() {
  winSong.pause();
  winSong.currentTime = 0;
}

function stopGameOverSound() {
  gameOverSound.pause();
  gameOverSound.currentTime = 0;
}

function stopSugarSound() {
  sugarSound.pause();
  sugarSound.currentTime = 0;
}

function updateGameTimer() {
  const secondsRemaining = Math.max(0, Math.ceil((gameTimerDeadline - Date.now()) / 1000));
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  gameTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (secondsRemaining === 0) {
    stopGameTimer();
    showScreen('perdiste-screen');
  }
}

function startGameTimer(durationSeconds) {
  stopGameTimer();
  gameTimer.hidden = false;
  gameTimerDeadline = Date.now() + durationSeconds * 1000;
  updateGameTimer();
  gameTimerInterval = window.setInterval(updateGameTimer, 250);
}

function startLicuarAnimation() {
  stopLicuarAnimation();

  const licuarFrame = document.getElementById('licuar-frame');
  let frameIndex = 0;
  licuarFrame.src = licuarFrames[frameIndex];

  blenderSound.play().catch(() => {});

  const frameDuration = Number.isFinite(blenderSound.duration) && blenderSound.duration > 0
    ? (blenderSound.duration * 1000) / licuarFrames.length
    : 600;

  licuarAnimationTimer = window.setInterval(() => {
    if (!document.getElementById('licuar').classList.contains('active')) {
      stopLicuarAnimation();
      return;
    }

    frameIndex += 1;
    if (frameIndex >= licuarFrames.length) {
      window.clearInterval(licuarAnimationTimer);
      licuarAnimationTimer = null;
      showScreen('ingredientes-sinlic-screen');
      return;
    }

    licuarFrame.src = licuarFrames[frameIndex];
  }, frameDuration);
}

function showScreen(screenId) {
  window.clearTimeout(azucarearAdvanceTimer);
  azucarearAdvanceTimer = null;
  window.clearTimeout(sugarSoundTimer);
  sugarSoundTimer = null;
  stopSugarSound();
  window.clearTimeout(congratulationsDialogTimer);
  congratulationsDialogTimer = null;
  stopServirAnimation();

  if (screenId !== 'ganaste-screen') {
    stopWinSong();
  }

  if (screenId !== 'perdiste-screen') {
    stopGameOverSound();
  }

  if (screenId !== 'ganaste-screen' && congratulationsDialog.open) {
    congratulationsDialog.close();
  }

  if (screenId === 'menu-screen') {
    stopGameTimer();
    startFolcloreMusic();
    gameTimerDeadline = 0;
    gameTimer.textContent = '03:00';
    gameTimer.hidden = true;
    erroresIngredientes = 0;
    ingredientesSeleccionados.clear();
    ingredientesSinfSeleccionados.clear();
    ingredientesServirSeleccionados.clear();
    [...ingredientesRequeridos, ...ingredientesSinfRequeridos, ...ingredientesServirRequeridos].forEach((ingrediente) => {
      ingrediente.classList.remove('seleccionado');
    });
  }

  if (screenId === 'perdiste-screen' || screenId === 'ganaste-screen') {
    stopGameTimer();
    stopFolcloreMusic();
  }

  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', '#' + screenId);
  }

  if (screenId === 'cortar-frutillas') {
    cuttingSound.currentTime = 0;
    cuttingSound.play().catch(() => {
      if (document.getElementById('cortar-frutillas').classList.contains('active')) {
        showScreen('ingredientes-sinf-screen');
      }
    });
  }

  if (screenId === 'licuar') {
    startLicuarAnimation();
  } else {
    stopLicuarAnimation();
  }

  if (screenId === 'servir') {
    startServirAnimation();
  }

  if (screenId === 'azucarear') {
    sugarSoundTimer = window.setTimeout(() => {
      if (document.getElementById('azucarear').classList.contains('active')) {
        sugarSound.play().catch((error) => {
          console.error('No se pudo reproducir el sonido del azúcar.', error);
        });
      }
    }, 1000);

    azucarearAdvanceTimer = window.setTimeout(() => {
      if (document.getElementById('azucarear').classList.contains('active')) {
        showScreen('soloaguayvaso');
      }
    }, 3000);
  }

  if (screenId === 'ganaste-screen') {
    winSong.currentTime = 0;
    winSong.play().catch((error) => {
      console.error('No se pudo reproducir la música de victoria.', error);
    });
    congratulationsDialogTimer = window.setTimeout(() => {
      if (document.getElementById('ganaste-screen').classList.contains('active')) {
        congratulationsDialog.showModal();
      }
    }, 5000);
  }

  if (screenId === 'perdiste-screen') {
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch((error) => {
      console.error('No se pudo reproducir el sonido de derrota.', error);
    });
  }
}

cuttingSound.addEventListener('ended', () => {
  if (document.getElementById('cortar-frutillas').classList.contains('active')) {
    showScreen('ingredientes-sinf-screen');
  }
});

function initFromHash() {
  const hash = window.location.hash.replace('#', '');
  const validScreen = Array.from(screens).some((screen) => screen.id === hash);

  if (validScreen) {
    showScreen(hash);
  } else {
    showScreen('menu-screen');
  }
}

document.querySelectorAll('button[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    showScreen(button.dataset.target);
  });
});

window.addEventListener('hashchange', initFromHash);
showScreen('intro-screen');
window.setTimeout(() => showScreen('menu-screen'), 3000);

const recipeHelp = document.getElementById('recipe-help');
const comenzar = document.getElementById('comenzar');
const difficultyDialog = document.getElementById('difficulty-dialog');
const recipeDialog = document.getElementById('recipe-dialog');
const recipeDialogClose = document.getElementById('recipe-dialog-close');

comenzar.addEventListener('click', () => {
  difficultyDialog.showModal();
});

difficultyDialog.querySelectorAll('[data-difficulty]').forEach((button) => {
  button.addEventListener('click', () => {
    recipeHelp.hidden = button.dataset.difficulty === 'dificil';
    difficultyDialog.close();
    erroresIngredientes = 0;
    maxErroresIngredientes = button.dataset.difficulty === 'dificil' ? 1 : 3;
    const durationSeconds = button.dataset.difficulty === 'dificil' ? 60 : 180;
    startGameTimer(durationSeconds);
    showScreen('ingredientes-screen');
  });
});

recipeHelp.addEventListener('click', () => {
    recipeDialog.showModal();
});

recipeDialogClose.addEventListener('click', () => {
    recipeDialog.close();
});



const ingredientes = document.querySelectorAll('.ingrediente');
const tooltipIngrediente = document.getElementById('tooltip-ingrediente');

ingredientes.forEach((ingrediente) => {

    // Mouse encima
    ingrediente.addEventListener('mouseenter', () => {

        tooltipIngrediente.textContent =
            ingrediente.dataset.nombre;

        tooltipIngrediente.style.display = 'block';
    });

    // Mover el cartel con el mouse
    ingrediente.addEventListener('mousemove', (e) => {

        tooltipIngrediente.style.left =
            (e.clientX + 15) + 'px';

        tooltipIngrediente.style.top =
            (e.clientY + 15) + 'px';
    });

    // Mouse fuera
    ingrediente.addEventListener('mouseleave', () => {

        tooltipIngrediente.style.display = 'none';
    });

});

const errorDialog = document.getElementById('error-dialog');
const errorDialogMessage = document.getElementById('error-dialog-message');
const errorDialogClose = document.getElementById('error-dialog-close');
const congratulationsDialogClose = document.getElementById('congratulations-dialog-close');

congratulationsDialogClose.addEventListener('click', () => {
    congratulationsDialog.close();
    showScreen('menu-screen');
});

errorDialogClose.addEventListener('click', () => {
    errorDialog.close();
});

errorDialog.addEventListener('close', () => {
    if (erroresIngredientes >= maxErroresIngredientes) {
        showScreen('perdiste-screen');
    }
});

ingredientes.forEach((ingrediente) => {

    ingrediente.addEventListener('click', () => {

        if (ingredientesRequeridos.has(ingrediente)) {
            ingredientesSeleccionados.add(ingrediente);
            ingrediente.classList.add('seleccionado');

            const seleccionoTodos = Array.from(ingredientesRequeridos)
                .every((item) => ingredientesSeleccionados.has(item));

            if (seleccionoTodos) {
                showScreen('cortar-frutillas');
            }
            return;
        }

          if (ingredientesSinfRequeridos.has(ingrediente)) {
            ingredientesSinfSeleccionados.add(ingrediente);
            ingrediente.classList.add('seleccionado');

            const seleccionoTodos = Array.from(ingredientesSinfRequeridos)
              .every((item) => ingredientesSinfSeleccionados.has(item));

            if (seleccionoTodos) {
              showScreen('licuar');
            }
            return;
          }

        if (ingredientesServirRequeridos.has(ingrediente)) {
            ingredientesServirSeleccionados.add(ingrediente);
            ingrediente.classList.add('seleccionado');

            const seleccionoTodos = Array.from(ingredientesServirRequeridos)
                .every((item) => ingredientesServirSeleccionados.has(item));

            if (seleccionoTodos) {
                showScreen('servir');
            }
            return;
        }

        if (ingrediente.dataset.target) {
            showScreen(ingrediente.dataset.target);
            return;
        }

        // ELEMENTO INCORRECTO
        erroresIngredientes++;

        errorDialogMessage.textContent =
            `¡¡Este no es el ingrediente que necesitás ahora!!\n\n` +
            `Intentos incorrectos: ${erroresIngredientes}/${maxErroresIngredientes}`;
        errorDialogClose.textContent =
            erroresIngredientes >= maxErroresIngredientes ? 'Rendirte' : 'Continuar';
        errorDialog.showModal();

    });

});
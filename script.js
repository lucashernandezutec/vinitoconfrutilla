const screens = document.querySelectorAll('.screen');
const cuttingSound = new Audio('Newsimgs/freesound_community-cutting-strawberries-35085.mp3');
const folcloreMusic = new Audio('Newsimgs/Folclore.mp3');
folcloreMusic.loop = true;
const folcloreMusicVolume = folcloreMusic.volume;
const winSong = new Audio('Newsimgs/winsong.mp3');
winSong.loop = true;
const gameOverSound = new Audio('Newsimgs/gameover.mp3');
const sugarSound = new Audio('Newsimgs/azucar.mp3');
let erroresIngredientes = 0;
const maxErroresIngredientes = 3;
let finaleSequenceTimer = null;
let finaleSequenceActive = false;
let recetitaTimer = null;
let recetitaReturnScreen = 'menu-screen';
const ingredientesRequeridos = new Set(
  document.querySelectorAll('#ingredientes-screen .ingrediente[data-requerido="true"]')
);
const ingredientesSinfRequeridos = new Set(
  document.querySelectorAll('#ingredientes-sinf-screen .ingrediente[data-requerido="true"]')
);
const ingredientesServirRequeridos = new Set(
  document.querySelectorAll(
    '#soloaguayvaso .ingrediente[data-nombre="Hielos"], #soloaguayvaso .ingrediente[data-nombre="Vaso"]'
  )
);
const ingredientesSeleccionados = new Set();
const ingredientesSinfSeleccionados = new Set();
const ingredientesServirSeleccionados = new Set();
const licuarFrames = [
  'Newsimgs/PreLic1.jpeg',
  'Newsimgs/Lic1.jpg.jpeg',
  'Newsimgs/Lic2.jpg.jpeg',
  'Newsimgs/Lic3.jpg.jpeg',
  'Newsimgs/Lic4.jpg.jpeg',
  'Newsimgs/Lic5.jpg.jpeg'
];
const cortarFrutillasFrames = [
  'Newsimgs/frut01.jpeg',
  'Newsimgs/frut02.jpeg',
  'Newsimgs/frut1.jpeg',
  'Newsimgs/frut2.jpeg',
  'Newsimgs/frut3.jpeg',
  'Newsimgs/frut4.jpeg'
];
const cuttingSoundStopFrameIndex = cortarFrutillasFrames.indexOf('Newsimgs/frut3.jpeg');
const azucarearFrames = [
  'Newsimgs/azu1.jpeg',
  'Newsimgs/azu2.jpeg',
  'Newsimgs/azu3.jpeg',
  'Newsimgs/azu4.jpeg'
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
let licuarSoundTimer = null;
let cuttingAnimationTimer = null;
let servirAnimationTimer = null;
let servirTransitionTimer = null;
let folcloreGestureListener = null;

licuarFrames.slice(1).forEach((frameSource) => {
  const frame = new Image();
  frame.src = frameSource;
});

cortarFrutillasFrames.slice(1).forEach((frameSource) => {
  const frame = new Image();
  frame.src = frameSource;
});

azucarearFrames.slice(1).forEach((frameSource) => {
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
  window.clearTimeout(licuarSoundTimer);
  licuarSoundTimer = null;
  blenderSound.pause();
  blenderSound.currentTime = 0;
}

function stopServirAnimation() {
  window.clearInterval(servirAnimationTimer);
  servirAnimationTimer = null;
  window.clearTimeout(servirTransitionTimer);
  servirTransitionTimer = null;
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
      servirTransitionTimer = window.setTimeout(() => {
        if (document.getElementById('servir').classList.contains('active')) {
          showScreen('ganaste-screen');
        }
      }, 1000);
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

function startLicuarAnimation() {
  stopLicuarAnimation();

  const licuarFrame = document.getElementById('licuar-frame');
  let frameIndex = 0;
  licuarFrame.src = licuarFrames[frameIndex];

  licuarSoundTimer = window.setTimeout(() => {
    licuarSoundTimer = null;
    if (document.getElementById('licuar').classList.contains('active')) {
      blenderSound.play().catch((error) => {
        console.error('No se pudo reproducir el sonido de la licuadora.', error);
      });
    }
  }, 2000);

  const frameDuration = Number.isFinite(blenderSound.duration) && blenderSound.duration > 0
    ? ((blenderSound.duration + 1) * 1000) / licuarFrames.length
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
  window.clearTimeout(cuttingAnimationTimer);
  cuttingAnimationTimer = null;

  if (screenId !== 'cortar-frutillas') {
    cuttingSound.pause();
    cuttingSound.currentTime = 0;
  }

  folcloreMusic.volume = ['cortar-frutillas', 'licuar', 'azucarear', 'servir'].includes(screenId)
    ? folcloreMusicVolume * 0.2
    : folcloreMusicVolume;

  window.clearTimeout(finaleSequenceTimer);
  finaleSequenceTimer = null;

  if (screenId !== 'recetita') {
    window.clearTimeout(recetitaTimer);
    recetitaTimer = null;
  }

  if (screenId === 'ganaste-screen') {
    finaleSequenceActive = true;
  } else if (!['creditos', 'inscribite', 'intro-screen'].includes(screenId)) {
    finaleSequenceActive = false;
  }

  document.getElementById('recipe-help').hidden = finaleSequenceActive;

  stopSugarSound();
  stopServirAnimation();

  if (!finaleSequenceActive) {
    stopWinSong();
  }

  if (screenId !== 'perdiste-screen') {
    stopGameOverSound();
  }

  if (screenId === 'menu-screen') {
    startFolcloreMusic();
    erroresIngredientes = 0;
    ingredientesSeleccionados.clear();
    ingredientesSinfSeleccionados.clear();
    ingredientesServirSeleccionados.clear();
    [...ingredientesRequeridos, ...ingredientesSinfRequeridos, ...ingredientesServirRequeridos].forEach((ingrediente) => {
      ingrediente.classList.remove('seleccionado');
    });
  }

  if (screenId === 'perdiste-screen' || screenId === 'ganaste-screen') {
    stopFolcloreMusic();
  }

  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', '#' + screenId);
  }

  if (screenId === 'cortar-frutillas') {
    document.getElementById('cortar-frutillas-frame').src = cortarFrutillasFrames[0];
    cuttingSound.currentTime = 0;
    document.getElementById('cortar-frutillas-boton').hidden = false;
  }

  if (screenId === 'licuar') {
    stopLicuarAnimation();
    document.getElementById('licuar-frame').src = licuarFrames[0];
    document.getElementById('licuar-boton').hidden = false;
  } else {
    stopLicuarAnimation();
  }

  if (screenId === 'servir') {
    stopServirAnimation();
    document.getElementById('servir-frame').src = servirFrames[0];
    document.getElementById('servir-boton').hidden = false;
  }

  if (screenId === 'azucarear') {
    const azucarearFrame = document.getElementById('azucarear-frame');
    azucarearFrame.src = azucarearFrames[0];
    sugarSound.currentTime = 0;
    document.getElementById('azucarear-boton').hidden = false;
  }

  if (screenId === 'ganaste-screen') {
    winSong.currentTime = 0;
    winSong.play().catch((error) => {
      console.error('No se pudo reproducir la música de victoria.', error);
    });
    finaleSequenceTimer = window.setTimeout(() => {
      if (document.getElementById('ganaste-screen').classList.contains('active')) {
        showScreen('creditos');
      }
    }, 5000);
  }

  if (screenId === 'creditos' && finaleSequenceActive) {
    finaleSequenceTimer = window.setTimeout(() => {
      if (document.getElementById('creditos').classList.contains('active')) {
        showScreen('inscribite');
      }
    }, 5000);
  }

  if (screenId === 'inscribite' && finaleSequenceActive) {
    finaleSequenceTimer = window.setTimeout(() => {
      if (document.getElementById('inscribite').classList.contains('active')) {
        showScreen('intro-screen');
      }
    }, 10000);
  }

  if (screenId === 'intro-screen' && finaleSequenceActive) {
    finaleSequenceTimer = window.setTimeout(() => {
      if (document.getElementById('intro-screen').classList.contains('active')) {
        showScreen('menu-screen');
      }
    }, 3000);
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

cuttingSound.addEventListener('timeupdate', () => {
  if (
    !document.getElementById('cortar-frutillas').classList.contains('active')
    || !Number.isFinite(cuttingSound.duration)
    || cuttingSound.duration <= 0
  ) {
    return;
  }

  const animationDuration = Math.max(cuttingSound.duration - 1, 0.001);
  const progress = Math.min(cuttingSound.currentTime / animationDuration, 1);
  const frameIndex = Math.min(
    cuttingSoundStopFrameIndex,
    Math.floor(progress * cortarFrutillasFrames.length)
  );
  const cuttingFrame = document.getElementById('cortar-frutillas-frame');
  if (cuttingFrame.getAttribute('src') !== cortarFrutillasFrames[frameIndex]) {
    cuttingFrame.src = cortarFrutillasFrames[frameIndex];

    if (frameIndex === cuttingSoundStopFrameIndex) {
      cuttingSound.pause();
      const frameDuration = (animationDuration * 1000) / cortarFrutillasFrames.length;
      cuttingAnimationTimer = window.setTimeout(() => {
        if (!document.getElementById('cortar-frutillas').classList.contains('active')) {
          return;
        }

        cuttingFrame.src = cortarFrutillasFrames[frameIndex + 1];
        cuttingAnimationTimer = window.setTimeout(() => {
          if (document.getElementById('cortar-frutillas').classList.contains('active')) {
            showScreen('ingredientes-sinf-screen');
          }
        }, frameDuration);
      }, frameDuration);
    }
  }
});

sugarSound.addEventListener('ended', () => {
  if (document.getElementById('azucarear').classList.contains('active')) {
    showScreen('soloaguayvaso');
  }
});

sugarSound.addEventListener('timeupdate', () => {
  if (
    !document.getElementById('azucarear').classList.contains('active')
    || !Number.isFinite(sugarSound.duration)
    || sugarSound.duration <= 0
  ) {
    return;
  }

  const progress = sugarSound.currentTime / sugarSound.duration;
  const frameIndex = Math.min(
    azucarearFrames.length - 1,
    Math.floor(progress * azucarearFrames.length)
  );
  const azucarearFrame = document.getElementById('azucarear-frame');
  if (azucarearFrame.getAttribute('src') !== azucarearFrames[frameIndex]) {
    azucarearFrame.src = azucarearFrames[frameIndex];
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

document.getElementById('cortar-frutillas-boton').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.hidden = true;
  cuttingSound.currentTime = 0;
  cuttingSound.play().catch((error) => {
    console.error('No se pudo reproducir el sonido de cortar las frutillas.', error);
    if (document.getElementById('cortar-frutillas').classList.contains('active')) {
      button.hidden = false;
    }
  });
});

document.getElementById('licuar-boton').addEventListener('click', (event) => {
  event.currentTarget.hidden = true;
  startLicuarAnimation();
});

document.getElementById('azucarear-boton').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.hidden = true;
  sugarSound.currentTime = 0;
  sugarSound.play().catch((error) => {
    console.error('No se pudo reproducir el sonido del azúcar.', error);
    if (document.getElementById('azucarear').classList.contains('active')) {
      button.hidden = false;
    }
  });
});

document.getElementById('servir-boton').addEventListener('click', (event) => {
  event.currentTarget.hidden = true;
  startServirAnimation();
});

window.addEventListener('hashchange', initFromHash);
showScreen('menu-screen');

const recipeHelp = document.getElementById('recipe-help');
const comenzar = document.getElementById('comenzar');
const recetitaScreen = document.getElementById('recetita');

function closeRecetita() {
  window.clearTimeout(recetitaTimer);
  recetitaTimer = null;
  showScreen(recetitaReturnScreen);
}

comenzar.addEventListener('click', () => {
  erroresIngredientes = 0;
  showScreen('ingredientes-screen');
});

recipeHelp.addEventListener('click', () => {
  const activeScreen = document.querySelector('.screen.active');
  recetitaReturnScreen = activeScreen ? activeScreen.id : 'menu-screen';
  showScreen('recetita');
  recetitaTimer = window.setTimeout(closeRecetita, 10000);
});

recetitaScreen.addEventListener('click', closeRecetita);


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
const screens = document.querySelectorAll('.screen');
const cuttingSound = new Audio('Newsimgs/freesound_community-cutting-strawberries-35085.mp3');
let erroresIngredientes = 0;
const ingredientesRequeridos = new Set(
  document.querySelectorAll('#ingredientes-screen .ingrediente[data-requerido="true"]')
);
const ingredientesSinfRequeridos = new Set(
  document.querySelectorAll('#ingredientes-sinf-screen .ingrediente[data-requerido="true"]')
);
const ingredientesSeleccionados = new Set();
const ingredientesSinfSeleccionados = new Set();
const licuarFrames = [
  'Newsimgs/Lic1.jpg.jpeg',
  'Newsimgs/Lic2.jpg.jpeg',
  'Newsimgs/Lic3.jpg.jpeg',
  'Newsimgs/Lic4.jpg.jpeg',
  'Newsimgs/Lic5.jpg.jpeg'
];
const blenderSound = new Audio('Newsimgs/blender.mp3');
blenderSound.preload = 'auto';
let licuarAnimationTimer = null;

licuarFrames.slice(1).forEach((frameSource) => {
  const frame = new Image();
  frame.src = frameSource;
});

function stopLicuarAnimation() {
  window.clearInterval(licuarAnimationTimer);
  licuarAnimationTimer = null;
  blenderSound.pause();
  blenderSound.currentTime = 0;
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
  if (screenId === 'menu-screen') {
    erroresIngredientes = 0;
    ingredientesSeleccionados.clear();
    ingredientesSinfSeleccionados.clear();
    [...ingredientesRequeridos, ...ingredientesSinfRequeridos].forEach((ingrediente) => {
      ingrediente.classList.remove('seleccionado');
    });
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
initFromHash();

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

errorDialogClose.addEventListener('click', () => {
    errorDialog.close();
});

errorDialog.addEventListener('close', () => {
    if (erroresIngredientes >= 3) {
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

        if (ingrediente.dataset.target) {
            showScreen(ingrediente.dataset.target);
            return;
        }

        // ELEMENTO INCORRECTO
        erroresIngredientes++;

        errorDialogMessage.textContent =
            `¡¡Este no es el ingrediente que necesitás ahora!!\n\n` +
            `Intentos incorrectos: ${erroresIngredientes}/3`;
        errorDialogClose.textContent =
            erroresIngredientes >= 3 ? 'Rendirte' : 'Continuar';
        errorDialog.showModal();

    });

});
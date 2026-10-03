const screens = document.querySelectorAll('.screen');
let erroresIngredientes = 0;
const ingredientesRequeridos = new Set(
    document.querySelectorAll('.ingrediente[data-requerido="true"]')
);
const ingredientesSeleccionados = new Set();

function showScreen(screenId) {
  if (screenId === 'menu-screen') {
    erroresIngredientes = 0;
    ingredientesSeleccionados.clear();
    ingredientesRequeridos.forEach((ingrediente) => {
      ingrediente.classList.remove('seleccionado');
    });
  }

  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', '#' + screenId);
  }
}

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
const recipeDialog = document.getElementById('recipe-dialog');
const recipeDialogClose = document.getElementById('recipe-dialog-close');

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
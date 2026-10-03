const screens = document.querySelectorAll('.screen');

function showScreen(screenId) {
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

    // Click / selección
    ingrediente.addEventListener('click', () => {

        // Quita la selección anterior
        ingredientes.forEach((item) => {
            item.classList.remove('seleccionado');
        });

        // Selecciona el actual
        ingrediente.classList.add('seleccionado');

        console.log(
            'Ingrediente seleccionado:',
            ingrediente.dataset.nombre
        );
    });

});
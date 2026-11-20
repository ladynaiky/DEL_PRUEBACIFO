// =====================================================================
// app.js — Lógica del frontend (Fase 1: datos guardados en localStorage)
// =====================================================================

// Nombre de la "clave" con la que guardamos la lista en localStorage
const CLAVE_STORAGE = 'productos';

// 1) REFERENCIAS A ELEMENTOS DEL HTML (los buscamos por su id)
const formulario = document.getElementById('formulario-producto');
const listado = document.getElementById('listado-productos');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonCancelar = document.getElementById('boton-cancelar');
const campoId = document.getElementById('id'); // campo oculto: vacío = crear, con valor = editar

// ---------------------------------------------------------------------
// 2) FUNCIONES DE DATOS: leer y guardar en localStorage
// ---------------------------------------------------------------------

// Lee la lista de productos. localStorage solo guarda TEXTO,
// así que convertimos ese texto (JSON) en una lista de JavaScript.
function leerProductos() {
  const texto = localStorage.getItem(CLAVE_STORAGE);
  return texto ? JSON.parse(texto) : []; // si no hay nada, lista vacía
}

// Guarda la lista de productos, convirtiéndola antes a texto (JSON).
function guardarProductos(productos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

// ---------------------------------------------------------------------
// 3) FUNCIONES DE PANTALLA: pintar las cajas
// ---------------------------------------------------------------------

// Evita que un texto escrito por el usuario se interprete como HTML.
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Da formato de euros: 199.9 → "199,90 €"
function formatearPrecio(precio) {
  return precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

// Dibuja una caja por cada producto dentro del listado.
function pintarProductos() {
  const productos = leerProductos();

  if (productos.length === 0) {
    listado.innerHTML = '<p class="vacio">No hay productos todavía.</p>';
    return;
  }

  listado.innerHTML = productos.map((p) => `
    <article class="caja">
      <span class="etiqueta">${escapar(p.categoria)}</span>
      <h3>${escapar(p.nombre)}</h3>
      <p>${escapar(p.marca)}</p>
      <p class="precio">${formatearPrecio(p.precio)}</p>
      <p>Stock: ${p.stock} uds.</p>
      <p>${escapar(p.descripcion)}</p>
      <div class="botones">
        <button type="button" data-id="${p.id}" class="boton-editar">Editar</button>
        <button type="button" data-id="${p.id}" class="boton-borrar">Borrar</button>
      </div>
    </article>
  `).join('');
}

// Deja el formulario vacío y en modo "crear"
function limpiarFormulario() {
  formulario.reset();   // vacía los campos visibles
  campoId.value = '';   // vacía el id oculto → modo crear
  tituloFormulario.textContent = 'Nuevo producto';
}

// Rellena el formulario con un producto existente → modo "editar"
function cargarEnFormulario(producto) {
  campoId.value = producto.id;
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('marca').value = producto.marca;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('descripcion').value = producto.descripcion;
  tituloFormulario.textContent = 'Editar producto';
  formulario.scrollIntoView({ behavior: 'smooth' }); // sube hasta el formulario
}

// ---------------------------------------------------------------------
// 4) EVENTOS: qué pasa cuando el usuario hace algo
// ---------------------------------------------------------------------

// Al pulsar "Guardar" (enviar el formulario): CREAR o EDITAR
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  const idEditando = campoId.value; // vacío = crear, con valor = editar

  // Leemos los valores de cada campo y creamos el objeto producto
  const producto = {
    id: idEditando || Date.now().toString(), // si es nuevo, id basado en la hora actual
    nombre: document.getElementById('nombre').value.trim(),
    marca: document.getElementById('marca').value.trim(),
    categoria: document.getElementById('categoria').value,
    precio: Number(document.getElementById('precio').value),
    stock: Number(document.getElementById('stock').value),
    descripcion: document.getElementById('descripcion').value.trim(),
  };

  let productos = leerProductos();

  if (idEditando) {
    // EDITAR: sustituimos el producto que tiene ese id
    productos = productos.map((p) => (p.id === idEditando ? producto : p));
  } else {
    // CREAR: lo añadimos al final de la lista
    productos.push(producto);
  }

  guardarProductos(productos);
  limpiarFormulario();
  pintarProductos();
});

// Al pulsar "Cancelar": salimos del modo edición
botonCancelar.addEventListener('click', limpiarFormulario);

// Clics dentro del listado: un único escuchador para todos los botones
listado.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button'); // ¿se ha pulsado un botón?
  if (!boton) return;

  const id = boton.dataset.id; // lee el atributo data-id del botón
  const productos = leerProductos();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  if (boton.classList.contains('boton-editar')) {
    // EDITAR: llevamos sus datos al formulario
    cargarEnFormulario(producto);
  }

  if (boton.classList.contains('boton-borrar')) {
    // BORRAR: pedimos confirmación y lo quitamos de la lista
    if (!confirm(`¿Seguro que quieres borrar "${producto.nombre}"?`)) return;

    guardarProductos(productos.filter((p) => p.id !== id));

    // Si estábamos editando justo ese producto, limpiamos el formulario
    if (campoId.value === id) limpiarFormulario();

    pintarProductos();
  }
});

// ---------------------------------------------------------------------
// 5) INICIO: al cargar la página, pintamos lo que ya hubiera guardado
// ---------------------------------------------------------------------
pintarProductos();

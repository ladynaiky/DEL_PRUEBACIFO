// =====================================================================
// app.js — Lógica del frontend
// Fase 2: los datos ya NO están en localStorage, sino en el servidor NestJS.
// El frontend se comunica con él mediante peticiones HTTP (fetch) en JSON.
// =====================================================================

// Dirección de la API (el backend NestJS tiene que estar arrancado)
const API_URL = 'http://localhost:3000/productos';

// 1) REFERENCIAS A ELEMENTOS DEL HTML (los buscamos por su id)
const formulario = document.getElementById('formulario-producto');
const listado = document.getElementById('listado-productos');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonCancelar = document.getElementById('boton-cancelar');
const campoId = document.getElementById('id'); // campo oculto: vacío = crear, con valor = editar

// ---------------------------------------------------------------------
// 2) FUNCIONES DE DATOS: hablan con la API
// ---------------------------------------------------------------------
// "async/await": una petición por internet tarda un poco. "await" significa
// "espera a que llegue la respuesta antes de seguir".

// Función común para todas las peticiones: envía, espera y revisa si hubo error.
async function pedirApi(url, opciones = {}) {
  const respuesta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }, // "te envío JSON"
    ...opciones,
  });

  if (!respuesta.ok) {
    // El servidor ha contestado con un error (400, 404...): leemos su mensaje
    const error = await respuesta.json().catch(() => ({}));
    const mensaje = Array.isArray(error.message) ? error.message.join('\n') : error.message;
    throw new Error(mensaje || `Error ${respuesta.status}`);
  }

  // 204 = respuesta vacía (al borrar). Si no, convertimos el JSON en objeto.
  return respuesta.status === 204 ? null : respuesta.json();
}

// LEER todos → GET /productos
function leerProductos() {
  return pedirApi(API_URL);
}

// CREAR → POST /productos (con los datos en el "cuerpo" de la petición)
function crearProducto(datos) {
  return pedirApi(API_URL, { method: 'POST', body: JSON.stringify(datos) });
}

// EDITAR → PUT /productos/:id
function editarProducto(id, datos) {
  return pedirApi(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
}

// BORRAR → DELETE /productos/:id
function borrarProducto(id) {
  return pedirApi(`${API_URL}/${id}`, { method: 'DELETE' });
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

// Muestra un aviso cuando el servidor no responde o devuelve un error
function mostrarError(error) {
  console.error(error);
  alert(`No se ha podido completar la operación:\n${error.message}\n\n¿Está arrancado el backend?`);
}

// Pide la lista al servidor y dibuja una caja por cada producto.
async function pintarProductos() {
  let productos;
  try {
    productos = await leerProductos();
  } catch (error) {
    console.error(error);
    listado.innerHTML = '<p class="vacio">No se puede conectar con el servidor. ¿Está arrancado el backend?</p>';
    return;
  }

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
formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  const idEditando = campoId.value; // vacío = crear, con valor = editar

  // Leemos los valores de cada campo. Ya NO ponemos el id: lo pone el servidor.
  const datos = {
    nombre: document.getElementById('nombre').value.trim(),
    marca: document.getElementById('marca').value.trim(),
    categoria: document.getElementById('categoria').value,
    precio: Number(document.getElementById('precio').value),
    stock: Number(document.getElementById('stock').value),
    descripcion: document.getElementById('descripcion').value.trim(),
  };

  try {
    if (idEditando) {
      await editarProducto(idEditando, datos);
    } else {
      await crearProducto(datos);
    }
    limpiarFormulario();
    await pintarProductos();
  } catch (error) {
    mostrarError(error);
  }
});

// Al pulsar "Cancelar": salimos del modo edición
botonCancelar.addEventListener('click', limpiarFormulario);

// Clics dentro del listado: un único escuchador para todos los botones
listado.addEventListener('click', async (evento) => {
  const boton = evento.target.closest('button'); // ¿se ha pulsado un botón?
  if (!boton) return;

  const id = boton.dataset.id; // lee el atributo data-id del botón

  try {
    const productos = await leerProductos();
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    if (boton.classList.contains('boton-editar')) {
      // EDITAR: llevamos sus datos al formulario
      cargarEnFormulario(producto);
    }

    if (boton.classList.contains('boton-borrar')) {
      // BORRAR: pedimos confirmación y se lo pedimos al servidor
      if (!confirm(`¿Seguro que quieres borrar "${producto.nombre}"?`)) return;

      await borrarProducto(id);

      // Si estábamos editando justo ese producto, limpiamos el formulario
      if (campoId.value === id) limpiarFormulario();

      await pintarProductos();
    }
  } catch (error) {
    mostrarError(error);
  }
});

// ---------------------------------------------------------------------
// 5) INICIO: al cargar la página, pedimos la lista al servidor
// ---------------------------------------------------------------------
pintarProductos();

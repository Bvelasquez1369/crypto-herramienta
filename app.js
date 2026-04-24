document.addEventListener('DOMContentLoaded', function () { // Asegura que el DOM esté completamente cargado antes de ejecutar el código

    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    const listaCarrito   = document.getElementById('lista-carrito');
    const spanTotal      = document.getElementById('total');
    const spanContador   = document.getElementById('contador');
    const botonVaciar    = document.getElementById('btn-vaciar');
    const mensajeVacio   = document.getElementById('msg-vacio');

    const STORAGE_KEY = 'carrito_crypto'; // nombre único para guardar los datos

    let carrito = []; // arreglo para almacenar los productos agregados al carrito

    function actualizarContador() {
        spanContador.textContent = carrito.length;
    }

    function actualizarTotal() {
        const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
        spanTotal.textContent = '$' + total.toLocaleString('es-CO');
    }

    function verificarCarritoVacio() {
        if (carrito.length === 0) {
            mensajeVacio.style.display = ''; // lo muestra
        } else {
            mensajeVacio.style.display = 'none';
        }
    }

    function guardarCarrito() {
        const carritoJSON = JSON.stringify(carrito); // transforma el arreglo de objetos en texto JSON
        localStorage.setItem(STORAGE_KEY, carritoJSON); // guarda el texto bajo la clave definida
    }

    function cargarCarrito() {
        const carritoJSON = localStorage.getItem(STORAGE_KEY); // obtiene el texto JSON (puede ser null)
        if (carritoJSON) {// si hay algo guardado, lo convierte de nuevo a arreglo de objetos
            carrito = JSON.parse(carritoJSON);
        } else {
            carrito = []; // si no hay nada guardado, inicializamos con un arreglo vacío
        }
        reconstruirListaVisual();
    }

    function reconstruirListaVisual() {
        // Elimina todos los elementos <li> que no sean el mensaje de vacío
        const itemsPrevios = listaCarrito.querySelectorAll('li:not(#msg-vacio)');
        itemsPrevios.forEach(item => item.remove());
        // Crea un <li> por cada producto en el arreglo carrito
        carrito.forEach(function (producto, indice) {
            const nuevoItem = document.createElement('li');
            nuevoItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoItem.innerHTML = `
                <span><strong>${producto.nombre}</strong> - $${producto.precio.toLocaleString('es-CO')}</span>
                <button class="btn-eliminar">❌</button>
            `;
            const botonEliminar = nuevoItem.querySelector('.btn-eliminar');
            botonEliminar.addEventListener('click', function () {
                eliminarProducto(indice); // llama a eliminar pasando el índice actual
            });

            listaCarrito.appendChild(nuevoItem);
        });

        actualizarContador();
        actualizarTotal();
        verificarCarritoVacio();
    }

    function agregarProducto(nombre, precio) {
        carrito.push({ nombre: nombre, precio: precio });// agrega un nuevo objeto al arreglo carrito

        guardarCarrito();
        reconstruirListaVisual();
    }

    function eliminarProducto(indice) {
        carrito.splice(indice, 1);// elimina 1 elemento en la posición dada

        guardarCarrito();
        reconstruirListaVisual();
    }

    function vaciarCarrito() {
        carrito = [];           // vacía el arreglo
        guardarCarrito();       // guarda el arreglo vacío en localStorage
        reconstruirListaVisual();// refresca la interfaz
    }

    botonesAgregar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseFloat(boton.getAttribute('data-precio'));
            if (isNaN(precio)) {
                console.error('el precio no es valido para el producto:', nombre);
                return;
            }
            agregarProducto(nombre, precio);
        });
    });

    botonVaciar.addEventListener('click', function () {
        vaciarCarrito();
    });

    cargarCarrito(); // recupera datos de localStorage y pinta la lista
});
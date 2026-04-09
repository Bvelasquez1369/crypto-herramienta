document.addEventListener('DOMContentLoaded', function() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total');
    const badge = document.getElementById('badge');
    const botonVaciar = document.getElementById('btn-vaciar');
    const mensajeVacio = document.getElementById('msg-vacio');

    let cantidadItems = 0;
    let totalAcumulado = 0;

    function actualizarBadge() {
        badge.textContent = cantidadItems;
    }

    function actualizarTotal() {
        totalSpan.textContent = '$' + totalAcumulado.toLocaleString('es-CO');
    }

    function verificarCarritoVacio() {
        const items = listaCarrito.querySelectorAll('li:not(#msg-vacio)');
        if (items.length === 0) {
            mensajeVacio.style.display = 'block';
        } else {
            mensajeVacio.style.display = 'none';
        }
    }

    function eliminarItem(elementoLi, precio) {
        elementoLi.remove();
        totalAcumulado -= precio;
        cantidadItems--;
        actualizarBadge();
        actualizarTotal();
        verificarCarritoVacio();
    }

    function agregarAlCarrito(nombre, precio) {
        cantidadItems++;
        totalAcumulado += precio;

        const nuevoItem = document.createElement('li');
        nuevoItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        nuevoItem.innerHTML = `
            <span><strong>${nombre}</strong> - $${precio.toLocaleString('es-CO')}</span>
            <button class="btn-eliminar">❌</button>
        `;
        const botonEliminar = nuevoItem.querySelector('.btn-eliminar');
        botonEliminar.addEventListener('click', function() {
            eliminarItem(nuevoItem, precio);
        });
        listaCarrito.appendChild(nuevoItem);

        actualizarBadge();
        actualizarTotal();
        verificarCarritoVacio();
    }

    botonesAgregar.forEach(function(boton) {
        boton.addEventListener('click', function() {
            const nombre = boton.getAttribute('data-nombre');
            let precio = parseFloat(boton.getAttribute('data-precio'));
            if (isNaN(precio)) {
                console.error('El precio no es válido para el producto:', nombre);
                return;
            }
            agregarAlCarrito(nombre, precio);
        });
    });

    botonVaciar.addEventListener('click', function() {
        const items = listaCarrito.querySelectorAll('li:not(#msg-vacio)');
        items.forEach(function(item) {
            item.remove();
        });
        cantidadItems = 0;
        totalAcumulado = 0;
        actualizarBadge();
        actualizarTotal();
        verificarCarritoVacio();
    });

    verificarCarritoVacio();
});
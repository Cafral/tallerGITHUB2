// Funcionalidad de desplazamiento suave
$(function(){
    $('a[href*=#]').click(function() {
        // Verifica si el enlace apunta a una sección interna de la misma página
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
        && location.hostname == this.hostname) {
            // Obtiene el elemento de destino basado en el hash del enlace
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
                // Calcula la posición del destino y realiza un desplazamiento suave
                var targetOffset = $target.offset().top;
                $('html,body').animate({scrollTop: targetOffset}, 800);
                return false; // Previene el comportamiento predeterminado del del enlace
            }
        }
    });
});

// Efecto de máquina de escribir
var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate; // Texto a mostrar en el efecto máquina de escribir
    this.el = el; // Elemento HTML donde se mostrará el texto
    this.loopNum = 0; // Contador de iteraciones
    this.period = parseInt(period, 10) || 2000; // Tiempo entre cambios de texto
    this.txt = ''; // Texto actual mostrado
    this.tick(); // Inicia el efecto de máquina de escribir
    this.isDeleting = false; // Indica si se está eliminando el texto
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length; // Índice del texto actual
    var fullTxt = this.toRotate[i]; // Texto completo a mostrar

    // Actualiza el texto mostrado según si se está eliminando o añadiendo
    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Actualiza el contenido del elemento HTML
    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    // Calcula el tiempo de espera antes del siguiente cambio de texto
    var that = this;
    var delta = 200 - Math.random() * 100;
    if (this.isDeleting) { delta /= 2; }

    // Cambia el estado de eliminación y el tiempo de espera si el texto está completo
    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    // Llama a la función tick después del tiempo calculado
    setTimeout(function() {
        that.tick();
    }, delta);
};

// Inicializa el efecto de máquina de escribir en los elementos de la clase 'typewrite'
window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // Inyecta CSS para el cursor de máquina de escribir
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
}

// Funcionalidad de búsqueda de productos
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el campo de búsqueda, el botón de búsqueda y todos los productos
    const inputBusqueda = document.getElementById('inputBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const products = document.querySelectorAll('.producto');

    // Función que filtra los productos en función del texto de búsqueda
    function filterProducts() {
        // Obtiene el texto de búsqueda y lo convierte a minúsculas para una búsqueda insensible a mayúsculas
        const searchTerm = inputBusqueda.value.toLowerCase();

        // Itera sobre todos los productos
        products.forEach(producto => {
            // Obtiene el texto del título y la descripción del producto y los convierte a minúsculas
            const title = producto.querySelector('h2').textContent.toLowerCase();
            const description = producto.querySelector('p').textContent.toLowerCase();
            
            // Verifica si el texto de búsqueda está incluido en el título o la descripción del producto
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                // Muestra el producto si coincide con la búsqueda
                producto.style.display = '';
            } else {
                // Oculta el producto si no coincide con la búsqueda
                producto.style.display = 'none';
            }
        });
    }

    // Agrega un evento de clic al botón de búsqueda para activar la función de filtrado
    botonBusqueda.addEventListener('click', filterProducts);
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const button = document.querySelector('button[type="button"]');

    button.addEventListener('click', function(event) {
        // Prevenir el envío del formulario si hay errores
        event.preventDefault();
        
        // Obtener los valores de los campos
        const nombre = document.getElementById('ingresarNombre').value.trim();
        const email = document.getElementById('ingresarEmail').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        // Obtener los elementos de error
        const nombreError = document.getElementById('nombreError');
        const emailError = document.getElementById('emailError');
        const telefonoError = document.getElementById('telefonoError');
        const mensajeError = document.getElementById('mensajeError');
        
        // Inicializar el estado de validación
        let isValid = true;

        // Limpiar mensajes de error
        nombreError.textContent = '';
        emailError.textContent = '';
        telefonoError.textContent = '';
        mensajeError.textContent = '';

        // Validar Nombre
        const nombrePattern = /^[a-zA-Z\s]+$/;
        if (nombre === '') {
            nombreError.textContent = 'Por favor, ingrese su nombre.';
            isValid = false;
        } else if (!nombrePattern.test(nombre)) {
            nombreError.textContent = 'El nombre solo debe contener letras y espacios.';
            isValid = false;
        } else if (nombre.length > 30) {
            nombreError.textContent = 'El nombre no debe exceder los 30 caracteres.';
            isValid = false;
        }

        // Validar Email
        // Expresión regular más robusta para correos electrónicos
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = 'Por favor, ingrese un correo electrónico válido.';
            isValid = false;
        }

        // Validar Teléfono
        const telefonoPattern = /^0[0-9]{9}$/;
        if (!telefonoPattern.test(telefono)) {
            telefonoError.textContent = 'Por favor, ingrese un número de teléfono válido que empiece con 0 y tenga 10 dígitos.';
            isValid = false;
        }

        // Validar Mensaje
        if (mensaje.length > 200) {
            mensajeError.textContent = 'El mensaje no debe exceder los 200 caracteres.';
            isValid = false;
        }

        // Si el formulario es válido, puedes enviar el formulario aquí o realizar alguna acción
        if (isValid) {
            alert('Formulario enviado con éxito.');
            // Aquí puedes agregar código para enviar el formulario si es necesario.
        }
    });
});
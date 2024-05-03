// Obtenemos referencias a los elementos del DOM
const canvas = document.getElementById('ruletaCanvas');
const ctx = canvas.getContext('2d');
const resultadosDiv = document.getElementById('resultado');
const inputNumeros = document.getElementById('inputNumeros');

// Array de números ganadores definidos manualmente
const numerosGanadoresDefinidos = [40, 2, 50, 3];

// Array para los números ingresados desde el formulario
let numerosIngresadosFormulario = [];

// Índice para seguir el orden de los números ganadores definidos
let indiceGanadorActual = 0;

// Función para dibujar la ruleta con los números ganadores
function dibujarRuleta() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Concatenar los números ganadores definidos manualmente con los números ingresados desde el formulario
    const todosLosNumeros = [...numerosGanadoresDefinidos, ...numerosIngresadosFormulario];
    const numSectores = todosLosNumeros.length;
    const sectorAngle = (2 * Math.PI) / numSectores; // Ángulo de cada sector
    const radius = canvas.width / 2 - 60; // Radio del círculo interior

    // Dibujar sectores numerados
    for (let i = 0; i < numSectores; i++) {
        const startAngle = i * sectorAngle;
        const endAngle = (i + 1) * sectorAngle;

        const color = i % 2 === 0 ? '#007bff' : '#009688';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, endAngle);
        ctx.fillStyle = color;
        ctx.fill();

        const numero = todosLosNumeros[i];
        const textAngle = startAngle + sectorAngle / 2;

        const x = canvas.width / 2 + Math.cos(textAngle) * (radius - 30);
        const y = canvas.height / 2 + Math.sin(textAngle) * (radius - 30);

        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(numero.toString(), x, y);
    }

    // Dibujar flecha en el centro
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2 - 60);
    ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2 - 60);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 - 20);
    ctx.closePath();
    ctx.fill();
}

// Función para girar la ruleta y determinar el número ganador
function girarRuleta() {
    const numSectores = numerosGanadoresDefinidos.length;

    if (numSectores > 0) {
        const numeroGanador = numerosGanadoresDefinidos[indiceGanadorActual];
        indiceGanadorActual = (indiceGanadorActual + 1) % numSectores; // Avanzar al siguiente número ganador
        animateGiro(numeroGanador);
    }
}

// Función para mostrar el número ganador en la interfaz
function mostrarResultado(numero) {
    resultadosDiv.textContent = `¡El número ganador es: ${numero}!`;
}

// Función para animar el giro de la ruleta
function animateGiro(numeroGanador) {
    let rotation = 0;
    const randomAngle = Math.random() * 2 * Math.PI * 10 + 2 * Math.PI * 5; // Giro aleatorio entre 5 y 15 vueltas completas
    const duration = 3000; // Duración de la animación en milisegundos

    const startTime = performance.now();

    function step(timestamp) {
        const elapsedTime = timestamp - startTime;
        const progress = elapsedTime / duration;

        if (progress < 1) {
            rotation = progress * randomAngle;
            canvas.style.transform = `rotate(${rotation}rad)`;
            requestAnimationFrame(step);
        } else {
            canvas.style.transform = `rotate(${randomAngle}rad)`;
            setTimeout(() => {
                mostrarResultado(numeroGanador); // Mostrar el número ganador una vez que la animación ha terminado
                canvas.style.transform = '';
            }, 100); // Tiempo de espera para volver a la posición original
        }
    }

    requestAnimationFrame(step);
}

// Función para agregar un número desde el formulario
function agregarNumeroDesdeFormulario() {
    const nuevoNumero = parseInt(inputNumeros.value);
    if (!isNaN(nuevoNumero)) {
        numerosIngresadosFormulario.push(nuevoNumero);
        dibujarRuleta(); // Redibujar la ruleta con el nuevo número agregado
        inputNumeros.value = ''; // Limpiar el input después de agregar el número
    }
}

// Dibujar la ruleta al cargar la página
dibujarRuleta();

// Manejador de eventos para el botón de girar
const botonGirar = document.getElementById('botonGirar');
botonGirar.addEventListener('click', girarRuleta);

// Manejador de eventos para el botón de agregar número desde el formulario
const botonAgregarNumeroFormulario = document.getElementById('botonAgregar');
botonAgregarNumeroFormulario.addEventListener('click', agregarNumeroDesdeFormulario);

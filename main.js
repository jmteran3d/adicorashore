alert("¡Bienvenido al simulador de créditos!");

function solicitarDato(mensaje, validacion) {
    let dato;
    do {
        dato = parseFloat(prompt(mensaje));
        if (isNaN(dato)) {
            alert("Por favor, ingresa un número válido.");
        } else if (!validacion(dato)) {
            alert("El valor ingresado no es válido. Inténtalo de nuevo.");
        }
    } while (!validacion(dato));
    return dato;
}

function calcularCredito(monto, cuotas) {
    const interesAnual = 0.10;
    const interesTotal = monto * interesAnual * (cuotas / 12);
    const montoTotal = monto + interesTotal;
    const valorCuota = montoTotal / cuotas;

    if (cuotas === 3) {
        alert("Has elegido el plan de 3 cuotas. Es una opción rápida de pago.");
    } else if (cuotas === 6) {
        alert("El plan de 6 cuotas te permite un balance entre tiempo e intereses.");
    } else if (cuotas === 12) {
        alert("Has seleccionado 12 cuotas. Es un plan extendido para mayor comodidad.");
    } else if (cuotas === 24) {
        alert("24 cuotas es el plan más largo con cuotas más pequeñas, pero mayor interés.");
    } else {
        alert("Has elegido un número de cuotas personalizado.");
    }

    console.log(`Monto: $${monto}, Cuotas: ${cuotas}, Monto total: $${montoTotal.toFixed(2)}, Valor cuota: $${valorCuota.toFixed(2)}`);

    alert(`Monto solicitado: $${monto}
Cantidad de cuotas: ${cuotas}
Monto total a pagar: $${montoTotal.toFixed(2)}
Valor de cada cuota: $${valorCuota.toFixed(2)}`);

    console.log("Detalle de cuotas:");
    let detalle = "Detalle de cuotas:\n";
    for (let i = 1; i <= cuotas; i++) {
        detalle += `Cuota ${i}: $${valorCuota.toFixed(2)}\n`;
        console.log(`Cuota ${i}: $${valorCuota.toFixed(2)}`);
    }
    alert(detalle);

    if (montoTotal > 50000000) {
        alert("Advertencia: El monto total a pagar supera los $50,000,000. Considera tus opciones cuidadosamente.");
    }
}

do {
    let monto = solicitarDato("Ingresa el monto del crédito (mínimo $1000):", dato => !isNaN(dato) && dato >= 1000);
    let cuotas = solicitarDato("¿En cuántas cuotas quieres pagar? (Opciones: 3, 6, 12 o 24):", dato => [3, 6, 12, 24].includes(dato));
    calcularCredito(monto, cuotas);
} while (confirm("¿Quieres hacer otra simulación?"));

alert("¡Gracias por utilizar el simulador de créditos!");

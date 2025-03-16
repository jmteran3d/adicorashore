alert("¡Bienvenido al simulador de créditos!");

// Array para almacenar el historial de créditos
let historialCreditos = [];

// Constructor para representar un crédito
const Credito = function (monto, cuotas, montoTotal, valorCuota) {
  this.monto = monto;
  this.cuotas = cuotas;
  this.montoTotal = montoTotal;
  this.valorCuota = valorCuota;
};

function solicitarDato(mensaje, validacion) {
  let dato;
  do {
    let entrada = prompt(mensaje).trim();
    dato = parseFloat(entrada);
    if (entrada === "" || isNaN(dato)) {
      alert("⚠ Error: Ingresa un número válido.");
    } else if (!validacion(dato)) {
      alert("⚠ Valor fuera de rango. Inténtalo de nuevo.");
    }
  } while (isNaN(dato) || !validacion(dato));
  return dato;
}

function calcularCredito(monto, cuotas) {
  console.log("Calcula credito al 10% de interes anual");
  const interesAnual = 0.1;
  const interesTotal = monto * interesAnual * (cuotas / 12);
  const montoTotal = monto + interesTotal;
  const valorCuota = montoTotal / cuotas;

  mostrarMensajeCuotas(cuotas);
  mostrarResumenCredito(monto, cuotas, montoTotal, valorCuota);
  mostrarDetalleCuotas(cuotas, valorCuota);

  if (montoTotal > 50000000) {
    alert(
      "Advertencia: El monto total a pagar supera los $50,000,000. Considera tus opciones cuidadosamente."
    );
  }

  // Guardar en el historial
  historialCreditos.push(new Credito(monto, cuotas, montoTotal, valorCuota));
}

function mostrarMensajeCuotas(cuotas) {
  console.log("Muestra detalle de cuotas");
  const mensajes = {
    3: "Has elegido el plan de 3 cuotas. Es una opción rápida de pago.",
    6: "El plan de 6 cuotas te permite un balance entre tiempo e intereses.",
    12: "Has seleccionado 12 cuotas. Es un plan extendido para mayor comodidad.",
    24: "24 cuotas es el plan más largo con cuotas más pequeñas, pero mayor interés.",
  };
  alert(mensajes[cuotas] || "Has elegido un número de cuotas personalizado.");
}

function mostrarResumenCredito(monto, cuotas, montoTotal, valorCuota) {
  console.log("Resumen del credito");
  alert(
    `Monto solicitado: $${monto}\nCantidad de cuotas: ${cuotas}\nMonto total a pagar: $${montoTotal.toFixed(
      2)}\nValor de cada cuota: $${valorCuota.toFixed(2)}`
  );
}

function mostrarDetalleCuotas(cuotas, valorCuota) {
  console.log("Ejecuta detalle de cuotas");
  let detalle = "Detalle de cuotas:\n";
  for (let i = 1; i <= cuotas; i++) {
    detalle += `Cuota ${i}: $${valorCuota.toFixed(2)}\n`;
  }
  alert(detalle);
}

function consultarHistorial() {
  let filtro = parseFloat(
    prompt(
      "Ingresa un monto para buscar créditos similares o deja vacío para ver todo el historial:"
    ).trim()
  );
  let resultados = isNaN(filtro)
    ? historialCreditos
    : historialCreditos.filter((x) => x.monto === filtro);

  if (resultados.length > 0) {
    console.table(resultados);
    alert(`Se encontraron ${resultados.length} créditos en el historial.`);
  } else {
    alert("No hay créditos en el historial.");
    return;
  }
}

function ejecutarSimulador() {
  console.log("Ejecuta simulador");
  let opcion;
  do {
    opcion = prompt(
      "Selecciona una opción:\n1. Simular crédito\n2. Consultar historial\n3. Salir"
    );
    switch (opcion) {
      case "1":
        let monto = solicitarDato(
          "Ingresa el monto del crédito (mínimo $10.000):",
          (dato) => !isNaN(dato) && dato >= 10000
        );
        console.log("Monto ingresado:", monto);
        let cuotas = solicitarDato(
          "¿En cuántas cuotas quieres pagar? (Opciones: 3, 6, 12 o 24):",
          (dato) => [3, 6, 12, 24].includes(dato)
        );
        console.log("Cuotas ingresadas:", cuotas);
        calcularCredito(monto, cuotas);
        break;
      case "2":
        consultarHistorial();
        break;
      case "3":
        alert("¡Gracias por utilizar el simulador de créditos!");
        break;
      default:
        alert("Opción no válida. Intenta de nuevo.");
    }
  } while (opcion !== "3");
}

ejecutarSimulador();

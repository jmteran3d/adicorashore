// Recuperar historial desde localStorage
let historialCreditos = JSON.parse(localStorage.getItem('historialCreditos')) || [];

// Constructor para representar un crédito
const Credito = function (monto, cuotas, montoTotal, valorCuota) {
  this.monto = monto;
  this.cuotas = cuotas;
  this.montoTotal = montoTotal;
  this.valorCuota = valorCuota;
};

// Función para actualizar el historial en localStorage
function actualizarHistorial() {
  localStorage.setItem('historialCreditos', JSON.stringify(historialCreditos));
}

// Función para simular crédito
function calcularCredito(monto, cuotas) {
  const interesAnual = 0.1;
  const interesTotal = monto * interesAnual * (cuotas / 12);
  const montoTotal = monto + interesTotal;
  const valorCuota = montoTotal / cuotas;

  // Mostrar resumen en la interfaz
  document.getElementById('resumenCredito').textContent = 
    `Monto solicitado: $${monto}\nCantidad de cuotas: ${cuotas}\nMonto total a pagar: $${montoTotal.toFixed(2)}\nValor de cada cuota: $${valorCuota.toFixed(2)}`;

  // Mostrar la sección de detalles y ocultar la de simulación
  document.getElementById('simuladorCredito').classList.add('hidden');
  document.getElementById('resultadoSimulacion').classList.remove('hidden');

  // Guardar en el historial
  historialCreditos.push(new Credito(monto, cuotas, montoTotal, valorCuota));
  actualizarHistorial();
}

// Función para mostrar detalles de las cuotas
function mostrarDetalleCuotas(cuotas, valorCuota) {
  const listadoCuotas = document.getElementById('listadoCuotas');
  listadoCuotas.innerHTML = ''; // Limpiar listado anterior

  for (let i = 1; i <= cuotas; i++) {
    const item = document.createElement('li');
    item.textContent = `Cuota ${i}: $${valorCuota.toFixed(2)}`;
    listadoCuotas.appendChild(item);
  }

  document.getElementById('detalleCuotas').classList.remove('hidden');
  document.getElementById('resultadoSimulacion').classList.add('hidden');
}

// Función para consultar el historial de créditos
function mostrarHistorial() {
  const tbody = document.getElementById('historialTable').querySelector('tbody');
  tbody.innerHTML = ''; // Limpiar tabla anterior

  if (historialCreditos.length > 0) {
    historialCreditos.forEach((credito) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>$${credito.monto}</td>
        <td>${credito.cuotas}</td>
        <td>$${credito.montoTotal.toFixed(2)}</td>
        <td>$${credito.valorCuota.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });

    document.getElementById('historialTable').classList.remove('hidden');
  } else {
    alert('No hay créditos en el historial.');
  }
}

// Función para manejar la simulación cuando se presiona el botón
document.getElementById('simularBtn').addEventListener('click', () => {
  const monto = parseFloat(document.getElementById('monto').value);
  const cuotas = parseInt(document.getElementById('cuotas').value);

  if (isNaN(monto) || monto < 10000) {
    alert('Por favor, ingresa un monto válido (mínimo $10,000).');
  } else {
    calcularCredito(monto, cuotas);
  }
});

// Función para ver el detalle de las cuotas
document.getElementById('verDetalleBtn').addEventListener('click', () => {
  const monto = parseFloat(document.getElementById('monto').value);
  const cuotas = parseInt(document.getElementById('cuotas').value);
  const interesAnual = 0.1;
  const interesTotal = monto * interesAnual * (cuotas / 12);
  const montoTotal = monto + interesTotal;
  const valorCuota = montoTotal / cuotas;

  mostrarDetalleCuotas(cuotas, valorCuota);
});

// Función para volver al simulador
document.getElementById('volverBtn').addEventListener('click', () => {
  document.getElementById('detalleCuotas').classList.add('hidden');
  document.getElementById('simuladorCredito').classList.remove('hidden');
});

// Función para mostrar el historial
document.getElementById('historialBtn').addEventListener('click', mostrarHistorial);

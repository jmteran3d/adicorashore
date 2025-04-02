// ================= MODELO =================

let historialCreditos = JSON.parse(localStorage.getItem('historialCreditos')) || [];
let ultimoCredito = null;

const Credito = function (monto, cuotas, montoTotal, valorCuota) {
  this.monto = monto;
  this.cuotas = cuotas;
  this.montoTotal = montoTotal;
  this.valorCuota = valorCuota;
};

function actualizarHistorial() {
  localStorage.setItem('historialCreditos', JSON.stringify(historialCreditos));
  mostrarHistorial(); // Mostrar historial actualizado
}

// ================= VISTAS =================

function mostrarResumen(credito) {
  document.getElementById('resumenCredito').innerHTML = `
    Monto solicitado: $${credito.monto}<br>
    Cantidad de cuotas: ${credito.cuotas}<br>
    Monto total a pagar: $${credito.montoTotal.toFixed(2)}<br>
    Valor de cada cuota: $${credito.valorCuota.toFixed(2)}
  `;
  document.getElementById('resultadoSimulacion').classList.remove('hidden');
}

function mostrarDetalleCuotas(cuotas, valorCuota) {
  const listadoCuotas = document.getElementById('listadoCuotas');
  listadoCuotas.innerHTML = '';
  for (let i = 1; i <= cuotas; i++) {
    const item = document.createElement('li');
    item.textContent = `Cuota ${i}: $${valorCuota.toFixed(2)}`;
    listadoCuotas.appendChild(item);
  }
  document.getElementById('detalleCuotas').classList.remove('hidden');
}

function mostrarHistorial() {
  const tbody = document.getElementById('historialTable').querySelector('tbody');
  tbody.innerHTML = '';

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
    document.getElementById('historialTable').classList.add('hidden');
  }
}

// ================= EVENTOS =================

document.getElementById('simularBtn').addEventListener('click', () => {
  const monto = parseFloat(document.getElementById('monto').value);
  const cuotas = parseInt(document.getElementById('cuotas').value);

  if (isNaN(monto) || monto < 10000 || isNaN(cuotas)) {
    alert('Por favor, ingresa un monto válido (mínimo $10,000) y selecciona las cuotas.');
  } else {
    const interesAnual = 0.1;
    const interesTotal = monto * interesAnual * (cuotas / 12);
    const montoTotal = monto + interesTotal;
    const valorCuota = montoTotal / cuotas;

    ultimoCredito = new Credito(monto, cuotas, montoTotal, valorCuota);
    historialCreditos.push(ultimoCredito);
    actualizarHistorial();
    mostrarResumen(ultimoCredito);
    mostrarDetalleCuotas(cuotas, valorCuota);
  }
});

document.getElementById('historialBtn').addEventListener('click', mostrarHistorial);

document.getElementById('limpiarHistorialBtn').addEventListener('click', () => {
  if (confirm("¿Estás seguro de eliminar el historial de créditos?")) {
    historialCreditos = [];
    actualizarHistorial();
    alert("Historial eliminado con éxito.");
  }
});
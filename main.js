// ================= MODELO =================
let historialCreditos = JSON.parse(localStorage.getItem("historialCreditos")) || [];
let ultimoCredito = null;

const Credito = function (monto, cuotas, montoTotal, valorCuota, idCliente, email, tasa) {
  this.monto = monto;
  this.cuotas = cuotas;
  this.montoTotal = montoTotal;
  this.valorCuota = valorCuota;
  this.idCliente = idCliente;
  this.email = email;
  this.tasa = tasa;
};

function actualizarHistorial() {
  localStorage.setItem("historialCreditos", JSON.stringify(historialCreditos));
  console.table(historialCreditos);
  mostrarHistorial();
}

Swal.fire({
  title: "Simulador de Créditos de Consumo",
  text: "Simula y Solicita tu Crédito de Consumo 100% Online.",
  icon: "info",
});

// ================= VISTAS =================
function formatearMoneda(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });
}

function mostrarResumen(credito) {
  const resumen = `
    <div style="line-height: 1.8;">
      <strong>Monto Solicitado:</strong> ${formatearMoneda(credito.monto)}<br>
      <strong>Cuota Mensual:</strong> ${formatearMoneda(credito.valorCuota)}<br>
      <strong>Número de Cuotas:</strong> ${credito.cuotas}<br>
      <strong>Tasa de Interés:</strong> ${(credito.tasa * 100).toFixed(0)}%<br>
      <strong>Total del Crédito:</strong> ${formatearMoneda(credito.montoTotal)}
    </div>
  `;
  document.getElementById("resumenCredito").innerHTML = resumen;
  document.getElementById("resultadoSimulacion").classList.remove("hidden");
  console.log("Resumen del crédito:", credito);
}

function mostrarDetalleCuotas(cuotas, valorCuota) {
  const listadoCuotas = document.getElementById("listadoCuotas");
  listadoCuotas.innerHTML = "";
  for (let i = 1; i <= cuotas; i++) {
    const item = document.createElement("li");
    item.textContent = `Cuota ${i}: $${valorCuota.toFixed(2)}`;
    listadoCuotas.appendChild(item);
  }
  console.log(`Detalle de cuotas: ${cuotas} cuotas de $${valorCuota.toFixed(2)} cada una.`);
  document.getElementById("detalleCuotas").classList.remove("hidden");
}

function mostrarHistorial() {
  const tbody = document.getElementById("historialTable").querySelector("tbody");
  tbody.innerHTML = "";

  if (historialCreditos.length > 0) {
    historialCreditos.forEach((credito) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>$${credito.monto}</td>
        <td>${credito.cuotas}</td>
        <td>$${credito.montoTotal.toFixed(2)}</td>
        <td>$${credito.valorCuota.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
    document.getElementById("historialTable").classList.remove("hidden");
  } else {
    document.getElementById("historialTable").classList.add("hidden");
  }
}

// ================= INFO ADICIONAL =================
setTimeout(() => {
  fetch('https://api.adviceslip.com/advice')
    .then(response => response.json())
    .then(data => {
      document.getElementById('consejo').innerText = `"${data.slip.advice}"`;
    })
    .catch(error => {
      console.error('Error al obtener consejo:', error);
      document.getElementById('consejo').innerText = 'No se pudo cargar el consejo. Intenta más tarde.';
    });
}, 3000);

document.addEventListener("DOMContentLoaded", () => {
  obtenerClima("Santiago");
  obtenerMonedas();
});

// ✅ Función para clima
async function obtenerClima() {
  const ciudadID = 3871336; // ID de Santiago, Chile
  const apiKey = '01d91b67c1c8dba7ab55b62777ef6186'; // Tu API key
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${ciudadID}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo conectar con el API del clima.");
    const data = await res.json();
    mostrarClima(data);
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    document.getElementById("infoClima").innerText = "No se pudo cargar el clima actual. Intenta más tarde.";
  }
}

function mostrarClima(data) {
  const climaDiv = document.getElementById("infoClima");
  const icono = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  climaDiv.innerHTML = `
    <p><strong>${data.name}:</strong> ${data.weather[0].description}</p>
    <p>🌡️ Temp: ${data.main.temp}°C</p>
    <p>💧 Humedad: ${data.main.humidity}%</p>
    <img src="${icono}" alt="Icono del clima">
  `;
}

// ✅ Función para monedas
async function obtenerMonedas() {
  const apiKey = '1b4d48b0f987ab24e5a78810';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result === 'success') {
      const usdToClp = data.conversion_rates.CLP;
      const usdToArs = data.conversion_rates.ARS;

      const urlEur = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/EUR`;
      const resEur = await fetch(urlEur);
      const dataEur = await resEur.json();

      if (dataEur.result === 'success') {
        const eurToClp = dataEur.conversion_rates.CLP;
        const eurToArs = dataEur.conversion_rates.ARS;

        mostrarMonedas({ usdToClp, usdToArs, eurToClp, eurToArs });

        Toastify({
          text: "💱 Cotizaciones actualizadas con éxito",
          duration: 3000,
          gravity: "top",
          position: "left",
          backgroundColor: "#4caf50",
        }).showToast();
      } else throw new Error('Error al obtener tasas desde EUR');
    } else throw new Error('Error al obtener tasas desde USD');
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    document.getElementById("infoMonedas").innerHTML = "No se pudo cargar la información.";

    Toastify({
      text: "❌ Error al cargar las monedas",
      duration: 4000,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
    }).showToast();
  }

  // Mostrar fecha con Luxon
  const { DateTime } = luxon;
  const ahora = DateTime.now().setLocale("es").toLocaleString(DateTime.DATETIME_MED);
  document.getElementById("infoMonedas").innerHTML += `
    <p class="text-xs mt-2 text-gray-500">📅 Última actualización: ${ahora}</p>
  `;
}

function mostrarMonedas(rates) {
  const divMoneda = document.getElementById("infoMonedas");
  divMoneda.innerHTML = `
    <p>💵 1 USD = ${rates.usdToClp.toFixed(2)} CLP | ${rates.usdToArs.toFixed(2)} ARS</p>
    <p>💶 1 EUR = ${rates.eurToClp.toFixed(2)} CLP | ${rates.eurToArs.toFixed(2)} ARS</p>
  `;
}

// ================= EVENTOS =================
document.getElementById("simularBtn").addEventListener("click", () => {
  const monto = parseFloat(document.getElementById("monto").value);
  const cuotas = parseInt(document.getElementById("cuotas").value);
  const idCliente = document.getElementById("idCliente").value.trim();
  const emailCliente = document.getElementById("emailCliente").value.trim();

  if (!idCliente || !emailCliente || !emailCliente.includes("@")) {
    Swal.fire({
      icon: "error",
      title: "Datos incompletos",
      text: "Por favor, ingresa tu número de identificación y un correo válido.",
    });
    return;
  }

  if (isNaN(monto) || monto < 10000 || isNaN(cuotas)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, ingresa un monto válido y selecciona las cuotas.",
      footer: '<a href="#">(mínimo $10,000)</a>',
    });
    return;
  }

  let tasaInteres;
  switch (cuotas) {
    case 3: tasaInteres = 0.1; break;
    case 6: tasaInteres = 0.15; break;
    case 12: tasaInteres = 0.2; break;
    case 24: tasaInteres = 0.25; break;
  }

  const interesTotal = monto * tasaInteres;
  const montoTotal = monto + interesTotal;
  const valorCuota = montoTotal / cuotas;

  ultimoCredito = new Credito(monto, cuotas, montoTotal, valorCuota, idCliente, emailCliente, tasaInteres);
  historialCreditos.push(ultimoCredito);
  actualizarHistorial();
  mostrarResumen(ultimoCredito);
  mostrarDetalleCuotas(cuotas, valorCuota);
});

document.getElementById("limpiarDatosBtn").addEventListener("click", () => {
  document.getElementById("idCliente").value = "";
  document.getElementById("emailCliente").value = "";
  document.getElementById("monto").value = "";
  document.getElementById("cuotas").selectedIndex = 0;

  document.getElementById("resultadoSimulacion").classList.add("hidden");
  document.getElementById("detalleCuotas").classList.add("hidden");
  document.getElementById("resumenCredito").innerHTML = "";
  document.getElementById("listadoCuotas").innerHTML = "";

  Swal.fire({
    icon: "success",
    title: "Datos limpiados",
    text: "Los campos y resultados han sido reiniciados correctamente.",
  });
});

document.getElementById("historialBtn").addEventListener("click", () => {
  if (historialCreditos.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Sin historial",
      text: "Aún no has simulado ningún crédito.",
      confirmButtonText: "Entendido",
    });
  } else {
    mostrarHistorial();
  }
});

document.getElementById("limpiarHistorialBtn").addEventListener("click", () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el historial de créditos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      historialCreditos = [];
      actualizarHistorial();
      Swal.fire("¡Eliminado!", "El historial ha sido borrado correctamente.", "success");
      document.getElementById("historialTable").classList.add("hidden");
      document.getElementById("resultadoSimulacion").scrollIntoView({ behavior: "smooth" });
    }
  });
});

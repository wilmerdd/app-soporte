const tabla = document.getElementById("tablaHistorial");
const incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];

incidentes.forEach(inc => {
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${inc.id}</td>
    <td>${inc.nombre}</td>
    <td>${inc.area}</td>
    <td class="prio-${inc.prioridad}">${inc.prioridad}</td>
    <td>${inc.estado}</td>
    <td>${inc.fechaApertura || "-"}</td>
    <td>${inc.fechaCierre || "-"}</td>
  `;

  tabla.appendChild(fila);
});

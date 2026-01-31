function guardarIncidente() {
  const incidentes = JSON.parse(localStorage.getItem("incidentes")) || [];

  const incidente = {
    id: "INC-" + Date.now(),
    nombre: nombre.value,
    documento: documento.value,
    contacto: contacto.value,
    correo: correo.value,
    area: area.value,
    fechaIncidente: fechaIncidente.value,
    fechaApertura: fechaApertura.value,
    fechaCierre: fechaCierre.value,
    tipo: tipo.value,
    prioridad: prioridad.value,
    estado: estado.value,
    tecnico: tecnico.value,
    descripcion: descripcion.value
  };

  incidentes.push(incidente);
  localStorage.setItem("incidentes", JSON.stringify(incidentes));

  alert("✅ Incidente registrado correctamente");
}


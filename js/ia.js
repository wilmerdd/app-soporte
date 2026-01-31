const inc = JSON.parse(localStorage.getItem("incidentes")) || [];
ia.innerHTML = `
<div class="card">
IA detectó ${inc.filter(i=>i.prioridad==="Urgente").length}
incidentes urgentes. Recomendación: aumentar soporte.
</div>`;

const inc = JSON.parse(localStorage.getItem("incidentes")) || [];
total.textContent = inc.length;
urg.textContent = inc.filter(i => i.prioridad === "Urgente").length;

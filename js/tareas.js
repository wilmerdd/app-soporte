const lista = document.getElementById("lista");

function agregar() {
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas.push({ texto: tarea.value, nivel: nivel.value });
  localStorage.setItem("tareas", JSON.stringify(tareas));
  mostrar();
}

function mostrar() {
  lista.innerHTML = "";
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas.forEach(t =>
    lista.innerHTML += `<div class="card">${t.texto} - ${t.nivel}</div>`
  );
}
mostrar();

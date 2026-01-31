// tareas.js - Gestión de Tareas

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setupTaskForm();
});

function loadTasks() {
    const lista = document.getElementById('lista');
    if (!lista) return;
    
    if (tasks.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list" style="font-size: 4rem; color: #ccc;"></i>
                <p>No hay tareas pendientes</p>
                <p class="text-muted">Agrega tu primera tarea usando el formulario</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por prioridad y fecha
    tasks.sort((a, b) => {
        const priorityOrder = { 'Urgente': 0, 'Importante': 1, 'Normal': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    lista.innerHTML = tasks.map((task, index) => `
        <div class="task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}" 
             data-index="${index}">
            <div class="task-content">
                <div class="task-header">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${index})" 
                           style="margin-right: 10px;">
                    <span class="task-title">${task.text}</span>
                </div>
                <div class="task-meta">
                    <span class="badge priority-${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>
                    <span class="task-date">
                        <i class="far fa-calendar"></i> ${new Date(task.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="editTask(${index})" class="btn-icon">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTask(${index})" class="btn-icon btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function agregar() {
    const tareaInput = document.getElementById('tarea');
    const nivelSelect = document.getElementById('nivel');
    
    if (!tareaInput || !nivelSelect) return;
    
    const text = tareaInput.value.trim();
    const priority = nivelSelect.value;
    
    if (!text) {
        showNotification('Por favor, escribe una tarea', 'warning');
        tareaInput.focus();
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false,
        date: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    
    // Limpiar formulario
    tareaInput.value = '';
    
    // Recargar lista
    loadTasks();
    
    // Mostrar notificación
    showNotification('Tarea agregada exitosamente', 'success');
    
    // Animación para nueva tarea
    const newTaskElement = document.querySelector(`[data-index="${tasks.length - 1}"]`);
    if (newTaskElement) {
        newTaskElement.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            newTaskElement.style.animation = '';
        }, 500);
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    tasks[index].completedDate = tasks[index].completed ? new Date().toISOString() : null;
    
    saveTasks();
    loadTasks();
    
    const status = tasks[index].completed ? 'completada' : 'pendiente';
    showNotification(`Tarea marcada como ${status}`, 'info');
}

function editTask(index) {
    const task = tasks[index];
    const newText = prompt('Editar tarea:', task.text);
    
    if (newText && newText.trim() && newText !== task.text) {
        task.text = newText.trim();
        task.date = new Date().toISOString(); // Actualizar fecha de modificación
        saveTasks();
        loadTasks();
        showNotification('Tarea actualizada', 'success');
    }
}

function deleteTask(index) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        const deletedTask = tasks.splice(index, 1)[0];
        saveTasks();
        loadTasks();
        
        showNotification('Tarea eliminada', 'info');
        
        // Mostrar opción de deshacer
        setTimeout(() => {
            const undo = confirm(`¿Deseas recuperar la tarea "${deletedTask.text}"?`);
            if (undo) {
                tasks.splice(index, 0, deletedTask);
                saveTasks();
                loadTasks();
                showNotification('Tarea recuperada', 'success');
            }
        }, 2000);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Actualizar contador en el título
    const pendingTasks = tasks.filter(t => !t.completed).length;
    document.title = `Tareas (${pendingTasks}) - app-soporte`;
    
    // Actualizar badge si existe
    const badge = document.querySelector('.menu a[href="tareas.html"] .badge');
    if (badge) {
        badge.textContent = pendingTasks;
    } else if (pendingTasks > 0) {
        const link = document.querySelector('.menu a[href="tareas.html"]');
        if (link) {
            link.innerHTML += ` <span class="badge">${pendingTasks}</span>`;
        }
    }
}

function setupTaskForm() {
    const tareaInput = document.getElementById('tarea');
    if (tareaInput) {
        tareaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                agregar();
            }
        });
    }
    
    // Cargar estadísticas
    updateTaskStats();
}

function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    const urgent = tasks.filter(t => t.priority === 'Urgente' && !t.completed).length;
    
    // Mostrar estadísticas si hay un elemento para ello
    const statsElement = document.getElementById('taskStats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stats-grid">
                <div class="stat">
                    <div class="stat-number">${total}</div>
                    <div class="stat-label">Total</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${pending}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${completed}</div>
                    <div class="stat-label">Completadas</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${urgent}</div>
                    <div class="stat-label">Urgentes</div>
                </div>
            </div>
        `;
    }
}

function clearCompleted() {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
        showNotification('No hay tareas completadas para limpiar', 'warning');
        return;
    }
    
    if (confirm(`¿Eliminar ${completedTasks.length} tareas completadas?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        loadTasks();
        showNotification('Tareas completadas eliminadas', 'success');
    }
}

// Exportar funciones para uso global
window.agregar = agregar;
window.toggleTask = toggleTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.clearCompleted = clearCompleted;

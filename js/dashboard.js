// dashboard.js - Funcionalidades del Dashboard

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Cargar estadísticas
    loadStatistics();
    
    // Inicializar gráficos
    initializeCharts();
    
    // Configurar eventos
    setupEventListeners();
    
    // Cargar incidentes recientes
    loadRecentIncidents();
    
    // Actualizar datos cada 30 segundos
    setInterval(loadStatistics, 30000);
}

function loadStatistics() {
    // Obtener datos de localStorage o usar valores por defecto
    const stats = {
        total: localStorage.getItem('totalIncidents') || 142,
        urgent: localStorage.getItem('urgentIncidents') || 8,
        active: localStorage.getItem('activeIncidents') || 23,
        resolved: localStorage.getItem('resolvedIncidents') || 119
    };
    
    // Actualizar UI con animación
    animateCounter('total', stats.total);
    animateCounter('urg', stats.urgent);
    
    // Mostrar estadísticas adicionales
    updateStatisticsDisplay(stats);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const current = parseInt(element.textContent) || 0;
    const increment = targetValue > current ? 1 : -1;
    let currentValue = current;
    
    const interval = setInterval(() => {
        currentValue += increment;
        element.textContent = currentValue;
        
        if (currentValue == targetValue) {
            clearInterval(interval);
        }
    }, 50);
}

function updateStatisticsDisplay(stats) {
    // Actualizar otros elementos de estadísticas si existen
    const statElements = {
        'active-incidents': stats.active,
        'resolved-incidents': stats.resolved
    };
    
    for (const [id, value] of Object.entries(statElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

function initializeCharts() {
    // Gráfico de áreas
    const ctxAreas = document.getElementById('chartAreas');
    if (ctxAreas) {
        new Chart(ctxAreas, {
            type: 'doughnut',
            data: {
                labels: ['IT', 'Soporte', 'Desarrollo', 'Administración'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.8)',
                        'rgba(76, 201, 240, 0.8)',
                        'rgba(63, 55, 201, 0.8)',
                        'rgba(75, 181, 67, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfico de tendencias
    const ctxTrends = document.getElementById('chartTrends');
    if (ctxTrends) {
        new Chart(ctxTrends, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Incidentes',
                    data: [120, 135, 142, 130, 125, 140],
                    borderColor: 'rgba(67, 97, 238, 1)',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function loadRecentIncidents() {
    // Simular carga de incidentes recientes
    const recentIncidents = [
        { id: 'INC-001', description: 'Error en servidor de correo', priority: 'Urgente', time: '10 min' },
        { id: 'INC-002', description: 'Red lenta en oficina central', priority: 'Importante', time: '25 min' },
        { id: 'INC-003', description: 'Software desactualizado', priority: 'Normal', time: '1 hora' }
    ];
    
    const container = document.getElementById('recent-incidents');
    if (container) {
        container.innerHTML = recentIncidents.map(incident => `
            <div class="task-item priority-${incident.priority.toLowerCase()}">
                <div>
                    <strong>${incident.id}</strong> - ${incident.description}
                    <div class="text-muted">Hace ${incident.time}</div>
                </div>
                <span class="badge">${incident.priority}</span>
            </div>
        `).join('');
    }
}

function setupEventListeners() {
    // Búsqueda
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Botones de acción
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
        });
    });
    
    // Chips de filtro
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterDashboard(this.textContent);
        });
    });
}

function performSearch(query) {
    if (!query.trim()) {
        showNotification('Por favor, ingresa un término de búsqueda', 'warning');
        return;
    }
    
    showNotification(`Buscando: "${query}"`, 'info');
    
    // Simular búsqueda
    setTimeout(() => {
        const results = Math.floor(Math.random() * 20) + 1;
        showNotification(`Se encontraron ${results} resultados para "${query}"`, 'success');
    }, 1000);
}

function filterDashboard(filter) {
    showNotification(`Filtrando por: ${filter}`, 'info');
    // Aquí implementarías la lógica de filtrado real
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconForType(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Insertar al inicio del container
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(notification, container.firstChild);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-10px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

function getIconForType(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'danger': return 'times-circle';
        default: return 'info-circle';
    }
}

// Exportar funciones para uso global
window.showNotification = showNotification;
// historial.js - Gestión del Historial de Incidentes

let incidents = JSON.parse(localStorage.getItem('incidents')) || [];

document.addEventListener('DOMContentLoaded', function() {
    loadIncidents();
    setupFilters();
    setupSearch();
});

function loadIncidents(filter = 'all') {
    const tbody = document.getElementById('tablaHistorial');
    if (!tbody) return;
    
    let filteredIncidents = incidents;
    
    // Aplicar filtros
    if (filter !== 'all') {
        filteredIncidents = incidents.filter(incident => incident.estado === filter);
    }
    
    if (filteredIncidents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>No hay incidentes registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Ordenar por fecha más reciente
    filteredIncidents.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
    
    // Generar tabla
    tbody.innerHTML = filteredIncidents.map(incident => `
        <tr class="incident-row" data-id="${incident.id}">
            <td><strong>${incident.id}</strong></td>
            <td>${incident.nombre}</td>
            <td>${incident.area}</td>
            <td>
                <span class="badge priority-${incident.prioridad.toLowerCase()}">
                    ${incident.prioridad}
                </span>
            </td>
            <td>
                <span class="badge estado-${incident.estado.toLowerCase()}">
                    ${incident.estado}
                </span>
            </td>
            <td>${formatDate(incident.fechaApertura)}</td>
            <td>${incident.fechaCierre ? formatDate(incident.fechaCierre) : 'Pendiente'}</td>
        </tr>
    `).join('');
    
    // Agregar eventos a las filas
    document.querySelectorAll('.incident-row').forEach(row => {
        row.addEventListener('click', function() {
            const incidentId = this.dataset.id;
            showIncidentDetails(incidentId);
        });
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            const filter = this.dataset.filter;
            loadIncidents(filter);
            
            // Mostrar contador
            const count = filter === 'all' ? 
                incidents.length : 
                incidents.filter(i => i.estado === filter).length;
            
            showNotification(`${count} incidentes ${filter === 'all' ? 'en total' : filter.toLowerCase()}`, 'info');
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchHistorial');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTable(searchTerm);
        });
    }
}

function filterTable(searchTerm) {
    const rows = document.querySelectorAll('.incident-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    const noResultsRow = document.querySelector('.no-results');
    if (visibleCount === 0) {
        if (!noResultsRow) {
            const tbody = document.getElementById('tablaHistorial');
            tbody.innerHTML += `
                <tr class="no-results">
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-search" style="font-size: 3rem; color: #ccc;"></i>
                        <p>No se encontraron incidentes que coincidan con "${searchTerm}"</p>
                    </td>
                </tr>
            `;
        }
    } else if (noResultsRow) {
        noResultsRow.remove();
    }
}

function showIncidentDetails(incidentId) {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    const detailsHtml = `
        <div class="incident-details">
            <h3>Detalles del Incidente ${incident.id}</h3>
            <div class="details-grid">
                <div><strong>Usuario:</strong> ${incident.nombre}</div>
                <div><strong>Documento:</strong> ${incident.documento}</div>
                <div><strong>Contacto:</strong> ${incident.contacto}</div>
                <div><strong>Correo:</strong> ${incident.correo}</div>
                <div><strong>Área:</strong> ${incident.area}</div>
                <div><strong>Tipo:</strong> ${incident.tipo}</div>
                <div><strong>Prioridad:</strong> ${incident.prioridad}</div>
                <div><strong>Estado:</strong> ${incident.estado}</div>
                <div><strong>Técnico:</strong> ${incident.tecnico || 'No asignado'}</div>
                <div><strong>Fecha Incidente:</strong> ${formatDate(incident.fechaIncidente)}</div>
                <div><strong>Fecha Apertura:</strong> ${formatDate(incident.fechaApertura)}</div>
                <div><strong>Fecha Cierre:</strong> ${incident.fechaCierre ? formatDate(incident.fechaCierre) : 'Pendiente'}</div>
            </div>
            <div class="description">
                <strong>Descripción:</strong>
                <p>${incident.descripcion}</p>
            </div>
            <div class="details-actions">
                <button onclick="editarIncidente('${incidentId}')" class="btn">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="generarPDF('${incidentId}')" class="btn btn-outline">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
                <button onclick="cerrarIncidente('${incidentId}')" class="btn btn-primary">
                    <i class="fas fa-check"></i> Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Mostrar modal o actualizar sección
    const container = document.querySelector('.container');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            ${detailsHtml}
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar estilos para el modal
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: var(--border-radius);
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
        }
        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-color);
        }
        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        .description {
            margin: 1rem 0;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .details-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(modal);
}

function editarIncidente(incidentId) {
    showNotification(`Editando incidente ${incidentId}...`, 'info');
    // En una implementación real, redirigirías al formulario de incidentes
    // con los datos precargados
    setTimeout(() => {
        window.location.href = `incidentes.html?edit=${incidentId}`;
    }, 500);
}

function cerrarIncidente(incidentId) {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    if (confirm(`¿Estás seguro de cerrar el incidente ${incidentId}?`)) {
        incident.estado = 'Cerrado';
        incident.fechaCierre = new Date().toISOString().split('T')[0];
        
        // Guardar cambios
        localStorage.setItem('incidents', JSON.stringify(incidents));
        
        // Recargar tabla
        loadIncidents();
        
        showNotification(`Incidente ${incidentId} cerrado exitosamente`, 'success');
        
        // Cerrar modal si está abierto
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
    }
}

// Exportar para uso global
window.generarPDF = function(incidentId) {
    showNotification(`Generando PDF para ${incidentId}...`, 'info');
    // Implementación real usando jsPDF
};

window.editarIncidente = editarIncidente;
window.cerrarIncidente = cerrarIncidente;

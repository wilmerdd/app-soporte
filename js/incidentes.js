// incidentes.js - Gestión de Incidentes

let incidents = JSON.parse(localStorage.getItem('incidents')) || [];

document.addEventListener('DOMContentLoaded', function() {
    initializeIncidentForm();
    loadFormData();
    setupFormValidation();
});

function initializeIncidentForm() {
    // Establecer fechas por defecto
    const today = new Date().toISOString().split('T')[0];
    const fechaApertura = document.getElementById('fechaApertura');
    const fechaIncidente = document.getElementById('fechaIncidente');
    
    if (fechaApertura) fechaApertura.value = today;
    if (fechaIncidente) fechaIncidente.value = today;
    
    // Auto-generar ID de incidente
    const incidentId = 'INC-' + String(incidents.length + 1).padStart(3, '0');
    const nombreInput = document.getElementById('nombre');
    if (nombreInput) {
        nombreInput.placeholder = `Ej: Juan Pérez (${incidentId})`;
    }
}

function loadFormData() {
    // Cargar datos guardados en localStorage
    const savedForm = JSON.parse(localStorage.getItem('incidentFormDraft'));
    if (savedForm) {
        Object.keys(savedForm).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = savedForm[key];
        });
        showNotification('Datos del formulario recuperados', 'info');
    }
}

function setupFormValidation() {
    const formInputs = document.querySelectorAll('#incidentForm input, #incidentForm select, #incidentForm textarea');
    
    formInputs.forEach(input => {
        // Guardar borrador mientras se escribe
        input.addEventListener('input', function() {
            saveFormDraft();
        });
        
        // Validación en tiempo real
        if (input.type === 'email') {
            input.addEventListener('blur', function() {
                validateEmail(this);
            });
        }
        
        if (input.id === 'documento') {
            input.addEventListener('blur', function() {
                validateDocument(this);
            });
        }
    });
}

function saveFormDraft() {
    const formData = {};
    const inputs = document.querySelectorAll('#incidentForm input, #incidentForm select, #incidentForm textarea');
    
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
    
    localStorage.setItem('incidentFormDraft', JSON.stringify(formData));
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value && !emailRegex.test(input.value)) {
        showNotification('Por favor, ingresa un correo válido', 'warning');
        input.style.borderColor = 'var(--warning-color)';
        return false;
    }
    input.style.borderColor = '';
    return true;
}

function validateDocument(input) {
    if (input.value && input.value.length < 5) {
        showNotification('El documento debe tener al menos 5 caracteres', 'warning');
        input.style.borderColor = 'var(--warning-color)';
        return false;
    }
    input.style.borderColor = '';
    return true;
}

function guardarIncidente() {
    // Validar formulario
    if (!validateForm()) {
        showNotification('Por favor, completa todos los campos requeridos', 'danger');
        return;
    }
    
    // Obtener datos del formulario
    const incident = {
        id: 'INC-' + String(incidents.length + 1).padStart(3, '0'),
        nombre: document.getElementById('nombre').value,
        documento: document.getElementById('documento').value,
        contacto: document.getElementById('contacto').value,
        correo: document.getElementById('correo').value,
        area: document.getElementById('area').value,
        fechaIncidente: document.getElementById('fechaIncidente').value,
        fechaApertura: document.getElementById('fechaApertura').value,
        fechaCierre: document.getElementById('fechaCierre').value || null,
        tipo: document.getElementById('tipo').value,
        prioridad: document.getElementById('prioridad').value,
        estado: document.getElementById('estado').value,
        tecnico: document.getElementById('tecnico').value,
        descripcion: document.getElementById('descripcion').value,
        fechaRegistro: new Date().toISOString()
    };
    
    // Agregar a la lista
    incidents.push(incident);
    
    // Guardar en localStorage
    localStorage.setItem('incidents', JSON.stringify(incidents));
    
    // Actualizar estadísticas
    updateStatistics(incident.prioridad);
    
    // Limpiar borrador
    localStorage.removeItem('incidentFormDraft');
    
    // Limpiar formulario
    document.querySelectorAll('#incidentForm input, #incidentForm textarea').forEach(input => {
        if (input.id !== 'fechaApertura' && input.id !== 'fechaIncidente') {
            input.value = '';
        }
    });
    
    // Mostrar confirmación
    showNotification(`Incidente ${incident.id} registrado exitosamente!`, 'success');
    
    // Opcional: Redirigir al historial después de 2 segundos
    setTimeout(() => {
        if (confirm('¿Deseas ver el historial de incidentes?')) {
            window.location.href = 'historial.html';
        }
    }, 2000);
}

function validateForm() {
    const requiredFields = ['nombre', 'documento', 'correo', 'area', 'descripcion'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

function updateStatistics(priority) {
    // Actualizar estadísticas en localStorage
    const total = parseInt(localStorage.getItem('totalIncidents') || 0) + 1;
    localStorage.setItem('totalIncidents', total);
    
    if (priority === 'Urgente') {
        const urgent = parseInt(localStorage.getItem('urgentIncidents') || 0) + 1;
        localStorage.setItem('urgentIncidents', urgent);
    }
}

// Generar PDF del incidente
function generarPDF(incidenteId) {
    const incident = incidents.find(i => i.id === incidenteId);
    if (!incident) return;
    
    const content = `
        <h1>Reporte de Incidente</h1>
        <h2>${incidenteId}</h2>
        <p><strong>Fecha:</strong> ${new Date(incident.fechaRegistro).toLocaleDateString()}</p>
        <p><strong>Usuario:</strong> ${incident.nombre}</p>
        <p><strong>Área:</strong> ${incident.area}</p>
        <p><strong>Prioridad:</strong> ${incident.prioridad}</p>
        <p><strong>Descripción:</strong> ${incident.descripcion}</p>
    `;
    
    // En una implementación real, usarías una librería como jsPDF
    showNotification('Función de generación de PDF en desarrollo', 'info');
}

// Exportar funciones para uso global
window.guardarIncidente = guardarIncidente;


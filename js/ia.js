// ia.js - Integración de IA para Sugerencias

const aiResponses = {
    greeting: [
        "¡Hola! Soy tu asistente de IA para soporte técnico. ¿En qué puedo ayudarte hoy?",
        "Bienvenido al sistema de soporte. Estoy aquí para ayudarte con tus consultas técnicas.",
        "¡Hola! Listo para resolver tus dudas sobre soporte técnico."
    ],
    suggestions: [
        "Sugerencia: Para problemas de conexión, reinicia el router y verifica los cables.",
        "Recomendación: Mantén tu software actualizado para prevenir vulnerabilidades.",
        "Consejo: Crea contraseñas fuertes con combinaciones de letras, números y símbolos.",
        "Pro tip: Documenta siempre los pasos realizados para resolver un incidente.",
        "Recomendación: Usa un sistema de tickets para organizar mejor las solicitudes."
    ],
    solutions: {
        "red lenta": "1. Reinicia el router\n2. Verifica que no haya descargas en segundo plano\n3. Contacta a tu proveedor de internet",
        "error software": "1. Reinstala la aplicación\n2. Verifica los requisitos del sistema\n3. Actualiza los controladores",
        "virus malware": "1. Ejecuta un escaneo completo\n2. Usa un antivirus actualizado\n3. Restaura el sistema a un punto anterior",
        "hardware fallando": "1. Verifica las conexiones\n2. Prueba el componente en otra máquina\n3. Contacta al soporte técnico"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeAIAssistant();
    loadAISuggestions();
});

function initializeAIAssistant() {
    const iaContainer = document.getElementById('ia');
    if (!iaContainer) return;
    
    iaContainer.innerHTML = `
        <div class="ai-assistant">
            <div class="ai-header">
                <h2><i class="fas fa-robot"></i> Asistente de IA</h2>
                <p>Obtén sugerencias inteligentes para mejorar tu sistema de soporte</p>
            </div>
            
            <div class="ai-chat">
                <div class="chat-container">
                    <div class="chat-messages" id="chatMessages">
                        <div class="message ai-message">
                            <div class="message-content">
                                <strong>Asistente IA:</strong> ${getRandomResponse('greeting')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <input type="text" id="userInput" placeholder="Escribe tu pregunta aquí...">
                        <button onclick="sendMessage()" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Enviar
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="ai-suggestions">
                <h3><i class="fas fa-lightbulb"></i> Sugerencias Automáticas</h3>
                <div id="suggestionsList"></div>
            </div>
            
            <div class="ai-stats">
                <h3><i class="fas fa-chart-bar"></i> Análisis de Datos</h3>
                <div class="stats-cards">
                    <div class="stat-card">
                        <div class="stat-number" id="avgResponseTime">--</div>
                        <div class="stat-label">Tiempo promedio de respuesta</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="commonIssue">--</div>
                        <div class="stat-label">Problema más común</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="satisfactionRate">--</div>
                        <div class="stat-label">Tasa de satisfacción</div>
                    </div>
                </div>
            </div>
            
            <div class="ai-resources">
                <h3><i class="fas fa-video"></i> Recursos Recomendados</h3>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/VIDEO_ID_IA" 
                            title="Soporte Técnico - Mejores Prácticas"
                            allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;
    
    // Configurar entrada de chat
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Cargar análisis de datos
    loadAIDataAnalysis();
}

function getRandomResponse(type) {
    const responses = aiResponses[type];
    return responses[Math.floor(Math.random() * responses.length)];
}

function loadAISuggestions() {
    const suggestionsList = document.getElementById('suggestionsList');
    if (!suggestionsList) return;
    
    const suggestions = aiResponses.suggestions;
    suggestionsList.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-card">
            <i class="fas fa-magic"></i>
            <p>${suggestion}</p>
        </div>
    `).join('');
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!userInput || !userInput.value.trim() || !chatMessages) return;
    
    const userMessage = userInput.value.trim();
    
    // Agregar mensaje del usuario
    chatMessages.innerHTML += `
        <div class="message user-message">
            <div class="message-content">
                <strong>Tú:</strong> ${userMessage}
            </div>
        </div>
    `;
    
    // Limpiar entrada
    userInput.value = '';
    
    // Simular procesamiento
    setTimeout(() => {
        const aiResponse = generateAIResponse(userMessage);
        chatMessages.innerHTML += `
            <div class="message ai-message">
                <div class="message-content">
                    <strong>Asistente IA:</strong> ${aiResponse}
                </div>
            </div>
        `;
        
        // Auto-scroll al último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Agregar a historial
        saveToChatHistory(userMessage, aiResponse);
    }, 1000);
    
    // Auto-scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Detectar palabras clave
    if (message.includes('hola') || message.includes('buenos') || message.includes('saludos')) {
        return getRandomResponse('greeting');
    }
    
    if (message.includes('red') && (message.includes('lenta') || message.includes('internet'))) {
        return aiResponses.solutions["red lenta"];
    }
    
    if (message.includes('error') || message.includes('software')) {
        return aiResponses.solutions["error software"];
    }
    
    if (message.includes('virus') || message.includes('malware')) {
        return aiResponses.solutions["virus malware"];
    }
    
    if (message.includes('hardware') || message.includes('falla')) {
        return aiResponses.solutions["hardware fallando"];
    }
    
    if (message.includes('sugerencia') || message.includes('consejo')) {
        return getRandomResponse('suggestions');
    }
    
    // Respuesta por defecto
    const defaultResponses = [
        "Entiendo tu consulta. Te recomiendo revisar la documentación oficial o contactar con un técnico especializado.",
        "Esa es una buena pregunta. Podría sugerirte revisar los logs del sistema para más detalles.",
        "Para ese tipo de problemas, es útil tener un registro detallado de los pasos realizados.",
        "Te sugiero buscar en nuestro conocimiento base o crear un ticket de soporte para atención personalizada.",
        "Podrías intentar reiniciar el servicio o aplicación relacionada. Si persiste, contacta con soporte."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function saveToChatHistory(userMessage, aiResponse) {
    const chatHistory = JSON.parse(localStorage.getItem('aiChatHistory')) || [];
    chatHistory.push({
        timestamp: new Date().toISOString(),
        user: userMessage,
        ai: aiResponse
    });
    
    // Mantener solo los últimos 50 mensajes
    if (chatHistory.length > 50) {
        chatHistory.splice(0, chatHistory.length - 50);
    }
    
    localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
}

function loadAIDataAnalysis() {
    // Simular análisis de datos
    setTimeout(() => {
        document.getElementById('avgResponseTime').textContent = '2h 15m';
        document.getElementById('commonIssue').textContent = 'Red lenta';
        document.getElementById('satisfactionRate').textContent = '92%';
    }, 500);
}

// Exportar función para uso global
window.sendMessage = sendMessage;
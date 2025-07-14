let websocket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let reconnectTimeout;

const connectionStatus = document.getElementById('connection-status');
const notificationList = document.getElementById('notification-list');

const connectionStates = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting'
};

const statusMessages = {
    [connectionStates.CONNECTED]: 'Подключено',
    [connectionStates.DISCONNECTED]: 'Отключено',
    [connectionStates.CONNECTING]: 'Подключение...'
};

function initWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.hostname}:8080`;

    updateConnectionStatus(connectionStates.CONNECTING);

    websocket = new WebSocket(wsUrl);

    // Handle connection opening
    websocket.onopen = function () {
        updateConnectionStatus(connectionStates.CONNECTED);
        reconnectAttempts = 0;
    };

    // Handle incoming messages
    websocket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        const handlers = {
            'history': handleHistoryMessage,
            'notification': handleNotificationMessage,
            'default': handleUnknownMessage
        };

        const handler = handlers[message.type] || handlers.default;
        handler(message.data || message);
    };


    // Handle errors
    websocket.onerror = function (error) {
        console.error('WebSocket error:', error);
        updateConnectionStatus(connectionStates.DISCONNECTED);
    };

    // Handle connection closing
    websocket.onclose = function () {
        updateConnectionStatus(connectionStates.DISCONNECTED);
        attemptReconnection();
    };
}

function attemptReconnection() {
    if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

        reconnectTimeout = setTimeout(initWebSocket, delay);
    }
}

function handleHistoryMessage(notifications) {
    displayNotificationHistory(notifications);
}

function handleNotificationMessage(notification) {
    addNotification(notification);
}

function handleUnknownMessage(data) {
    if (data.text && data.timestamp) {
        addNotification(data);
    }
}

// Updates connection status in the interface
function updateConnectionStatus(status) {
    connectionStatus.className = status;
    connectionStatus.textContent = statusMessages[status];
}

// Displays notification history
function displayNotificationHistory(notifications) {
    clearNotifications();

    if (notifications && notifications.length > 0) {
        notifications
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .forEach(notification => addNotification(notification, false));
    }
}

// Adds a new notification to the list
function addNotification(notification, isNew = true) {
    const emptyMessage = notificationList.querySelector('.empty-message');
    if (emptyMessage) {
        notificationList.removeChild(emptyMessage);
    }

    const notificationItem = createNotificationElement(notification);
    notificationList.insertBefore(notificationItem, notificationList.firstChild);
    notificationList.scrollTop = 0;
}

// Creates notification element in the interface
function createNotificationElement(notification) {
    const item = document.createElement('div');
    item.className = 'notification-item';

    const text = document.createElement('div');
    text.className = 'notification-text';
    text.textContent = notification.text;

    const time = document.createElement('div');
    time.className = 'notification-time';
    time.textContent = formatTimestamp(notification.timestamp);

    item.appendChild(text);
    item.appendChild(time);

    return item;
}

// Formats timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const timeOptions = {hour: '2-digit', minute: '2-digit'};

    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], timeOptions);
    }

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], timeOptions);
}

// Clears the notification list
function clearNotifications() {
    notificationList.innerHTML = '';

    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'Нет уведомлений';
    notificationList.appendChild(emptyMessage);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initWebSocket();

    window.addEventListener('beforeunload', function () {
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }
    });
});

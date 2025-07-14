# WebSocket Notification System

A lightweight WebSocket-based notification system that provides real-time messaging between server and clients. This project demonstrates how to implement a simple notification service using PHP Ratchet and JavaScript.

## Features

- Real-time notification delivery via WebSockets
- Persistent notification history for new connections
- Automatic reconnection with exponential backoff
- Clean and responsive UI
- Admin panel for sending notifications

Requirements

- PHP 7.4+
- Composer
- Modern web browser with WebSocket support

Installation

1. Clone the repository:

```bash
git clone https://github.com/yognevoy/websocket-notification-system.git
cd websocket-notification-system
```

2. Install dependencies:

```bash
composer install
```

3. Start the WebSocket server:

```bash
php server.php
```

4. Open the client application in your browser:

```
http://localhost/path-to-project/client/index.html
```

## How It Works

1. The server initializes a WebSocket connection on port 8080
2. Clients connect to the server and receive the notification history
3. When a notification is sent through the admin panel, it's broadcast to all connected clients
4. The server maintains a history of all notifications sent during its runtime
5. Clients automatically attempt to reconnect if the connection is lost

## Usage

### Sending Notifications

Use the admin panel at the bottom of the client interface to send new notifications:

1. Enter your notification text
2. Click "Send Notification"

### Receiving Notifications

All connected clients will receive notifications in real-time. New clients will automatically receive the notification history upon connecting.
Technical Details

This project utilizes:

- PHP Ratchet for WebSocket server implementation
- Exponential backoff algorithm for connection retries


## How to Contribute

If you find a bug or have a feature request, please check the [Issues page](https://github.com/yognevoy/websocket-notification-system/issues) before creating a new one. For code contributions, fork the repository, make your changes on a new branch, and submit a pull request with a clear description of the changes. Please make sure to test your changes thoroughly before submitting.

## License
This project is licensed under the MIT License - see the [LICENSE.txt](https://github.com/yognevoy/websocket-notification-system/blob/main/LICENSE.txt) file for details.

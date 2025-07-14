<?php

namespace NotificationSystem;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class NotificationServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected array $notifications;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->notifications = [];
        echo "Notification Server initialized\n";
    }

    /**
     * Handles new client connections
     * Attaches the client to storage and sends notification history
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);
        $clientCount = count($this->clients);
        echo "New connection! ({$conn->resourceId}) - Total clients: {$clientCount}\n";

        $historyMessage = json_encode([
            'type' => 'history',
            'data' => $this->notifications
        ]);
        $conn->send($historyMessage);
    }

    /**
     * Handles incoming messages from clients
     * Processes notification messages and broadcasts them to all connected clients
     *
     * @param ConnectionInterface $from
     * @param string $msg
     * @return void
     */
    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, true);
        if (isset($data['type']) && $data['type'] === 'notification') {
            $notification = new Notification($data['text']);
            $this->notifications[] = $notification;
            $notificationJson = json_encode($notification);
            echo "Broadcasting notification: {$data['text']}\n";

            foreach ($this->clients as $client) {
                $client->send($notificationJson);
            }
        }
    }

    /**
     * Handles client disconnections
     * Detaches the client from storage
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
        $clientCount = count($this->clients);
        echo "Connection {$conn->resourceId} has disconnected - Total clients: {$clientCount}\n";
    }

    /**
     * Handles errors in connections
     * Logs the error and closes the connection
     *
     * @param ConnectionInterface $conn
     * @param \Exception $e
     * @return void
     */
    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}

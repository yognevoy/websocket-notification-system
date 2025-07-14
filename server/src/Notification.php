<?php

namespace NotificationSystem;

class Notification implements \JsonSerializable
{
    private string $text;
    private string $timestamp;

    public function __construct($text)
    {
        $this->text = $text;
        $this->timestamp = date('Y-m-d H:i:s');
    }

    /**
     * Returns the notification text content
     *
     * @return string
     */
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * Returns the timestamp when the notification was created
     *
     * @return string
     */
    public function getTimestamp(): string
    {
        return $this->timestamp;
    }

    public function jsonSerialize(): array
    {
        return [
            'text' => $this->text,
            'timestamp' => $this->timestamp
        ];
    }
}

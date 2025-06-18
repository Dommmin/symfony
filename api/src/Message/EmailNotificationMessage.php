<?php

declare(strict_types=1);

namespace App\Message;

class EmailNotificationMessage
{
    public function __construct(
        private readonly string $recipient,
        private readonly string $subject,
        private readonly string $content
    ) {
    }

    public function getRecipient(): string
    {
        return $this->recipient;
    }

    public function getSubject(): string
    {
        return $this->subject;
    }

    public function getContent(): string
    {
        return $this->content;
    }
}

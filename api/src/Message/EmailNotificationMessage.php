<?php

declare(strict_types=1);

namespace App\Message;

class EmailNotificationMessage
{
    public function __construct(
        public readonly string $recipient,
        public readonly string $subject,
        public readonly string $template,
        public readonly array $context = [],
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

    public function getTemplate(): string
    {
        return $this->template;
    }

    public function getContext(): array
    {
        return $this->context;
    }
}

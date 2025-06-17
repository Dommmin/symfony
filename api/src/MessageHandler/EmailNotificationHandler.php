<?php

namespace App\MessageHandler;

use App\Message\EmailNotificationMessage;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Psr\Log\LoggerInterface;

#[AsMessageHandler]
class EmailNotificationHandler
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private LoggerInterface $logger
    ) {}

    public function __invoke(EmailNotificationMessage $message): void
    {
        $email = (new Email())
            ->to($message->getRecipient())
            ->subject($message->getSubject())
            ->text($message->getContent());
        try {
            $this->mailer->send($email);
            $this->logger->info('Email sent', ['to' => $message->getRecipient(), 'subject' => $message->getSubject()]);
        } catch (TransportExceptionInterface $e) {
            $this->logger->error('Email send failed', ['error' => $e->getMessage()]);
        }
    }
} 
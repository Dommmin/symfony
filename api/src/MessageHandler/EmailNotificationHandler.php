<?php

declare(strict_types=1);

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
        private readonly LoggerInterface $logger
    ) {}

    public function __invoke(EmailNotificationMessage $emailNotificationMessage): void
    {
        $email = (new Email())
            ->to($emailNotificationMessage->getRecipient())
            ->subject($emailNotificationMessage->getSubject())
            ->text($emailNotificationMessage->getContent());
        try {
            $this->mailer->send($email);
            $this->logger->info('Email sent', ['to' => $emailNotificationMessage->getRecipient(), 'subject' => $emailNotificationMessage->getSubject()]);
        } catch (TransportExceptionInterface $transportException) {
            $this->logger->error('Email send failed', ['error' => $transportException->getMessage()]);
        }
    }
}

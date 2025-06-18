<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Message\EmailNotificationMessage;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsMessageHandler]
class EmailNotificationHandler
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly LoggerInterface $logger,
        private readonly ParameterBagInterface $params
    ) {}

    public function __invoke(EmailNotificationMessage $emailNotificationMessage): void
    {
        $email = (new TemplatedEmail())
            ->from($this->params->get('mailer.from_address'))
            ->to($emailNotificationMessage->getRecipient())
            ->subject($emailNotificationMessage->getSubject())
            ->htmlTemplate($emailNotificationMessage->getTemplate())
            ->context($emailNotificationMessage->getContext());
        try {
            $this->mailer->send($email);
            $this->logger->info('Email sent', [
                'from' => $this->params->get('mailer.from_address'),
                'to' => $emailNotificationMessage->getRecipient(), 
                'subject' => $emailNotificationMessage->getSubject()
            ]);
        } catch (TransportExceptionInterface $transportException) {
            $this->logger->error('Email send failed', ['error' => $transportException->getMessage()]);
            throw $transportException;
        }
    }
}

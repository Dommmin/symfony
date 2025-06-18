<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Issue;
use Symfony\Component\Uid\Uuid;

class IssueResponseDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $title,
        public readonly string $description,
        public readonly string $status,
        public readonly string $priority,
        public readonly string $createdAt,
        public readonly array $user,
        public readonly ?array $technician,
    ) {
    }

    public static function fromEntity(Issue $issue): self
    {
        return new self(
            id: Uuid::fromBinary($issue->getId()->toBinary())->toRfc4122(),
            title: $issue->getTitle(),
            description: $issue->getDescription(),
            status: $issue->getStatus()->value,
            priority: $issue->getPriority()->value,
            createdAt: $issue->getCreatedAt()->format(DATE_ATOM),
            user: [
                'id' => $issue->getUser()->getId(),
                'email' => $issue->getUser()->getEmail(),
            ],
            technician: $issue->getTechnician() ? [
                'id' => $issue->getTechnician()->getId(),
                'firstName' => $issue->getTechnician()->getFirstName(),
                'lastName' => $issue->getTechnician()->getLastName(),
            ] : null,
        );
    }
} 
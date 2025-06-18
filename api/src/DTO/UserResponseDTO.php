<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\User;

class UserResponseDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $email,
        public readonly array $roles,
    ) {
    }

    public static function fromEntity(User $user): self
    {
        return new self(
            id: $user->getId(),
            email: $user->getEmail(),
            roles: $user->getRoles(),
        );
    }
} 
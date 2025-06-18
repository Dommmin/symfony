<?php

declare(strict_types=1);

namespace App\DTO;

use App\Entity\Technician;

class TechnicianResponseDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $firstName,
        public readonly string $lastName,
        public readonly string $email,
        public readonly string $specialization,
    ) {
    }

    public static function fromEntity(Technician $technician): self
    {
        return new self(
            id: $technician->getId(),
            firstName: $technician->getFirstName(),
            lastName: $technician->getLastName(),
            email: $technician->getEmail(),
            specialization: $technician->getSpecialization(),
        );
    }
} 
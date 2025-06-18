<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateTechnicianRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 2, max: 50)]
        public string $firstName,

        #[Assert\NotBlank]
        #[Assert\Length(min: 2, max: 50)]
        public string $lastName,

        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,

        #[Assert\NotBlank]
        #[Assert\Length(min: 2, max: 100)]
        public string $specialization,
    ) {
    }
} 
<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateTechnicianRequest
{
    public function __construct(
        #[Assert\Length(min: 2, max: 50)]
        public ?string $firstName = null,

        #[Assert\Length(min: 2, max: 50)]
        public ?string $lastName = null,

        #[Assert\Email]
        public ?string $email = null,

        #[Assert\Length(min: 2, max: 100)]
        public ?string $specialization = null,
    ) {
    }
} 
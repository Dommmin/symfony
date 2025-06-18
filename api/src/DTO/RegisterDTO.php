<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public readonly string $email,

        #[Assert\NotBlank]
        #[Assert\Length(min: 6)]
        public readonly string $password,
    ) {
    }
} 
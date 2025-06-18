<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class PaginationRequestDTO
{
    public function __construct(
        #[Assert\PositiveOrZero]
        public readonly int $page = 1,

        #[Assert\Range(min: 1, max: 50)]
        public readonly int $limit = 10,
    ) {
    }
} 
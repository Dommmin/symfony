<?php

declare(strict_types=1);

namespace App\DTO;

use Pagerfanta\Pagerfanta;

class PaginatedResponseDTO
{
    /**
     * @param array<mixed> $items
     */
    public function __construct(
        public readonly array $items,
        public readonly array $pagination,
    ) {
    }

    public static function fromPagerfanta(Pagerfanta $pagerfanta, array $items): self
    {
        return new self(
            items: $items,
            pagination: [
                'current_page' => $pagerfanta->getCurrentPage(),
                'per_page' => $pagerfanta->getMaxPerPage(),
                'total_pages' => $pagerfanta->getNbPages(),
                'total_items' => $pagerfanta->getNbResults(),
                'has_previous_page' => $pagerfanta->hasPreviousPage(),
                'has_next_page' => $pagerfanta->hasNextPage(),
            ],
        );
    }
} 
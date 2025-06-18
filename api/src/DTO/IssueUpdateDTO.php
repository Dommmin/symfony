<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\IssueStatus;

class IssueUpdateDTO
{
    #[Assert\Choice(callback: IssueStatus::class . '::values')]
    public ?string $status = null;

    #[Assert\Positive]
    public ?int $technicianId = null;
}

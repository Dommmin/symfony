<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\IssueStatus;
use App\Entity\IssuePriority;

class IssueUpdateDTO
{
    #[Assert\Choice(choices: ['new', 'in_progress', 'done', 'closed'])]
    public ?string $status = null;

    #[Assert\Choice(choices: ['low', 'medium', 'high', 'critical'])]
    public ?string $priority = null;

    #[Assert\Positive]
    public ?int $technicianId = null;
}

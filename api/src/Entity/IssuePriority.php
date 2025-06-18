<?php

declare(strict_types=1);

namespace App\Entity;

enum IssuePriority: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case CRITICAL = 'critical';
}

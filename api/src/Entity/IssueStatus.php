<?php

declare(strict_types=1);

namespace App\Entity;

enum IssueStatus: string
{
    case NEW = 'new';
    case IN_PROGRESS = 'in_progress';
    case DONE = 'done';
    case CLOSED = 'closed';
}

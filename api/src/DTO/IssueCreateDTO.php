<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class IssueCreateDTO
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    public string $title;

    #[Assert\NotBlank]
    #[Assert\Length(min: 10)]
    public string $description;
}

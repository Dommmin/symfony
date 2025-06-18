<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use App\Repository\IssueRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: IssueRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Issue
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[Groups(['user:read', 'admin:read'])]
    private ?Uuid $id = null;

    #[ORM\Column(name: 'status', enumType: IssueStatus::class)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    private IssueStatus $issueStatus = IssueStatus::NEW;

    #[ORM\Column(name: 'priority', enumType: IssuePriority::class)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    private IssuePriority $issuePriority = IssuePriority::LOW;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    #[Assert\NotBlank]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'assignedIssues')]
    #[Groups(['user:read', 'admin:read'])]
    private ?Technician $technician = null;

    #[ORM\ManyToOne(inversedBy: 'issues')]
    #[Groups(['user:read', 'admin:read'])]
    #[Assert\NotBlank]
    private ?User $user = null;

    public function __construct()
    {
        $this->id = Uuid::v7();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getStatus(): IssueStatus
    {
        return $this->issueStatus;
    }

    public function setStatus(IssueStatus $issueStatus): static
    {
        $this->issueStatus = $issueStatus;

        return $this;
    }

    public function getPriority(): IssuePriority
    {
        return $this->issuePriority;
    }

    public function setPriority(IssuePriority $issuePriority): static
    {
        $this->issuePriority = $issuePriority;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getTechnician(): ?Technician
    {
        return $this->technician;
    }

    public function setTechnician(?Technician $technician): self
    {
        $this->technician = $technician;
        return $this;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }
}

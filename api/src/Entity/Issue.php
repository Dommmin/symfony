<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use App\Repository\IssueRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: IssueRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Issue
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'admin:read'])]
    private ?int $id = null; /** @phpstan-ignore-line */

    #[ORM\Column(enumType: IssueStatus::class)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    private IssueStatus $issueStatus = IssueStatus::NEW;

    #[ORM\ManyToOne(targetEntity: Technician::class, inversedBy: 'issues')]
    #[Groups(['user:read', 'admin:read'])]
    private ?Technician $technician = null;

    public function __construct(
        #[ORM\Column(length: 255)]
        #[Groups(['user:read', 'issue:write', 'admin:read'])]
        private string $title,
        #[ORM\Column(type: Types::TEXT)]
        #[Groups(['user:read', 'issue:write', 'admin:read'])]
        private string $description,
        #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'issues')]
        #[ORM\JoinColumn(nullable: false)]
        #[Groups(['admin:read'])]
        private ?User $user
    )
    {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): IssueStatus
    {
        return $this->issueStatus;
    }

    public function setStatus(IssueStatus $issueStatus): self
    {
        $this->issueStatus = $issueStatus;
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

<?php

namespace App\Entity;

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
    private ?int $id = null;

    #[ORM\Column(enumType: IssueStatus::class)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    private IssueStatus $status;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'issues')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['admin:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Technician::class, inversedBy: 'issues')]
    #[Groups(['user:read', 'admin:read'])]
    private ?Technician $technician = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    private string $title;

    #[ORM\Column(type: 'text')]
    #[Groups(['user:read', 'issue:write', 'admin:read'])]
    private string $description;

    public function __construct(string $title, string $description, User $user)
    {
        $this->title = $title;
        $this->description = $description;
        $this->user = $user;
        $this->status = IssueStatus::NEW;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): IssueStatus
    {
        return $this->status;
    }

    public function setStatus(IssueStatus $status): self
    {
        $this->status = $status;
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

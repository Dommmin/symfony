<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\IssueCreateDTO;
use App\DTO\IssueResponseDTO;
use App\DTO\PaginatedResponseDTO;
use App\DTO\PaginationRequestDTO;
use App\Entity\Issue;
use App\Entity\IssueStatus;
use App\Entity\User;
use App\Repository\IssueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Pagerfanta\Doctrine\ORM\QueryAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Component\Uid\Uuid;

class IssueService
{
    public function __construct(
        private readonly IssueRepository $issueRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function getPaginatedIssues(PaginationRequestDTO $paginationDTO): PaginatedResponseDTO
    {
        $queryBuilder = $this->issueRepository->createQueryBuilder('i')
            ->orderBy('i.createdAt', 'DESC');

        $pagerfanta = new Pagerfanta(new QueryAdapter($queryBuilder));
        $pagerfanta->setMaxPerPage($paginationDTO->limit);
        $pagerfanta->setCurrentPage($paginationDTO->page);

        $results = iterator_to_array($pagerfanta->getCurrentPageResults());
        $items = array_map(
            fn(Issue $issue): IssueResponseDTO => IssueResponseDTO::fromEntity($issue),
            $results
        );

        return PaginatedResponseDTO::fromPagerfanta($pagerfanta, $items);
    }

    public function getIssue(Uuid $id): ?Issue
    {
        return $this->issueRepository->find($id);
    }

    public function createIssue(IssueCreateDTO $dto, User $user): Issue
    {
        $issue = new Issue();
        $issue->setTitle($dto->title);
        $issue->setDescription($dto->description);
        $issue->setUser($user);
        $issue->setStatus(IssueStatus::NEW);

        $this->entityManager->persist($issue);
        $this->entityManager->flush();

        return $issue;
    }

    public function updateIssue(Issue $issue): void
    {
        $this->entityManager->flush();
    }
} 
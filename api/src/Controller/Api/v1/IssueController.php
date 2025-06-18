<?php

declare(strict_types=1);

namespace App\Controller\Api\v1;

use App\DTO\IssueCreateDTO;
use App\DTO\IssueUpdateDTO;
use App\Entity\Issue;
use App\Entity\IssueStatus;
use App\Entity\Technician;
use App\Repository\IssueRepository;
use App\Repository\TechnicianRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Messenger\MessageBusInterface;
use App\Message\EmailNotificationMessage;
use App\Entity\User;
use Pagerfanta\Doctrine\ORM\QueryAdapter;
use Pagerfanta\Pagerfanta;

#[Route('/issues', name: 'issues_')]
class IssueController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(Request $request, IssueRepository $issueRepository): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, (int)$request->query->get('limit', 10));
        
        $queryBuilder = $issueRepository->createQueryBuilder('i')
            ->orderBy('i.id', 'DESC');

//        // Apply filters
//        if ($requestedUser = $request->query->get('user')) {
//            $queryBuilder->andWhere('i.user = :user')
//                ->setParameter('user', $requestedUser);
//        } else {
//            $queryBuilder->andWhere('i.user = :user')
//                ->setParameter('user', $user);
//        }
//
//        if ($status = $request->query->get('status')) {
//            $queryBuilder->andWhere('i.issueStatus = :status')
//                ->setParameter('status', $status);
//        }

        $pagerfanta = new Pagerfanta(new QueryAdapter($queryBuilder));
        $pagerfanta->setMaxPerPage($limit);
        $pagerfanta->setCurrentPage($page);

        $results = iterator_to_array($pagerfanta->getCurrentPageResults());

        $data = array_map(fn($i): array => [
            'id' => $i->getId(),
            'title' => $i->getTitle(),
            'description' => $i->getDescription(),
            'status' => $i->getStatus()->value,
            'createdAt' => $i->getCreatedAt()->format(DATE_ATOM),
            'user' => $i->getUser()->getId(),
            'technician' => $i->getTechnician()?->getId(),
        ], $results);

        return $this->json([
            'items' => $data,
            'pagination' => [
                'current_page' => $pagerfanta->getCurrentPage(),
                'per_page' => $pagerfanta->getMaxPerPage(),
                'total_pages' => $pagerfanta->getNbPages(),
                'total_items' => $pagerfanta->getNbResults(),
                'has_previous_page' => $pagerfanta->hasPreviousPage(),
                'has_next_page' => $pagerfanta->hasNextPage(),
            ]
        ]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'Invalid user'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $issueCreateDTO = new IssueCreateDTO();
        $issueCreateDTO->title = $data['title'] ?? '';
        $issueCreateDTO->description = $data['description'] ?? '';

        $constraintViolationList = $validator->validate($issueCreateDTO);
        if (count($constraintViolationList) > 0) {
            return $this->json(['errors' => (string)$constraintViolationList], Response::HTTP_BAD_REQUEST);
        }

        $issue = new Issue($issueCreateDTO->title, $issueCreateDTO->description, $user);
        $issue->setStatus(IssueStatus::NEW);

        $entityManager->persist($issue);
        $entityManager->flush();
        return $this->json(['id' => $issue->getId()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function update(int $id, Request $request, EntityManagerInterface $entityManager, IssueRepository $issueRepository, TechnicianRepository $technicianRepository, ValidatorInterface $validator, MessageBusInterface $messageBus): Response
    {
        $issue = $issueRepository->find($id);
        if ($issue === null) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        if ($issue->getUser() !== $this->getUser() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $issueUpdateDTO = new IssueUpdateDTO();
        $issueUpdateDTO->status = $data['status'] ?? null;
        $issueUpdateDTO->technicianId = $data['technicianId'] ?? null;

        $constraintViolationList = $validator->validate($issueUpdateDTO);
        if (count($constraintViolationList) > 0) {
            return $this->json(['errors' => (string)$constraintViolationList], Response::HTTP_BAD_REQUEST);
        }

        if ($issueUpdateDTO->status) {
            $issue->setStatus(IssueStatus::from($issueUpdateDTO->status));
            $messageBus->dispatch(new EmailNotificationMessage(
                $issue->getUser()->getEmail(),
                'Zmiana statusu zgłoszenia',
                sprintf('Status Twojego zgłoszenia #%d został zmieniony na: %s', $issue->getId(), $issue->getStatus()->value)
            ));
        }

        if ($issueUpdateDTO->technicianId) {
            $technician = $technicianRepository->find($issueUpdateDTO->technicianId);
            if ($technician === null) {
                return $this->json(['error' => 'Technician not found'], Response::HTTP_BAD_REQUEST);
            }

            $issue->setTechnician($technician);
        }

        $entityManager->flush();
        return $this->json(['status' => 'updated']);
    }
}

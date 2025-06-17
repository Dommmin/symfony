<?php

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

#[Route('/issues', name: 'issues_')]
class IssueController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(Request $request, IssueRepository $repo): Response
    {
        $user = $this->getUser();
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = min(50, (int)$request->query->get('limit', 10));
        $criteria = [];
        if ($request->query->get('user')) {
            $criteria['user'] = $request->query->get('user');
        } else {
            $criteria['user'] = $user;
        }
        if ($request->query->get('status')) {
            $criteria['status'] = $request->query->get('status');
        }
        $issues = $repo->findBy($criteria, ['id' => 'DESC'], $limit, ($page-1)*$limit);
        $data = array_map(fn($i) => [
            'id' => $i->getId(),
            'title' => $i->getTitle(),
            'description' => $i->getDescription(),
            'status' => $i->getStatus()->value,
            'createdAt' => $i->getCreatedAt()->format(DATE_ATOM),
            'user' => $i->getUser()->getId(),
            'technician' => $i->getTechnician()?->getId(),
        ], $issues);
        return $this->json(['items' => $data, 'page' => $page, 'limit' => $limit]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        $dto = new IssueCreateDTO();
        $dto->title = $data['title'] ?? '';
        $dto->description = $data['description'] ?? '';
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string)$errors], Response::HTTP_BAD_REQUEST);
        }
        $issue = new Issue($dto->title, $dto->description, $this->getUser());
        $issue->setStatus(IssueStatus::NEW);
        $em->persist($issue);
        $em->flush();
        return $this->json(['id' => $issue->getId()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function update(int $id, Request $request, EntityManagerInterface $em, IssueRepository $repo, TechnicianRepository $techRepo, ValidatorInterface $validator, MessageBusInterface $bus): Response
    {
        $issue = $repo->find($id);
        if (!$issue) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        if ($issue->getUser() !== $this->getUser() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }
        $data = json_decode($request->getContent(), true);
        $dto = new IssueUpdateDTO();
        $dto->status = $data['status'] ?? null;
        $dto->technicianId = $data['technicianId'] ?? null;
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string)$errors], Response::HTTP_BAD_REQUEST);
        }
        if ($dto->status) {
            $issue->setStatus(IssueStatus::from($dto->status));
            $bus->dispatch(new EmailNotificationMessage(
                $issue->getUser()->getEmail(),
                'Zmiana statusu zgłoszenia',
                sprintf('Status Twojego zgłoszenia #%d został zmieniony na: %s', $issue->getId(), $issue->getStatus()->value)
            ));
        }
        if ($dto->technicianId) {
            $technician = $techRepo->find($dto->technicianId);
            if (!$technician) {
                return $this->json(['error' => 'Technician not found'], Response::HTTP_BAD_REQUEST);
            }
            $issue->setTechnician($technician);
        }
        $em->flush();
        return $this->json(['status' => 'updated']);
    }
} 
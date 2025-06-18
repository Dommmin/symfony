<?php

declare(strict_types=1);

namespace App\Controller\Api\v1;

use App\DTO\CreateTechnicianRequest;
use App\DTO\TechnicianResponseDTO;
use App\DTO\UpdateTechnicianRequest;
use App\Entity\Technician;
use App\Repository\TechnicianRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/technicians', name: 'technicians_')]
#[IsGranted('ROLE_ADMIN')]
class TechnicianController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TechnicianRepository $technicianRepository,
    ) {
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $technicians = $this->technicianRepository->findAll();

        return $this->json([
            'items' => array_map(
                fn (Technician $technician) => TechnicianResponseDTO::fromEntity($technician),
                $technicians
            ),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Technician $technician): JsonResponse
    {
        return $this->json(TechnicianResponseDTO::fromEntity($technician));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(#[MapRequestPayload] CreateTechnicianRequest $request): JsonResponse
    {
        $technician = new Technician();
        $technician->setFirstName($request->firstName);
        $technician->setLastName($request->lastName);
        $technician->setEmail($request->email);
        $technician->setSpecialization($request->specialization);

        $this->entityManager->persist($technician);
        $this->entityManager->flush();

        return $this->json(
            TechnicianResponseDTO::fromEntity($technician),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update(
        Technician $technician,
        #[MapRequestPayload] UpdateTechnicianRequest $request
    ): JsonResponse {
        if ($request->firstName !== null) {
            $technician->setFirstName($request->firstName);
        }

        if ($request->lastName !== null) {
            $technician->setLastName($request->lastName);
        }

        if ($request->email !== null) {
            $technician->setEmail($request->email);
        }

        if ($request->specialization !== null) {
            $technician->setSpecialization($request->specialization);
        }

        $this->entityManager->flush();

        return $this->json(TechnicianResponseDTO::fromEntity($technician));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Technician $technician): JsonResponse
    {
        $this->entityManager->remove($technician);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 
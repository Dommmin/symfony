<?php

declare(strict_types=1);

namespace App\Controller\Api\v1;

use App\DTO\UserResponseDTO;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class MeController extends AbstractController
{
    #[Route('/v1/me', name: 'api_v1_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Not authenticated');
        }

        return $this->json(UserResponseDTO::fromEntity($user));
    }
}

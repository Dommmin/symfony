<?php

declare(strict_types=1);

namespace App\Controller\Api\v1;

use Exception;
use App\DTO\LoginDTO;
use App\DTO\RegisterDTO;
use App\DTO\UserResponseDTO;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class AuthController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterDTO $dto,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $userPasswordHasher
    ): Response {
        $user = new User();
        $user->setEmail($dto->email);
        $user->setPassword($userPasswordHasher->hashPassword($user, $dto->password));
        $user->setRoles(['ROLE_USER']);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['status' => 'User created'], Response::HTTP_CREATED);
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    /**
     * @param UserProviderInterface<User> $userProvider
     */
    public function login(
        #[MapRequestPayload] LoginDTO $dto,
        UserProviderInterface $userProvider,
        UserPasswordHasherInterface $userPasswordHasher,
        JWTTokenManagerInterface $jwtTokenManager
    ): Response {
        try {
            $user = $userProvider->loadUserByIdentifier($dto->email);
        } catch (Exception) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        if (!($user instanceof User) || !$userPasswordHasher->isPasswordValid($user, $dto->password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $jwtTokenManager->create($user);

        return new JsonResponse([
            'token' => $token,
            'user' => UserResponseDTO::fromEntity($user),
        ]);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}

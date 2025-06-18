<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class ApiController extends AbstractController
{
    #[Route('', name: 'api_index', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new API',
        ]);
    }
}

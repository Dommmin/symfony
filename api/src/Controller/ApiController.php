<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    #[Route('', name: 'api_index', methods: ['GET'])]
    public function __invoke()
    {
        return $this->json([
            'message' => 'Welcome to your new API',
        ]);
    }
}

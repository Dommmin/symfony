<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthControllerTest extends WebTestCase
{
    public function testRegisterUser(): void
    {
        $client = static::createClient();
        $client->request('POST', '/v1/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ], json_encode([
            'email' => 'testuser@example.com',
            'password' => 'TestPassword123!'
        ]));
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertResponseFormatSame('json');
        $this->assertResponseIsSuccessful();
    }

    public function testLoginUser(): void
    {
        $client = static::createClient();
        // Najpierw rejestracja
        $client->request('POST', '/v1/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ], json_encode([
            'email' => 'loginuser@example.com',
            'password' => 'TestPassword123!'
        ]));
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        // Logowanie
        $client->restart();
        $client->request('POST', '/v1/login', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ], json_encode([
            'email' => 'loginuser@example.com',
            'password' => 'TestPassword123!'
        ]));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertResponseFormatSame('json');
        $this->assertResponseIsSuccessful();
    }
}

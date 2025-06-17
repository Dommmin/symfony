<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\ResetDatabase;

class AuthControllerTest extends WebTestCase
{
    use ResetDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

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
        $this->assertResponseStatusCodeSame(201);
        $this->assertJson($client->getResponse()->getContent());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('status', $data);
        $this->assertEquals('User created', $data['status']);
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
        $this->assertResponseStatusCodeSame(201);
        // Logowanie
        $client->restart();
        $client->request('POST', '/v1/login', [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ], json_encode([
            'email' => 'loginuser@example.com',
            'password' => 'TestPassword123!'
        ]));
        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $data);
        $this->assertNotEmpty($data['token']);
    }
}

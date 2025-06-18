<?php

namespace App\DataFixtures;

use App\Entity\Issue;
use App\Entity\IssueStatus;
use App\Entity\Technician;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        // Create admin user
        $adminUser = new User();
        $adminUser->setEmail('admin@fixmate.com');
        $adminUser->setRoles(['ROLE_ADMIN']);
        $adminUser->setPassword($this->passwordHasher->hashPassword($adminUser, 'admin123'));
        $manager->persist($adminUser);

        // Create regular users
        $users = [];
        $userEmails = [
            'jan.kowalski@example.com',
            'anna.nowak@example.com',
            'marek.wisniewski@example.com',
            'katarzyna.lewandowska@example.com'
        ];

        foreach ($userEmails as $email) {
            $user = new User();
            $user->setEmail($email);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $manager->persist($user);
            $users[] = $user;
        }

        // Create technicians
        $technicians = [];
        $technicianData = [
            ['Adam', 'Mechanik', 'adam.mechanik@fixmate.com', '+48 123 456 789'],
            ['Ewa', 'Elektryczna', 'ewa.elektryczna@fixmate.com', '+48 234 567 890'],
            ['Piotr', 'Programista', 'piotr.programista@fixmate.com', '+48 345 678 901']
        ];

        foreach ($technicianData as [$firstName, $lastName, $email, $phone]) {
            $technician = new Technician($firstName, $lastName, $email);
            $technician->setPhoneNumber($phone);
            $manager->persist($technician);
            $technicians[] = $technician;
        }

        // Create issues
        $issueData = [
            [
                'Nie działa drukarka',
                'Drukarka HP LaserJet w dziale księgowości nie reaguje na polecenia drukowania.',
                IssueStatus::NEW
            ],
            [
                'Problem z dostępem do bazy danych',
                'Aplikacja wyświetla błąd połączenia z bazą danych od dziś rana.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Wymiana baterii w UPS',
                'UPS w serwerowni sygnalizuje konieczność wymiany baterii.',
                IssueStatus::DONE
            ],
            [
                'Aktualizacja systemu',
                'Proszę o aktualizację systemu Windows do najnowszej wersji.',
                IssueStatus::NEW
            ],
            [
                'Konfiguracja VPN',
                'Potrzebuję pomocy w konfiguracji VPN na moim laptopie służbowym.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Awaria klimatyzacji w serwerowni',
                'Temperatura w serwerowni przekracza dopuszczalne normy.',
                IssueStatus::DONE
            ],
            [
                'Problem z Microsoft Teams',
                'Aplikacja Teams zawiesza się podczas połączeń video.',
                IssueStatus::NEW
            ]
        ];

        foreach ($issueData as $index => [$title, $description, $status]) {
            $user = $users[$index % count($users)];
            $issue = new Issue($title, $description, $user);
            $issue->setStatus($status);
            
            // Assign technicians to IN_PROGRESS and DONE issues
            if ($status !== IssueStatus::NEW) {
                $issue->setTechnician($technicians[$index % count($technicians)]);
            }
            
            $manager->persist($issue);
        }

        $manager->flush();
    }
}

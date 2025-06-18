<?php

declare(strict_types=1);

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
        private readonly UserPasswordHasherInterface $userPasswordHasher
    ) {
    }

    public function load(ObjectManager $objectManager): void
    {
        // Create admin user
        $adminUser = new User();
        $adminUser->setEmail('admin@fixmate.com');
        $adminUser->setRoles(['ROLE_ADMIN']);
        $adminUser->setPassword($this->userPasswordHasher->hashPassword($adminUser, 'admin123'));

        $objectManager->persist($adminUser);

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
            $user->setPassword($this->userPasswordHasher->hashPassword($user, 'password123'));
            $objectManager->persist($user);
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
            $objectManager->persist($technician);
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
            ],
            [
                'Wymiana klawiatury',
                'Klawiatura w moim laptopie przestała działać, kilka klawiszy nie reaguje.',
                IssueStatus::NEW
            ],
            [
                'Problemy z wydajnością komputera',
                'Komputer działa bardzo wolno, potrzebna diagnostyka i optymalizacja.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Konfiguracja nowego monitora',
                'Proszę o pomoc w konfiguracji nowego monitora Dell U2419H.',
                IssueStatus::DONE
            ],
            [
                'Aktualizacja antywirusa',
                'Program antywirusowy wymaga aktualizacji do najnowszej wersji.',
                IssueStatus::NEW
            ],
            [
                'Problem z Outlook',
                'Outlook nie synchronizuje się z serwerem Exchange.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Instalacja nowego oprogramowania',
                'Proszę o instalację pakietu Adobe Creative Suite.',
                IssueStatus::DONE
            ],
            [
                'Backup danych',
                'Proszę o wykonanie backupu danych z mojego komputera przed formatowaniem.',
                IssueStatus::NEW
            ],
            [
                'Problemy z drukarką sieciową',
                'Drukarka sieciowa w dziale marketingu drukuje z bardzo słabą jakością.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Konfiguracja poczty na telefonie',
                'Potrzebuję pomocy w konfiguracji poczty służbowej na telefonie iPhone.',
                IssueStatus::DONE
            ],
            [
                'Wymiana dysku',
                'Dysk w moim komputerze wydaje niepokojące dźwięki, proszę o wymianę.',
                IssueStatus::NEW
            ],
            [
                'Problem z dostępem do SharePoint',
                'Nie mogę uzyskać dostępu do firmowego SharePointa.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Aktualizacja sterowników',
                'Proszę o aktualizację sterowników karty graficznej.',
                IssueStatus::DONE
            ],
            [
                'Konfiguracja drukarki',
                'Potrzebuję pomocy w konfiguracji nowej drukarki.',
                IssueStatus::NEW
            ],
            [
                'Problem z WiFi',
                'Słaby zasięg WiFi w sali konferencyjnej.',
                IssueStatus::IN_PROGRESS
            ],
            [
                'Instalacja Windows 11',
                'Proszę o aktualizację systemu do Windows 11.',
                IssueStatus::NEW
            ],
            [
                'Konfiguracja Firewall',
                'Proszę o dostosowanie reguł Firewall dla nowej aplikacji.',
                IssueStatus::IN_PROGRESS
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

            $objectManager->persist($issue);
        }

        $objectManager->flush();
    }
}

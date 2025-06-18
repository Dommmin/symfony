<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250618102719 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE issue (id INT AUTO_INCREMENT NOT NULL, technician_id INT DEFAULT NULL, user_id INT DEFAULT NULL, status VARCHAR(255) NOT NULL, priority VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_12AD233EE6C5D496 (technician_id), INDEX IDX_12AD233EA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE technician (id INT AUTO_INCREMENT NOT NULL, phone_number VARCHAR(20) DEFAULT NULL, first_name VARCHAR(255) DEFAULT NULL, email VARCHAR(255) NOT NULL, last_name VARCHAR(255) DEFAULT NULL, specialization VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE issue ADD CONSTRAINT FK_12AD233EE6C5D496 FOREIGN KEY (technician_id) REFERENCES technician (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE issue ADD CONSTRAINT FK_12AD233EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE issue DROP FOREIGN KEY FK_12AD233EE6C5D496
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE issue DROP FOREIGN KEY FK_12AD233EA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE issue
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE technician
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
    }
}

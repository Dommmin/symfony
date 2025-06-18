<?php

declare(strict_types=1);

namespace App\Serializer;

use ArrayObject;
use App\Entity\Issue;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerAwareInterface;
use Symfony\Component\Serializer\SerializerInterface;

class IssueNormalizer implements NormalizerInterface, SerializerAwareInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private readonly ObjectNormalizer $objectNormalizer,
    ) {
    }

    /**
     * @param array<string, mixed> $context
     * @return array<string, mixed>|string|int|float|bool|ArrayObject|null
     */
    public function normalize(
        mixed $data,
        ?string $format = null,
        array $context = []
    ): array|string|int|float|bool|ArrayObject|null {
        $normalizedData = $this->objectNormalizer->normalize($data, $format, $context);
        if ($data instanceof Issue && is_array($normalizedData)) {
            $normalizedData['status_label'] = $data->getStatus()->name;
        }

        return $normalizedData;
    }

    /**
     * @param array<string, mixed> $context
     */
    public function supportsNormalization(
        mixed $data,
        ?string $format = null,
        array $context = []
    ): bool {
        return $data instanceof Issue;
    }

    /**
     * @return array<class-string, bool>
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            Issue::class => true
        ];
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->objectNormalizer->setSerializer($serializer);
    }
}

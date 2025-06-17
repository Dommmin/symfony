<?php

namespace App\Serializer;

use App\Entity\Issue;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerAwareInterface;
use Symfony\Component\Serializer\SerializerInterface;

class IssueNormalizer implements NormalizerInterface, SerializerAwareInterface
{
    private ?SerializerInterface $serializer = null;

    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private readonly ObjectNormalizer $normalizer,
    ) {
    }

    public function normalize(
        mixed $data,
        ?string $format = null,
        array $context = []
    ): array|string|int|float|bool|\ArrayObject|null {
        $normalizedData = $this->normalizer->normalize($data, $format, $context);
        if ($data instanceof Issue && is_array($normalizedData)) {
            $normalizedData['status_label'] = $data->getStatus()?->name ?? null;
        }
        return $normalizedData;
    }

    public function supportsNormalization(
        mixed $data,
        ?string $format = null,
        array $context = []
    ): bool {
        return $data instanceof Issue;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Issue::class => true
        ];
    }

    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
        if ($this->normalizer instanceof SerializerAwareInterface) {
            $this->normalizer->setSerializer($serializer);
        }
    }
}

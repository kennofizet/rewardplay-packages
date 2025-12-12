<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay;

use Kennofizet\RewardPlay\Repositories\Model\ZoneRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\ZoneValidationService;
use Kennofizet\RewardPlay\Models\Zone;
use Illuminate\Validation\ValidationException;

class ZoneService
{
    protected ZoneRepository $zoneRepository;
    protected ZoneValidationService $validation;

    public function __construct(
        ZoneRepository $zoneRepository,
        ZoneValidationService $validation
    ) {
        $this->zoneRepository = $zoneRepository;
        $this->validation = $validation;
    }

    /**
     * Get zones list.
     */
    public function getZones($filters = [])
    {
        return $this->zoneRepository->list($filters);
    }

    /**
     * Create zone.
     *
     * @throws ValidationException
     */
    public function createZone(array $data): Zone
    {
        $this->validation->validateZone($data);
        return $this->zoneRepository->create($data);
    }

    /**
     * Edit zone.
     *
     * @throws ValidationException
     */
    public function editZone(int $zoneId, array $data): ?Zone
    {
        $this->validation->validateZone($data);
        $zone = $this->zoneRepository->find($zoneId);
        if (!$zone) {
            return null;
        }
        return $this->zoneRepository->update($zone, $data);
    }

    /**
     * Delete zone.
     */
    public function deleteZone(int $zoneId): bool
    {
        $zone = $this->zoneRepository->find($zoneId);
        if (!$zone) {
            return false;
        }
        return $this->zoneRepository->delete($zone);
    }
}


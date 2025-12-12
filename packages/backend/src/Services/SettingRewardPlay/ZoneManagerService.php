<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay;

use Kennofizet\RewardPlay\Repositories\Model\ZoneManagerRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\ZoneManagerValidationService;
use Kennofizet\RewardPlay\Models\ZoneManager;
use Illuminate\Validation\ValidationException;

class ZoneManagerService
{
    protected ZoneManagerRepository $repository;
    protected ZoneManagerValidationService $validation;

    public function __construct(
        ZoneManagerRepository $repository,
        ZoneManagerValidationService $validation
    ) {
        $this->repository = $repository;
        $this->validation = $validation;
    }

    /**
     * Get zone managers list.
     */
    public function getZoneManagers($filters = [])
    {
        return $this->repository->list($filters);
    }

    /**
     * Get manager by zone.
     */
    public function getByZone(int $zoneId): ?ZoneManager
    {
        return $this->repository->findByZone($zoneId);
    }

    /**
     * Assign manager to zone (create or update).
     *
     * @throws ValidationException
     */
    public function assignManager(array $data): ZoneManager
    {
        $this->validation->validateAssign($data);
        return $this->repository->assign($data['zone_id'], $data['user_id']);
    }

    /**
     * Remove manager from zone.
     *
     * @throws ValidationException
     */
    public function removeManager(array $data): bool
    {
        $this->validation->validateAssign($data);
        return $this->repository->remove($data['zone_id'], $data['user_id']);
    }
}


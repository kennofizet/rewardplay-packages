<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay;

use Kennofizet\RewardPlay\Repositories\Model\ZoneRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\ZoneValidationService;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
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
        $query = Zone::query();

        if (!empty($filters['name'])) {
            $query->search($filters['name']);
        }

        return $query->get();
    }

    /**
     * Create zone.
     *
     * @throws ValidationException
     * @throws \Exception
     */
    public function createZone(array $data): Zone
    {
        // Permission checks handled by middleware
        $this->validation->validateZone($data);
        
        return $this->zoneRepository->create($data);
    }

    /**
     * Edit zone.
     *
     * @throws ValidationException
     * @throws \Exception
     */
    public function editZone(int $zoneId, array $data): ?Zone
    {
        // Permission checks handled by middleware
        $this->validation->validateZone($data);
        
        $zone = Zone::findById($zoneId);
        if (!$zone) {
            return null;
        }
        
        // Validate zone permission for existing zone
        $managedZoneIds = BaseModelActions::currentUserManagedZoneIds();
        if (!in_array($zoneId, $managedZoneIds)) {
            throw new \Exception('You do not have permission to manage this zone');
        }
        
        return $this->zoneRepository->update($zone, $data);
    }

    /**
     * Delete zone.
     *
     * @throws \Exception
     */
    public function deleteZone(int $zoneId): bool
    {
        $zone = Zone::findById($zoneId);
        if (!$zone) {
            return false;
        }
        
        // Validate zone permission
        $managedZoneIds = BaseModelActions::currentUserManagedZoneIds();
        if (!in_array($zoneId, $managedZoneIds)) {
            throw new \Exception('You do not have permission to manage this zone');
        }
        
        return $this->zoneRepository->delete($zone);
    }

    /**
     * Get zones that current user can manage
     * 
     * @return array
     */
    public function getZonesUserCanManage(): array
    {
        $zoneIds = BaseModelActions::currentUserManagedZoneIds();
        if (empty($zoneIds)) {
            return [];
        }

        $zones = Zone::byZoneIds($zoneIds)
            ->get();

        return $zones->map(function($zone) {
            return [
                'id' => $zone->id,
                'name' => $zone->name,
            ];
        })->toArray();
    }
}


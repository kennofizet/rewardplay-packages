<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\ZoneManager;

class ZoneManagerRepository
{
    public function list($filters = [])
    {
        $query = ZoneManager::with('zone');

        if (!empty($filters['zone_id'])) {
            $query->byZone($filters['zone_id']);
        }

        if (!empty($filters['user_id'])) {
            $query->byUser($filters['user_id']);
        }

        return $query->get();
    }

    public function findByZone(int $zoneId): ?ZoneManager
    {
        return ZoneManager::byZone($zoneId)->first();
    }

    public function assign(int $zoneId, int $userId): ZoneManager
    {
        // Ensure one manager per zone: upsert behavior
        $zoneManager = ZoneManager::byZone($zoneId)->first();
        if ($zoneManager) {
            $zoneManager->update([
                'user_id' => $userId,
            ]);
            return $zoneManager;
        }

        return ZoneManager::create([
            'zone_id' => $zoneId,
            'user_id' => $userId,
        ]);
    }

    public function remove(int $zoneId, int $userId): bool
    {
        return (bool) ZoneManager::byZone($zoneId)
            ->byUser($userId)
            ->delete();
    }
}


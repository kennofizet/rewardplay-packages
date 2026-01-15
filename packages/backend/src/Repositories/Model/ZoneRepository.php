<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\Zone;

class ZoneRepository
{
    public function create(array $data): Zone
    {
        return Zone::create([
            'name' => $data['name'],
            'server_id' => $data['server_id'] ?? null,
        ]);
    }

    public function update(Zone $zone, array $data): Zone
    {
        $zone->update([
            'name' => $data['name'],
            'server_id' => $data['server_id'] ?? $zone->server_id,
        ]);

        return $zone;
    }

    public function delete(Zone $zone): bool
    {
        return (bool) $zone->delete();
    }
}


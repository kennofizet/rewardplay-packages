<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

class ZoneRepository
{
    public function create(array $data): Zone
    {
        return Zone::create([
            'name' => $data['name'],
            // default to current server id if not provided
            'server_id' => $data['server_id'] ?? BaseModelActions::currentServerId(),
        ]);
    }

    public function update(Zone $zone, array $data): Zone
    {
        $zone->update([
            'name' => $data['name'],
            // preserve existing server_id unless explicitly provided
            'server_id' => $data['server_id'] ?? $zone->server_id,
        ]);

        return $zone;
    }

    public function delete(Zone $zone): bool
    {
        return (bool) $zone->delete();
    }
}


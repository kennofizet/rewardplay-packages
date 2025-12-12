<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\Zone;

class ZoneRepository
{
    public function list($filters = [])
    {
        $query = Zone::query();

        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%'.$filters['name'].'%');
        }

        return $query->get();
    }

    public function find(int $id): ?Zone
    {
        return Zone::find($id);
    }

    public function create(array $data): Zone
    {
        return Zone::create([
            'name' => $data['name'],
        ]);
    }

    public function update(Zone $zone, array $data): Zone
    {
        $zone->update([
            'name' => $data['name'],
        ]);

        return $zone;
    }

    public function delete(Zone $zone): bool
    {
        return (bool) $zone->delete();
    }
}


<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingStackBonus;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusRelationshipSetting;
use Kennofizet\RewardPlay\Services\Model\Traits\BaseModelServiceTrait;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Validation\ValidationException;

class SettingStackBonusService
{
    use BaseModelServiceTrait;
    /**
     * Get setting stack bonuses with pagination and filters
     */
    public function getSettingStackBonuses(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingStackBonus::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $this->loadRelationships($query, SettingStackBonusRelationshipSetting::class, $modeView);

        // Apply day filter using scope
        if (!empty($filters['day'])) {
            $query->byDay($filters['day']);
        }

        // Apply day range filter using scope
        if (!empty($filters['day_from']) && !empty($filters['day_to'])) {
            $query->byDayRange($filters['day_from'], $filters['day_to']);
        }

        // Apply active filter using scope
        if (isset($filters['is_active'])) {
            $query->byActive($filters['is_active']);
        }

        if (!empty($filters['keySearch']) || !empty($filters['q'])) {
            $searchTerm = $filters['keySearch'] ?? $filters['q'];
            $query->search($searchTerm);
        }

        $query->orderBy('day', 'asc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get setting stack bonuses by day range (for weekly cycle)
     */
    public function getSettingStackBonusesByDayRange(int $from, int $to)
    {
        $query = SettingStackBonus::query();

        // Load relationships
        $this->loadRelationships($query, SettingStackBonusRelationshipSetting::class);

        return $query->byDayRange($from, $to)
            ->orderBy('day')
            ->get();
    }

    /**
     * Get a single setting stack bonus by ID
     */
    public function getSettingStackBonus(int $id, ?string $modeView = null): ?SettingStackBonus
    {
        $query = SettingStackBonus::query();

        // Load relationships based on mode
        $this->loadRelationships($query, SettingStackBonusRelationshipSetting::class, $modeView);

        return $query->find($id);
    }

    /**
     * Get setting stack bonus by day
     */
    public function getSettingStackBonusByDay(int $day, ?string $modeView = null): ?SettingStackBonus
    {
        $query = SettingStackBonus::query();

        // Load relationships based on mode
        $this->loadRelationships($query, SettingStackBonusRelationshipSetting::class, $modeView);

        return $query->byDay($day)->first();
    }

    /**
     * Create a new setting stack bonus
     */
    public function createSettingStackBonus(array $data): SettingStackBonus
    {
        return SettingStackBonus::create([
            'name' => $data['name'] ?? null,
            'day' => $data['day'],
            'rewards' => $data['rewards'] ?? [],
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update a setting stack bonus
     */
    public function updateSettingStackBonus(int $id, array $data): SettingStackBonus
    {
        $settingStackBonus = $this->findOrFail(SettingStackBonus::find($id), 'Setting stack bonus');

        $settingStackBonus->update([
            'name' => $data['name'] ?? $settingStackBonus->name,
            'day' => $data['day'] ?? $settingStackBonus->day,
            'rewards' => $data['rewards'] ?? $settingStackBonus->rewards,
            'is_active' => $data['is_active'] ?? $settingStackBonus->is_active,
        ]);

        return $settingStackBonus->fresh();
    }

    public function deleteSettingStackBonus(int $id): bool
    {
        $settingStackBonus = SettingStackBonus::find($id);
        
        if (!$settingStackBonus) {
            return false;
        }

        return $settingStackBonus->delete();
    }

    public function generateSuggestedBonuses(): array
    {
        $defaultStackBonuses = [
            [
                'name' => 'Day 1 Bonus',
                'day' => 1,
                'rewards' => [['type' => 'coin', 'quantity' => 100, 'item_id' => null]],
            ],
            [
                'name' => 'Day 2 Bonus',
                'day' => 2,
                'rewards' => [['type' => 'coin', 'quantity' => 200, 'item_id' => null]],
            ],
            [
                'name' => 'Day 3 Bonus',
                'day' => 3,
                'rewards' => [['type' => 'coin', 'quantity' => 500, 'item_id' => null]],
            ],
            [
                'name' => 'Day 4 Bonus',
                'day' => 4,
                'rewards' => [['type' => 'coin', 'quantity' => 600, 'item_id' => null]],
            ],
            [
                'name' => 'Day 5 Bonus',
                'day' => 5,
                'rewards' => [['type' => 'coin', 'quantity' => 800, 'item_id' => null]],
            ],
            [
                'name' => 'Day 6 Bonus',
                'day' => 6,
                'rewards' => [['type' => 'coin', 'quantity' => 1000, 'item_id' => null]],
            ],
            [
                'name' => 'Day 7 SUPER Bonus',
                'day' => 7,
                'rewards' => [['type' => 'coin', 'quantity' => 5000, 'item_id' => null]],
            ],
        ];

        $createdStackBonuses = [];
        foreach ($defaultStackBonuses as $bonusData) {
            $settingStackBonus = SettingStackBonus::updateOrCreate(
                ['day' => $bonusData['day']],
                [
                    'name' => $bonusData['name'],
                    'rewards' => $bonusData['rewards'],
                    'is_active' => true
                ]
            );
            $createdStackBonuses[] = $settingStackBonus;
        }

        return $createdStackBonuses;
    }
}

<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingLevelExp;
use Kennofizet\RewardPlay\Services\Model\Traits\BaseModelServiceTrait;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

class SettingLevelExpService
{
    use BaseModelServiceTrait;

    /**
     * Get all setting level exps
     */
    public function getSettingLevelExps(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingLevelExp::query();

        if (!empty($filters['keySearch']) || !empty($filters['q'])) {
            $searchTerm = $filters['keySearch'] ?? $filters['q'];
            // Search by level
            $query->where('lv', 'like', '%' . $searchTerm . '%');
        }

        $query->orderBy('lv', 'asc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a single setting level exp by ID
     */
    public function getSettingLevelExp(int $id, ?string $modeView = null): ?SettingLevelExp
    {
        return SettingLevelExp::find($id);
    }

    /**
     * Create a new setting level exp
     */
    public function createSettingLevelExp(array $data): SettingLevelExp
    {        
        return SettingLevelExp::updateOrCreate(
            [
                'lv' => $data['lv']
            ],
            [
                'exp_needed' => $data['exp_needed'],
            ]
        );
    }

    /**
     * Update a setting level exp
     */
    public function updateSettingLevelExp(int $id, array $data): SettingLevelExp
    {
        $settingLevelExp = $this->findOrFail(SettingLevelExp::find($id), 'Setting level exp');

        $settingLevelExp->update([
            'lv' => $data['lv'] ?? $settingLevelExp->lv,
            'exp_needed' => $data['exp_needed'] ?? $settingLevelExp->exp_needed,
        ]);

        return $settingLevelExp->fresh();
    }

    public function deleteSettingLevelExp(int $id): bool
    {
        $settingLevelExp = SettingLevelExp::find($id);
        
        if (!$settingLevelExp) {
            return false;
        }

        return $settingLevelExp->delete();
    }

    /**
     * Generate suggested level exp data
     * Creates levels 1-100 with exponential exp growth
     */
    public function generateSuggestedData(): array
    {
        $createdLevelExps = [];
        
        // Generate levels 1-100 with exponential growth
        for ($lv = 1; $lv <= 100; $lv++) {
            // Exponential formula: base_exp * (multiplier ^ (level - 1))
            // Base: 100 exp for level 1
            // Multiplier: 1.15 (15% increase per level)
            $baseExp = 100;
            $multiplier = 1.15;
            $expNeeded = (int)($baseExp * pow($multiplier, $lv - 1));
            
            // Round to nearest 10 for cleaner numbers
            $expNeeded = round($expNeeded / 10) * 10;
            
            $settingLevelExp = SettingLevelExp::updateOrCreate(
                [
                    'lv' => $lv
                ],
                [
                    'exp_needed' => $expNeeded,
                ]
            );
            $createdLevelExps[] = $settingLevelExp;
        }

        return $createdLevelExps;
    }
}

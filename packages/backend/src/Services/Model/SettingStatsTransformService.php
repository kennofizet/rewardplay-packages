<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingStatsTransform;
use Kennofizet\RewardPlay\Models\SettingStatsTransform\SettingStatsTransformRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Repositories\Model\SettingStatsTransformRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\SettingStatsTransformValidationService;
use Illuminate\Validation\ValidationException;

class SettingStatsTransformService
{
    protected $settingStatsTransformRepository;
    protected $validation;

    public function __construct(
        SettingStatsTransformRepository $settingStatsTransformRepository,
        SettingStatsTransformValidationService $validation
    ) {
        $this->settingStatsTransformRepository = $settingStatsTransformRepository;
        $this->validation = $validation;
    }

    /**
     * Get setting stats transforms with pagination and filters
     */
    public function getSettingStatsTransforms(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingStatsTransform::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $withRelationships = SettingStatsTransformRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        // Apply filters
        if (!empty($filters['target_key'])) {
            $query->byTargetKey($filters['target_key']);
        }

        // Paginate results
        return $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a single setting stats transform by ID
     */
    public function getSettingStatsTransform(int $id, ?string $modeView = null): ?SettingStatsTransform
    {
        $query = SettingStatsTransform::query();

        // Load relationships based on mode
        $withRelationships = SettingStatsTransformRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        return $query->find($id);
    }

    /**
     * Create a new setting stats transform
     */
    public function createSettingStatsTransform(array $data): SettingStatsTransform
    {
        // Validate data
        $this->validation->validateSettingStatsTransform($data);

        // Create setting stats transform
        return $this->settingStatsTransformRepository->create($data);
    }

    /**
     * Update a setting stats transform
     */
    public function updateSettingStatsTransform(int $id, array $data): SettingStatsTransform
    {
        $settingStatsTransform = SettingStatsTransform::findById($id);
        
        if (!$settingStatsTransform) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', 'Setting stats transform not found')
            );
        }

        // Validate data
        $this->validation->validateSettingStatsTransform($data, $id);

        // Update setting stats transform
        return $this->settingStatsTransformRepository->update($settingStatsTransform, $data);
    }

    /**
     * Delete a setting stats transform
     */
    public function deleteSettingStatsTransform(int $id): bool
    {
        $settingStatsTransform = SettingStatsTransform::findById($id);
        
        if (!$settingStatsTransform) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', 'Setting stats transform not found')
            );
        }

        return $this->settingStatsTransformRepository->delete($settingStatsTransform);
    }

    /**
     * Get all active stats transforms currently zone user is in
     * Used for applying conversions in UserActions
     */
    public function getActiveTransforms(): array
    {
        $query = SettingStatsTransform::get()->toArray();
        return $query;
    }

    /**
     * Generate suggested stats transform data
     * Creates common conversions like attack/defense/hp to power
     */
    public function generateSuggestedData(): array
    {
        $createdTransforms = [];
        
        // Common conversions: convert various stats to power
        $suggestedTransforms = [
            [
                'target_key' => HelperConstant::POWER_KEY,
                'conversions' => [
                    ['source_key' => HelperConstant::ATTACK_KEY, 'conversion_value' => 1.0],
                    ['source_key' => HelperConstant::DEFENSE_KEY, 'conversion_value' => 0.8],
                    ['source_key' => HelperConstant::HP_KEY, 'conversion_value' => 0.01],
                    ['source_key' => HelperConstant::CRIT_KEY, 'conversion_value' => 2.0],
                    ['source_key' => HelperConstant::CRIT_DMG_KEY, 'conversion_value' => 1.5],
                ]
            ],
            [
                'target_key' => HelperConstant::CV_KEY,
                'conversions' => [
                    ['source_key' => HelperConstant::ATTACK_KEY, 'conversion_value' => 0.5],
                    ['source_key' => HelperConstant::DEFENSE_KEY, 'conversion_value' => 0.4],
                    ['source_key' => HelperConstant::HP_KEY, 'conversion_value' => 0.005],
                ]
            ],
        ];

        foreach ($suggestedTransforms as $transformData) {
            // Check if transform already exists for this target_key
            $existing = SettingStatsTransform::byTargetKey($transformData['target_key'])
                ->first();

            if (!$existing) {
                $transform = $this->settingStatsTransformRepository->create($transformData);
                $createdTransforms[] = $transform;
            }
        }

        return $createdTransforms;
    }
}

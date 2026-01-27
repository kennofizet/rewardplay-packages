<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Repositories\Model\SettingItemSetRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\SettingItemSetValidationService;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;
use Illuminate\Validation\ValidationException;

class SettingItemSetService
{
    protected $settingItemSetRepository;
    protected $validation;
    protected ZoneService $zoneService;

    public function __construct(
        SettingItemSetRepository $settingItemSetRepository,
        SettingItemSetValidationService $validation,
        ZoneService $zoneService
    ) {
        $this->settingItemSetRepository = $settingItemSetRepository;
        $this->validation = $validation;
        $this->zoneService = $zoneService;
    }

    /**
     * Get setting item sets with pagination and filters
     */
    public function getSettingItemSets(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingItemSet::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $withRelationships = SettingItemSetRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        // Apply search filter
        if (!empty($filters['keySearch']) || !empty($filters['q'])) {
            $search = $filters['keySearch'] ?? $filters['q'];
            $query->search($search);
        }

        // Paginate results
        return $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Create a new setting item set
     */
    public function createSettingItemSet(array $data, ?array $itemIds = null): SettingItemSet
    {
        // Normalize potential JSON fields
        $data = $this->normalizeCustomStats($data);

        // Validate data
        $this->validation->validateSettingItemSet($data, $itemIds);

        // Create setting item set
        return $this->settingItemSetRepository->create($data, $itemIds);
    }

    /**
     * Update a setting item set
     */
    public function updateSettingItemSet(int $id, array $data, ?array $itemIds = null): SettingItemSet
    {
        $settingItemSet = SettingItemSet::findById($id);
        
        if (!$settingItemSet) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', 'Setting item set not found')
            );
        }

        // Normalize potential JSON fields
        $data = $this->normalizeCustomStats($data);

        // Validate data
        $this->validation->validateSettingItemSet($data, $itemIds, $id);

        // Update setting item set
        return $this->settingItemSetRepository->update($settingItemSet, $data, $itemIds);
    }

    /**
     * Delete a setting item set
     */
    public function deleteSettingItemSet(int $id): bool
    {
        $settingItemSet = SettingItemSet::findById($id);
        
        if (!$settingItemSet) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', 'Setting item set not found')
            );
        }

        return $this->settingItemSetRepository->delete($settingItemSet);
    }

    /**
     * Normalize custom_stats when it's passed as JSON string from FormData
     * Extracted to avoid duplicated code in create/update methods.
     *
     * @param array $data
     * @return array
     */
    private function normalizeCustomStats(array $data): array
    {
        if (isset($data['custom_stats']) && is_string($data['custom_stats'])) {
            $decoded = json_decode($data['custom_stats'], true);
            if (is_array($decoded)) {
                $data['custom_stats'] = $decoded;
            }
        }

        return $data;
    }
}

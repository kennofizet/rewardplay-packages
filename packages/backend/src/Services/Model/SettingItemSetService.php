<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Repositories\Model\SettingItemSetRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\SettingItemSetValidationService;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;
use Kennofizet\RewardPlay\Models\SettingOption;
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

        // Always eager load zone relationship to prevent N+1
        $query->with('zone');

        // Apply zone filter - default to first zone user can manage
        $zoneId = $filters['zone_id'] ?? null;
        if (empty($zoneId)) {
            // Get zones user can manage and use first one
            $zones = $this->zoneService->getZonesUserCanManage();
            if (!empty($zones)) {
                $zoneId = $zones[0]['id'];
            }
        }
        if ($zoneId) {
            $query->byZone($zoneId);
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
     * Get a single setting item set by ID
     */
    public function getSettingItemSet(int $id, ?string $modeView = null): ?SettingItemSet
    {
        $query = SettingItemSet::query();

        // Load relationships based on mode
        $withRelationships = SettingItemSetRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        // Always eager load zone
        $query->with('zone');

        return $query->find($id);
    }

    /**
     * Create a new setting item set
     */
    public function createSettingItemSet(array $data, ?array $itemIds = null): SettingItemSet
    {
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
     * Build a mapping of stat keys => display names used across given item sets.
     * Includes both default conversion keys (from HelperConstant::CONVERSION_KEYS)
     * and custom stat keys (format: custom_key_{id}, resolved via SettingOption, including trashed).
     *
     * @param iterable|array $itemSets  Collection, array, or paginator of SettingItemSet objects/arrays
     * @return array  mapping [ stat_key => display_name ]
     */
    public function buildStatsMapping($itemSets): array
    {
        $collected = [];

        $collect = function ($data) use (&$collected, &$collect) {
            if (!is_array($data) && !($data instanceof \ArrayAccess)) return;

            foreach ($data as $k => $v) {
                if (is_string($k) && $k !== '') {
                    $collected[$k] = true;
                }
                if (is_array($v) || $v instanceof \ArrayAccess) {
                    $collect($v);
                }
            }
        };

        // Iterate item sets (paginator, collection or array)
        foreach ($itemSets as $set) {
            // Support object (model) or array
            $bonuses = [];
            if (is_object($set)) {
                $bonuses = $set->set_bonuses ?? [];
            } elseif (is_array($set)) {
                $bonuses = $set['set_bonuses'] ?? [];
            }

            if (!empty($bonuses)) {
                $collect($bonuses);
            }
        }

        $result = [];

        foreach (array_keys($collected) as $statKey) {
            // Custom keys: custom_key_{id} or custom_key_{id}_n
            if (str_starts_with($statKey, 'custom_key_')) {
                if (preg_match('/^custom_key_(\d+)(?:_\d+)?$/', $statKey, $m)) {
                    $customId = (int)$m[1];
                    // include trashed custom options
                    $option = SettingOption::withTrashed()->select('id', 'name')->find($customId);
                    $result[$statKey] = $option ? $option->name : "Custom #{$customId}";
                    continue;
                }
                // fallback: use raw key
                $result[$statKey] = $statKey;
                continue;
            }

            // Non-custom: strip duplicate suffixes like _2 and map to conversion keys
            $baseKey = preg_replace('/_\d+$/', '', $statKey);
            $display = HelperConstant::CONVERSION_KEYS[$baseKey] ?? ucfirst(str_replace('_', ' ', $baseKey));
            $result[$statKey] = $display;
        }

        return $result;
    }
}

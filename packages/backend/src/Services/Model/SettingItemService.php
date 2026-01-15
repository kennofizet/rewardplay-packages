<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Repositories\Model\SettingItemRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\SettingItemValidationService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\UploadedFile;

class SettingItemService
{
    protected $settingItemRepository;
    protected $validation;

    public function __construct(
        SettingItemRepository $settingItemRepository,
        SettingItemValidationService $validation
    ) {
        $this->settingItemRepository = $settingItemRepository;
        $this->validation = $validation;
    }

    /**
     * Get setting items with pagination and filters
     */
    public function getSettingItems(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingItem::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $withRelationships = SettingItemRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        // Always eager load zone relationship to prevent N+1
        $query->with('zone');

        // Apply zone filter - default to first zone user can manage
        $zoneId = $filters['zone_id'] ?? null;
        if (empty($zoneId)) {
            // Get zones user can manage and use first one
            $zones = SettingItem::getZonesUserCanManage();
            if (!empty($zones)) {
                $zoneId = $zones[0]['id'];
            }
        }

        if (!empty($zoneId)) {
            $query->byZone($zoneId);
        }

        // Apply search scope
        $key_search = '';
        if (!empty($filters['keySearch'])) {
            $key_search = $filters['keySearch'];
        }
        if (empty($key_search)) {
            $key_search = $filters['q'] ?? '';
        }

        // Apply other filters using scopes
        if (!empty($key_search)) {
            $query->search($key_search);
        }

        // Apply type filter
        if (!empty($filters['type'])) {
            $query->byType($filters['type']);
        }

        $query->orderBy('id', 'DESC');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a single setting item by ID
     */
    public function getSettingItem(int $id): ?SettingItem
    {
        return SettingItem::findById($id);
    }

    /**
     * Create a new setting item
     *
     * @param array $data
     * @param UploadedFile|null $imageFile
     * @return SettingItem
     * @throws ValidationException
     */
    public function createSettingItem(array $data, ?UploadedFile $imageFile = null): SettingItem
    {
        $this->validation->validateSettingItem($data, $imageFile);
        return $this->settingItemRepository->create($data, $imageFile);
    }

    /**
     * Update a setting item
     *
     * @param int $id
     * @param array $data
     * @param UploadedFile|null $imageFile
     * @return SettingItem|null
     * @throws ValidationException
     */
    public function updateSettingItem(int $id, array $data, ?UploadedFile $imageFile = null): ?SettingItem
    {
        $this->validation->validateSettingItem($data, $imageFile, $id);
        $settingItem = SettingItem::findById($id);
        if (!$settingItem) {
            return null;
        }
        return $this->settingItemRepository->update($settingItem, $data, $imageFile);
    }

    /**
     * Delete a setting item
     */
    public function deleteSettingItem(int $id): bool
    {
        $settingItem = SettingItem::findById($id);
        if (!$settingItem) {
            return false;
        }
        return $this->settingItemRepository->delete($settingItem);
    }
}


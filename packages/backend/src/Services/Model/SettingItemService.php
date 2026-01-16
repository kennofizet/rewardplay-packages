<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Repositories\Model\SettingItemRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\SettingItemValidationService;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\UploadedFile;

class SettingItemService
{
    protected $settingItemRepository;
    protected $validation;
    protected ZoneService $zoneService;

    public function __construct(
        SettingItemRepository $settingItemRepository,
        SettingItemValidationService $validation,
        ZoneService $zoneService
    ) {
        $this->settingItemRepository = $settingItemRepository;
        $this->validation = $validation;
        $this->zoneService = $zoneService;
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
            $zones = $this->zoneService->getZonesUserCanManage();
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
     * @throws \Exception
     */
    public function createSettingItem(array $data, ?UploadedFile $imageFile = null): SettingItem
    {
        // Permission checks handled by middleware
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
     * @throws \Exception
     */
    public function updateSettingItem(int $id, array $data, ?UploadedFile $imageFile = null): ?SettingItem
    {
        // Permission checks handled by middleware
        $this->validation->validateSettingItem($data, $imageFile, $id);
        
        $settingItem = SettingItem::findById($id);
        if (!$settingItem) {
            return null;
        }
        
        // If updating zone_id, middleware already validated it
        // If not updating zone_id, check existing item's zone (middleware validates on route param if needed)
        
        return $this->settingItemRepository->update($settingItem, $data, $imageFile);
    }

    /**
     * Delete a setting item
     *
     * @throws \Exception
     */
    public function deleteSettingItem(int $id): bool
    {
        $settingItem = SettingItem::findById($id);
        if (!$settingItem) {
            return false;
        }
        
        // Permission check: validate that item's zone is in user's managed zones
        // This is done by checking if zone_id is in managed zones (from middleware)
        if (!empty($settingItem->zone_id)) {
            $managedZoneIds = \Kennofizet\RewardPlay\Core\Model\BaseModelActions::currentUserManagedZoneIds();
            if (!in_array($settingItem->zone_id, $managedZoneIds)) {
                throw new \Exception('You do not have permission to manage this zone');
            }
        }
        
        return $this->settingItemRepository->delete($settingItem);
    }

    /**
     * Get items for a zone (for selecting items in set)
     * 
     * @param int $zoneId
     * @return array
     * @throws \Exception
     */
    public function getItemsForZone(int $zoneId): array
    {
        if (!$zoneId) {
            throw new \Exception('Zone ID is required');
        }

        // Get items from the zone
        $items = SettingItem::byZone($zoneId)->get();

        // Format items for response
        $formattedItems = $items->map(function($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'type' => $item->type,
                'image' => \Kennofizet\RewardPlay\Core\Model\BaseModelResponse::getImageFullUrl($item->image),
            ];
        })->toArray();

        return $formattedItems;
    }
}


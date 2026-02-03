<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
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

        // Apply type filter (single type or comma-separated for multiple, e.g. box_random,ticket,buff)
        if (!empty($filters['type'])) {
            $typeVal = $filters['type'];
            if (is_string($typeVal) && strpos($typeVal, ',') !== false) {
                $types = array_map('trim', explode(',', $typeVal));
                $query->whereIn('type', $types);
            } else {
                $query->byType($typeVal);
            }
        }

        $query->orderBy('id', 'DESC');

        return $query->paginate($perPage, ['*'], 'page', $page);
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
        // Normalize potential JSON fields
        $data = $this->normalizeDefaultProperty($data);
        $data = $this->normalizeCustomStats($data);

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
        // Normalize potential JSON fields
        $data = $this->normalizeDefaultProperty($data);
        $data = $this->normalizeCustomStats($data);

        // Permission checks handled by middleware
        $this->validation->validateSettingItem($data, $imageFile, $id);
        
        $settingItem = SettingItem::findById($id);
        if (!$settingItem) {
            return null;
        }
        
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
        // Use ZoneService which centralizes zone->managed logic instead of calling BaseModelActions directly
        if (!empty($settingItem->zone_id)) {
            $zones = $this->zoneService->getZonesUserCanManage();
            $managedZoneIds = array_column($zones, 'id');
            if (!in_array($settingItem->zone_id, $managedZoneIds)) {
                throw new \Exception('You do not have permission to manage this zone');
            }
        }
        
        return $this->settingItemRepository->delete($settingItem);
    }

    /**
     * Get items for a current user zone (for selecting items in set)
     * 
     * @return array
     * @throws \Exception
     */
    public function getItemsForZone(): array
    {
        $items = SettingItem::get();

        // Format items for response (include default_property and actions for frontend filters/display)
        $formattedItems = $items->map(function ($item) {
            $type = $item->type ?? '';
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'type' => $type,
                'image' => \Kennofizet\RewardPlay\Core\Model\BaseModelResponse::getImageFullUrl($item->image),
                'default_property' => $item->default_property,
                'actions' => [
                    'is_box_random' => SettingItemConstant::isBoxRandom($type),
                    'is_gear' => SettingItemConstant::isGearSlotType($type),
                    'is_buff' => SettingItemConstant::isBuff($type),
                    'is_ticket' => SettingItemConstant::isTicket($type),
                ],
            ];
        })->toArray();

        return $formattedItems;
    }

    /**
     * Normalize default_property when it's passed as JSON string from FormData
     * Extracted to avoid duplicated code in create/update methods.
     *
     * @param array $data
     * @return array
     */
    private function normalizeDefaultProperty(array $data): array
    {
        if (isset($data['default_property']) && is_string($data['default_property'])) {
            $decoded = json_decode($data['default_property'], true);
            if (is_array($decoded)) {
                $data['default_property'] = $decoded;
            }
        }

        return $data;
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


<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingShopItem;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemRelationshipSetting;
use Kennofizet\RewardPlay\Services\Model\Traits\BaseModelServiceTrait;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

class SettingShopItemService
{
    use BaseModelServiceTrait;

    private const DEFAULT_MODE = SettingShopItemConstant::API_LIST_PAGE;

    /**
     * Get setting shop items with pagination and filters.
     */
    public function getSettingShopItems(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;
        $mode = $modeView ?? self::DEFAULT_MODE;

        $query = SettingShopItem::query();
        $this->loadRelationships($query, SettingShopItemRelationshipSetting::class, $mode);

        if (!empty($filters['category'])) {
            $query->byCategory($filters['category']);
        }
        if (isset($filters['is_active'])) {
            $query->byActive((bool) $filters['is_active']);
        }
        if (array_key_exists('event_id', $filters)) {
            $query->byEvent($filters['event_id']);
        }

        $query->orderBy('sort_order')->orderBy('id');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a single setting shop item by ID (with settingItem eager-loaded).
     */
    public function getSettingShopItem(int $id, ?string $modeView = null): ?SettingShopItem
    {
        $mode = $modeView ?? self::DEFAULT_MODE;
        $query = SettingShopItem::query();
        $this->loadRelationships($query, SettingShopItemRelationshipSetting::class, $mode);

        return $query->find($id);
    }

    /**
     * Create a new setting shop item. Returns model with settingItem loaded (no N+1).
     */
    public function createSettingShopItem(array $data): SettingShopItem
    {
        $shopItem = SettingShopItem::create([
            'setting_item_id' => $data['setting_item_id'],
            'event_id' => $data['event_id'] ?? null,
            'category' => $data['category'] ?? SettingShopItemConstant::CATEGORY_GEAR,
            'prices' => $data['prices'] ?? [],
            'sort_order' => $data['sort_order'] ?? 0,
            'time_start' => $data['time_start'] ?? null,
            'time_end' => $data['time_end'] ?? null,
            'options' => $data['options'] ?? [],
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $shopItem->load('settingItem');
    }

    /**
     * Update a setting shop item. Returns fresh model with settingItem loaded.
     */
    public function updateSettingShopItem(int $id, array $data): SettingShopItem
    {
        $shopItem = $this->findOrFail(SettingShopItem::find($id), 'Setting shop item');

        $shopItem->update([
            'setting_item_id' => $data['setting_item_id'] ?? $shopItem->setting_item_id,
            'event_id' => array_key_exists('event_id', $data) ? $data['event_id'] : $shopItem->event_id,
            'category' => $data['category'] ?? $shopItem->category,
            'prices' => $data['prices'] ?? $shopItem->prices,
            'sort_order' => $data['sort_order'] ?? $shopItem->sort_order,
            'time_start' => array_key_exists('time_start', $data) ? $data['time_start'] : $shopItem->time_start,
            'time_end' => array_key_exists('time_end', $data) ? $data['time_end'] : $shopItem->time_end,
            'options' => $data['options'] ?? $shopItem->options,
            'is_active' => array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $shopItem->is_active,
        ]);

        return $shopItem->fresh()->load('settingItem');
    }

    /**
     * Delete a setting shop item.
     */
    public function deleteSettingShopItem(int $id): bool
    {
        $shopItem = SettingShopItem::find($id);

        return $shopItem ? $shopItem->delete() : false;
    }

    /**
     * Generate suggested shop items from existing setting items (box_random, ticket, buff, gear).
     * Creates one shop entry per suggested item with default coin price.
     *
     * @return array<int, SettingShopItem>
     */
    public function generateSuggestedShopItems(): array
    {
        $items = SettingItem::query()
            ->whereIn('type', [
                \Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant::ITEM_TYPE_BOX_RANDOM,
                \Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant::ITEM_TYPE_TICKET,
                \Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant::ITEM_TYPE_BUFF,
            ])
            ->orderBy('id')
            ->limit(5)
            ->get();

        if ($items->isEmpty()) {
            return [];
        }

        $created = [];
        $sortOrder = 0;
        foreach ($items as $item) {
            $category = $item->type === \Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant::ITEM_TYPE_BOX_RANDOM
                ? SettingShopItemConstant::CATEGORY_BOX_RANDOM
                : ($item->type === \Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant::ITEM_TYPE_TICKET
                    ? SettingShopItemConstant::CATEGORY_TICKET
                    : SettingShopItemConstant::CATEGORY_GEAR);
            $shopItem = SettingShopItem::create([
                'setting_item_id' => $item->id,
                'event_id' => null,
                'category' => $category,
                'prices' => [['type' => SettingShopItemConstant::PRICE_TYPE_COIN, 'value' => 100, 'item_id' => null, 'quantity' => null]],
                'sort_order' => $sortOrder++,
                'time_start' => null,
                'time_end' => null,
                'options' => [],
                'is_active' => true,
            ]);
            $created[] = $shopItem->load('settingItem');
        }

        return $created;
    }
}

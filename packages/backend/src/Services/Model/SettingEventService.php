<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Models\SettingEvent;
use Kennofizet\RewardPlay\Models\SettingEvent\SettingEventConstant;
use Kennofizet\RewardPlay\Models\SettingEvent\SettingEventRelationshipSetting;
use Kennofizet\RewardPlay\Services\Model\Traits\BaseModelServiceTrait;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SettingEventService
{
    use BaseModelServiceTrait;

    /**
     * Get setting events with pagination and filters.
     */
    public function getSettingEvents(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;
        $mode = $modeView ?? SettingEventConstant::API_SETTING_EVENT_LIST_PAGE;

        $query = SettingEvent::query();
        $this->loadRelationships($query, SettingEventRelationshipSetting::class, $mode);

        if (!empty($filters['keySearch']) || !empty($filters['q'])) {
            $query->search($filters['keySearch'] ?? $filters['q']);
        }
        if (isset($filters['is_active'])) {
            $query->byActive((bool) $filters['is_active']);
        }

        $query->orderBy('id', 'desc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a single setting event by ID.
     */
    public function getSettingEvent(int $id, ?string $modeView = null): ?SettingEvent
    {
        $mode = $modeView ?? SettingEventConstant::API_SETTING_EVENT_LIST_PAGE;
        $query = SettingEvent::query();
        $this->loadRelationships($query, SettingEventRelationshipSetting::class, $mode);

        return $query->find($id);
    }

    /**
     * Create a new setting event and sync event items.
     */
    public function createSettingEvent(array $data): SettingEvent
    {
        $event = SettingEvent::create([
            'name' => $data['name'] ?? '',
            'slug' => $data['slug'] ?? null,
            'description' => $data['description'] ?? null,
            'image' => $data['image'] ?? null,
            'time_start' => $data['time_start'] ?? null,
            'time_end' => $data['time_end'] ?? null,
            'bonus' => $data['bonus'] ?? [],
            'daily_reward_bonus' => $data['daily_reward_bonus'] ?? [],
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->syncEventItems($event, $data['item_ids'] ?? []);

        return $event->load('items');
    }

    /**
     * Update a setting event and optionally sync event items.
     */
    public function updateSettingEvent(int $id, array $data): SettingEvent
    {
        $event = $this->findOrFail(SettingEvent::find($id), 'Setting event');

        $event->update([
            'name' => $data['name'] ?? $event->name,
            'slug' => $data['slug'] ?? $event->slug,
            'description' => $data['description'] ?? $event->description,
            'image' => array_key_exists('image', $data) ? $data['image'] : $event->image,
            'time_start' => array_key_exists('time_start', $data) ? $data['time_start'] : $event->time_start,
            'time_end' => array_key_exists('time_end', $data) ? $data['time_end'] : $event->time_end,
            'bonus' => $data['bonus'] ?? $event->bonus,
            'daily_reward_bonus' => $data['daily_reward_bonus'] ?? $event->daily_reward_bonus,
            'is_active' => array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $event->is_active,
        ]);

        if (array_key_exists('item_ids', $data)) {
            $this->syncEventItems($event, $data['item_ids']);
        }

        return $event->fresh()->load('items');
    }

    /**
     * Generate suggested default events and persist them.
     *
     * @return array<int, SettingEvent>
     */
    public function generateSuggestedEvents(): array
    {
        $suggested = [
            [
                'name' => 'Weekend Bonus',
                'description' => 'Double rewards during the weekend.',
                'time_start' => null,
                'time_end' => null,
                'bonus' => [
                    ['label' => 'Coin', 'value' => '+50%'],
                    ['label' => 'EXP', 'value' => '+50%'],
                ],
                'daily_reward_bonus' => [],
                'is_active' => true,
                'item_ids' => [],
            ],
            [
                'name' => 'Login Event',
                'description' => 'Login daily to claim rewards.',
                'time_start' => null,
                'time_end' => null,
                'bonus' => [
                    ['label' => 'Daily Check-in', 'value' => 'Bonus rewards'],
                ],
                'daily_reward_bonus' => [],
                'is_active' => true,
                'item_ids' => [],
            ],
        ];

        $created = [];
        foreach ($suggested as $data) {
            $event = $this->createSettingEvent($data);
            $created[] = $event;
        }

        return $created;
    }

    /**
     * Delete a setting event and detach all items.
     */
    public function deleteSettingEvent(int $id): bool
    {
        $event = SettingEvent::find($id);
        if (!$event) {
            return false;
        }
        $event->items()->detach();
        return $event->delete();
    }

    /**
     * Store event image file and return relative path for storage.
     */
    public function storeEventImage(UploadedFile $file): string
    {
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $zoneId = BaseModelActions::currentUserZoneId() ?? 'default';
        $uploadPath = public_path($imagesFolder . '/events/' . $zoneId);
        File::ensureDirectoryExists($uploadPath);
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $file->move($uploadPath, $filename);
        return $imagesFolder . '/events/' . $zoneId . '/' . $filename;
    }

    /**
     * Sync event items pivot (single place to avoid duplication).
     */
    private function syncEventItems(SettingEvent $event, array $itemIds): void
    {
        $sync = [];
        foreach (array_values($itemIds) as $i => $itemId) {
            $sync[(int) $itemId] = ['sort_order' => $i];
        }
        $event->items()->sync($sync);
    }
}

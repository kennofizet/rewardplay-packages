<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingDailyReward;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardRelationshipSetting;
use Kennofizet\RewardPlay\Services\Model\Traits\BaseModelServiceTrait;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Carbon\Carbon;

class SettingDailyRewardService
{
    use BaseModelServiceTrait;
    /**
     * Get setting daily rewards with pagination and filters
     */
    public function getSettingDailyRewards(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingDailyReward::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $this->loadRelationships($query, SettingDailyRewardRelationshipSetting::class, $modeView);

        // Apply year filter using scope
        if (!empty($filters['year'])) {
            $query->byYear($filters['year']);
            $perPage = 365; // 1 year max
        }

        // Apply month filter using scope
        if (!empty($filters['month'])) {
            $query->byMonth($filters['month']);
            $perPage = 31; // 1 month max
        }

        // Apply date range filter using scope
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->byDateRange($filters['start_date'], $filters['end_date']);
            $perPage = 365; // 1 year max
        }

        // Apply active filter using scope
        if (isset($filters['is_active'])) {
            $query->byActive($filters['is_active']);
        }

        // Apply epic filter using scope
        if (isset($filters['is_epic'])) {
            $query->byEpic($filters['is_epic']);
        }

        $query->orderBy('date', 'asc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get setting daily rewards by month
     */
    public function getSettingDailyRewardsByMonth(int $year, int $month)
    {
        $query = SettingDailyReward::query();

        // Load relationships
        $this->loadRelationships($query, SettingDailyRewardRelationshipSetting::class);

        return $query->byYearAndMonth($year, $month)
            ->orderBy('date')
            ->get();
    }

    /**
     * Get setting daily rewards by date range
     */
    public function getSettingDailyRewardsByDateRange(Carbon $startDate, Carbon $endDate)
    {
        $query = SettingDailyReward::query();

        // Load relationships
        $this->loadRelationships($query, SettingDailyRewardRelationshipSetting::class);

        return $query->byDateRange($startDate, $endDate)
            ->orderBy('date')
            ->get();
    }

    /**
     * Get a single setting daily reward by ID
     */
    public function getSettingDailyReward(int $id, ?string $modeView = null): ?SettingDailyReward
    {
        $query = SettingDailyReward::query();

        // Load relationships based on mode
        $this->loadRelationships($query, SettingDailyRewardRelationshipSetting::class, $modeView);

        return $query->find($id);
    }

    /**
     * Get setting daily reward by date
     */
    public function getSettingDailyRewardByDate($date, ?string $modeView = null): ?SettingDailyReward
    {
        $query = SettingDailyReward::query();

        // Load relationships based on mode
        $this->loadRelationships($query, SettingDailyRewardRelationshipSetting::class, $modeView);

        return $query->byDate($date)->first();
    }

    /**
     * Get first next epic reward after a date
     */
    public function getFirstNextEpicReward(Carbon $startDate): ?SettingDailyReward
    {
        $query = SettingDailyReward::query();

        // Load relationships
        $this->loadRelationships($query, SettingDailyRewardRelationshipSetting::class);

        return $query->afterDate($startDate)
            ->byEpic(true)
            ->first();
    }

    /**
     * Create or update a setting daily reward
     */
    public function createOrUpdateSettingDailyReward(array $data): SettingDailyReward
    {
        // Date is already validated by Request class, no need to check again
        return SettingDailyReward::updateOrCreate(
            ['date' => $data['date']],
            [
                'items' => $data['items'] ?? [],
                'stack_bonuses' => $data['stack_bonuses'] ?? [],
                'is_epic' => $data['is_epic'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]
        );
    }

    /**
     * Update a setting daily reward
     */
    public function updateSettingDailyReward(int $id, array $data): SettingDailyReward
    {
        $settingDailyReward = $this->findOrFail(SettingDailyReward::find($id), 'Setting daily reward');

        $settingDailyReward->update([
            'items' => $data['items'] ?? $settingDailyReward->items,
            'stack_bonuses' => $data['stack_bonuses'] ?? $settingDailyReward->stack_bonuses,
            'is_epic' => $data['is_epic'] ?? $settingDailyReward->is_epic,
            'is_active' => $data['is_active'] ?? $settingDailyReward->is_active,
        ]);

        return $settingDailyReward->fresh();
    }

    public function deleteSettingDailyReward(int $id): bool
    {
        $settingDailyReward = SettingDailyReward::find($id);
        
        if (!$settingDailyReward) {
            return false;
        }

        return $settingDailyReward->delete();
    }

    public function generateSuggestedRewards(int $year, int $month): array
    {
        $monthStartDate = Carbon::createFromDate($year, $month, 1);
        $daysInMonth = $monthStartDate->daysInMonth;
        $createdDailyRewards = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $rewardDate = Carbon::createFromDate($year, $month, $day)->toDateString();

            $rewardItems = [
                ['type' => 'coin', 'quantity' => $day * 100, 'item_id' => null],
                ['type' => 'exp', 'quantity' => 50, 'item_id' => null],
            ];

            if ($day % 5 === 0) {
                $rewardItems[] = ['type' => 'ticket', 'quantity' => 1, 'item_id' => null];
            }

            $settingDailyReward = SettingDailyReward::updateOrCreate(
                ['date' => $rewardDate],
                [
                    'items' => $rewardItems,
                    'stack_bonuses' => [],
                    'is_active' => true,
                    'is_epic' => false
                ]
            );

            $createdDailyRewards[] = $settingDailyReward;
        }

        return $createdDailyRewards;
    }
}

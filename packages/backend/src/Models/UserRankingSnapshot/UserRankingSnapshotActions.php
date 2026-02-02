<?php

namespace Kennofizet\RewardPlay\Models\UserRankingSnapshot;

use Kennofizet\RewardPlay\Models\UserRankingSnapshot;
use Kennofizet\RewardPlay\Models\User;
use Carbon\Carbon;

trait UserRankingSnapshotActions
{
    /**
     * Get current period key for a period type (day, week, month, year).
     */
    public static function getCurrentPeriodKey(string $periodType): string
    {
        $now = Carbon::now();
        switch ($periodType) {
            case UserRankingSnapshotConstant::PERIOD_DAY:
                return $now->format('Y-m-d');
            case UserRankingSnapshotConstant::PERIOD_WEEK:
                return $now->format('Y-\WW'); // e.g. 2026-W05
            case UserRankingSnapshotConstant::PERIOD_MONTH:
                return $now->format('Y-m');
            case UserRankingSnapshotConstant::PERIOD_YEAR:
                return $now->format('Y');
            default:
                return $now->format('Y-m-d');
        }
    }

    /**
     * Upsert snapshot for one user for the given period (used when viewing ranking or by job).
     *
     * @param bool $withoutScopes When true, bypass global scopes (e.g. for cron snapshot).
     */
    public static function upsertForUser(int $userId, ?int $zoneId, string $periodType, string $periodKey, int $coin, int $level, int $power, bool $withoutScopes = false): UserRankingSnapshot
    {
        $query = $withoutScopes ? UserRankingSnapshot::withoutGlobalScopes() : UserRankingSnapshot::query();

        return $query->updateOrCreate(
            [
                'user_id' => $userId,
                'zone_id' => $zoneId,
                'period_type' => $periodType,
                'period_key' => $periodKey,
            ],
            [
                'coin' => $coin,
                'level' => $level,
                'power' => $power,
            ]
        );
    }

    /**
     * Get top N snapshots for a period ordered by a metric (coin, level, power).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getTopByMetric(?int $zoneId, string $periodType, string $periodKey, string $metric, int $limit = 10)
    {
        $query = UserRankingSnapshot::with('user')
            ->byZone($zoneId)
            ->byPeriod($periodType, $periodKey)
            ->orderByDesc($metric)
            ->limit($limit);

        return $query->get();
    }

    /**
     * Get rank (1-based) for a user in a period by metric (count of rows with higher value + 1).
     */
    public static function getRankByMetric(?int $zoneId, string $periodType, string $periodKey, int $userId, string $metric, int $userValue): int
    {
        $count = UserRankingSnapshot::byZone($zoneId)
            ->byPeriod($periodType, $periodKey)
            ->where($metric, '>', $userValue)
            ->count();

        return $count + 1;
    }
}

<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserProfile;
use Kennofizet\RewardPlay\Models\UserRankingSnapshot;
use Kennofizet\RewardPlay\Models\UserRankingSnapshot\UserRankingSnapshotConstant;

class RankingService
{
    /** @var int Limit for top lists */
    private const TOP_LIMIT = 10;

    /**
     * Get ranking data for a period (day, week, month, year).
     * Upserts current user snapshot then returns top coin/level/power and my ranks.
     */
    public function getRankingData(int $userId, ?int $zoneId, string $period): array
    {
        $periodType = $this->normalizePeriod($period);
        $periodKey = UserRankingSnapshot::getCurrentPeriodKey($periodType);

        $user = User::findById($userId);
        $coin = $user ? $user->getCoin() : 0;
        $level = $user ? $user->getLevel() : 1;
        $power = $user ? $user->getPower() : 0;

        UserRankingSnapshot::upsertForUser($userId, $zoneId, $periodType, $periodKey, $coin, $level, $power);

        $topCoin = $this->getTopFormatted($zoneId, $periodType, $periodKey, UserRankingSnapshotConstant::METRIC_COIN);
        $topLevel = $this->getTopFormatted($zoneId, $periodType, $periodKey, UserRankingSnapshotConstant::METRIC_LEVEL);
        $topPower = $this->getTopFormatted($zoneId, $periodType, $periodKey, UserRankingSnapshotConstant::METRIC_POWER);

        $myRankCoin = UserRankingSnapshot::getRankByMetric($zoneId, $periodType, $periodKey, $userId, UserRankingSnapshotConstant::METRIC_COIN, $coin);
        $myRankLevel = UserRankingSnapshot::getRankByMetric($zoneId, $periodType, $periodKey, $userId, UserRankingSnapshotConstant::METRIC_LEVEL, $level);
        $myRankPower = UserRankingSnapshot::getRankByMetric($zoneId, $periodType, $periodKey, $userId, UserRankingSnapshotConstant::METRIC_POWER, $power);

        return [
            'period' => $periodType,
            'period_key' => $periodKey,
            'top_coin' => $topCoin,
            'top_level' => $topLevel,
            'top_power' => $topPower,
            'my_rank_coin' => $myRankCoin,
            'my_rank_level' => $myRankLevel,
            'my_rank_power' => $myRankPower,
            'my_coin' => $coin,
            'my_level' => $level,
            'my_power' => $power,
        ];
    }

    /**
     * Get top list for a metric, formatted for API (id, name, avatar, coin, level, power, type).
     * Pads with placeholder rows (name "---", coin 0, level 1, power 0) when list has fewer than TOP_LIMIT.
     */
    private function getTopFormatted(?int $zoneId, string $periodType, string $periodKey, string $metric): array
    {
        $snapshots = UserRankingSnapshot::getTopByMetric($zoneId, $periodType, $periodKey, $metric, self::TOP_LIMIT);

        $list = $snapshots->map(function ($snapshot) {
            return $this->formatRankingRow($snapshot);
        })->values()->toArray();

        return $this->padRankingList($list);
    }

    /**
     * Pad list with placeholder rows up to TOP_LIMIT for FE render (name "---", coin 0, level 1, power 0).
     */
    private function padRankingList(array $list): array
    {
        $count = count($list);
        if ($count >= self::TOP_LIMIT) {
            return $list;
        }

        $placeholders = [];
        for ($i = $count; $i < self::TOP_LIMIT; $i++) {
            $placeholders[] = $this->placeholderRow(-($i + 1));
        }

        return array_merge($list, $placeholders);
    }

    /**
     * Single placeholder row for ranking list (fake profile for FE).
     */
    private function placeholderRow(int $id): array
    {
        return [
            'id' => $id,
            'name' => '---',
            'avatar' => null,
            'coin' => 0,
            'level' => 1,
            'power' => 0,
            'type' => 'BOT',
        ];
    }

    /**
     * Format a snapshot (with user relation) to API row.
     */
    private function formatRankingRow(UserRankingSnapshot $snapshot): array
    {
        $user = $snapshot->user;

        return [
            'name' => $user ? ($user->name ?? 'Player ' . $snapshot->user_id) : 'Player ' . $snapshot->user_id,
            'avatar' => $user ? ($user->avatar ?? null) : null,
            'coin' => $snapshot->coin,
            'level' => $snapshot->level,
            'power' => $snapshot->power,
            'type' => 'USER',
        ];
    }

    private function normalizePeriod(string $period): string
    {
        $period = strtolower($period);
        $allowed = [
            UserRankingSnapshotConstant::PERIOD_DAY,
            UserRankingSnapshotConstant::PERIOD_WEEK,
            UserRankingSnapshotConstant::PERIOD_MONTH,
            UserRankingSnapshotConstant::PERIOD_YEAR,
        ];

        return in_array($period, $allowed, true) ? $period : UserRankingSnapshotConstant::PERIOD_DAY;
    }

    /**
     * Snapshot all users' current coin/level/power for the given period (for cron/job).
     */
    public function snapshotAllUsers(?int $zoneId = null): void
    {
        $periodTypes = [
            UserRankingSnapshotConstant::PERIOD_DAY,
            UserRankingSnapshotConstant::PERIOD_WEEK,
            UserRankingSnapshotConstant::PERIOD_MONTH,
            UserRankingSnapshotConstant::PERIOD_YEAR,
        ];

        $profiles = UserProfile::withoutGlobalScopes()
            ->when($zoneId !== null, fn ($q) => $q->where('zone_id', $zoneId))
            ->get();

        foreach ($profiles as $profile) {
            $user = User::findById($profile->user_id);
            if (!$user) {
                continue;
            }
            $coin = $user->getCoin();
            $level = $user->getLevel();
            $power = $user->getPower();
            $zid = $profile->zone_id ?? $zoneId;

            foreach ($periodTypes as $periodType) {
                $periodKey = UserRankingSnapshot::getCurrentPeriodKey($periodType);
                UserRankingSnapshot::upsertForUser(
                    (int) $profile->user_id,
                    $zid,
                    $periodType,
                    $periodKey,
                    $coin,
                    $level,
                    $power,
                    true
                );
            }
        }
    }
}

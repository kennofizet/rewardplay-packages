<?php

namespace Kennofizet\RewardPlay\Commands;

use Illuminate\Console\Command;
use Kennofizet\RewardPlay\Services\Player\RankingService;

class SnapshotRankingCommand extends Command
{
    protected $signature = 'rewardplay:snapshot-ranking {--zone= : Zone ID (optional, snapshots all zones if omitted)}';

    protected $description = 'Snapshot all users coin/level/power for ranking (day/week/month/year). Run via cron for fresh leaderboards.';

    public function handle(RankingService $rankingService): int
    {
        $zoneId = $this->option('zone') ? (int) $this->option('zone') : null;
        $this->info('Snapshotting ranking data' . ($zoneId ? " for zone {$zoneId}" : ' for all zones') . '...');

        $rankingService->snapshotAllUsers($zoneId);

        $this->info('Done.');
        return Command::SUCCESS;
    }
}

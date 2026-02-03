<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add deleted_at (soft deletes) to all tables of models that extend BaseModel
 * and do not yet have the column. BaseModel uses SoftDeletes by default.
 */
return new class extends Migration
{
    /**
     * List of model class names that extend BaseModel (RewardPlay package).
     * User extends Model; ZoneUser extends Pivot - excluded.
     *
     * @return array<int, string>
     */
    protected function baseModelClasses(): array
    {
        return [
            \Kennofizet\RewardPlay\Models\SettingEvent::class,
            \Kennofizet\RewardPlay\Models\SettingShopItem::class,
            \Kennofizet\RewardPlay\Models\UserProfile::class,
            \Kennofizet\RewardPlay\Models\UserRankingSnapshot::class,
            \Kennofizet\RewardPlay\Models\UserEventTransaction::class,
            \Kennofizet\RewardPlay\Models\SettingStatsTransform::class,
            \Kennofizet\RewardPlay\Models\SettingLevelExp::class,
            \Kennofizet\RewardPlay\Models\UserBagItem::class,
            \Kennofizet\RewardPlay\Models\Zone::class,
            \Kennofizet\RewardPlay\Models\SettingItemSet::class,
            \Kennofizet\RewardPlay\Models\SettingItem::class,
            \Kennofizet\RewardPlay\Models\UserDailyStatus::class,
            \Kennofizet\RewardPlay\Models\SettingStackBonus::class,
            \Kennofizet\RewardPlay\Models\SettingDailyReward::class,
            \Kennofizet\RewardPlay\Models\SettingOption::class,
            \Kennofizet\RewardPlay\Models\SettingItemSetItem::class,
            \Kennofizet\RewardPlay\Models\ZoneManager::class,
            \Kennofizet\RewardPlay\Models\Token::class,
            \Kennofizet\RewardPlay\Models\ServerManager::class,
        ];
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->baseModelClasses() as $class) {
            if (!class_exists($class)) {
                continue;
            }

            try {
                $model = new $class();
                $table = $model->getTable();
            } catch (\Throwable $e) {
                continue;
            }

            if (!Schema::hasTable($table)) {
                continue;
            }

            if (Schema::hasColumn($table, 'deleted_at')) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->baseModelClasses() as $class) {
            if (!class_exists($class)) {
                continue;
            }

            try {
                $model = new $class();
                $table = $model->getTable();
            } catch (\Throwable $e) {
                continue;
            }

            if (!Schema::hasTable($table)) {
                continue;
            }

            if (!Schema::hasColumn($table, 'deleted_at')) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropSoftDeletes();
            });
        }
    }
};

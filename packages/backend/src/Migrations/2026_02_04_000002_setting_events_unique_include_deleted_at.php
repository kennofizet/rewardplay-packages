<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingEvent;

return new class extends Migration
{
    /**
     * With soft deletes, the old unique (zone_id, slug) blocks reusing the same
     * zone+slug after deleting an event. Use a normal column n_deleted_at (kept
     * in sync via triggers) so uniqueness applies only to non-deleted rows: one
     * active row per (zone_id, slug); deleted rows get distinct n_deleted_at and
     * do not block re-creating the slug. Triggers are used instead of GENERATED
     * ALWAYS AS so the migration runs on all MySQL/MariaDB versions (many hosts
     * disallow IFNULL in generated columns).
     */
    public function up(): void
    {
        $tableName = (new SettingEvent())->getTable();
        $triggerBi = $tableName . '_n_deleted_at_bi';
        $triggerBu = $tableName . '_n_deleted_at_bu';

        if (!Schema::hasTable($tableName)) {
            return;
        }

        if (!Schema::hasColumn($tableName, 'deleted_at')) {
            return;
        }

        $indexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = 'uk_setting_events_zone_slug' LIMIT 1",
            [$tableName]
        );
        if ($indexExists) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropUnique('uk_setting_events_zone_slug');
            });
        }

        if (!Schema::hasColumn($tableName, 'n_deleted_at')) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dateTime('n_deleted_at')->default('1980-01-01 00:00:00');
            });
            DB::statement("UPDATE `{$tableName}` SET `n_deleted_at` = IFNULL(`deleted_at`, '1980-01-01 00:00:00')");
            DB::statement("CREATE TRIGGER `{$triggerBi}` BEFORE INSERT ON `{$tableName}` FOR EACH ROW SET NEW.`n_deleted_at` = IFNULL(NEW.`deleted_at`, '1980-01-01 00:00:00')");
            DB::statement("CREATE TRIGGER `{$triggerBu}` BEFORE UPDATE ON `{$tableName}` FOR EACH ROW SET NEW.`n_deleted_at` = IFNULL(NEW.`deleted_at`, '1980-01-01 00:00:00')");
        }

        $newIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = 'uk_setting_events_zone_slug_deleted_at' LIMIT 1",
            [$tableName]
        );
        if (!$newIndexExists) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->unique(['zone_id', 'slug', 'n_deleted_at'], 'uk_setting_events_zone_slug_deleted_at');
            });
        }
    }

    public function down(): void
    {
        $tableName = (new SettingEvent())->getTable();
        $triggerBi = $tableName . '_n_deleted_at_bi';
        $triggerBu = $tableName . '_n_deleted_at_bu';

        if (!Schema::hasTable($tableName)) {
            return;
        }

        $newIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = 'uk_setting_events_zone_slug_deleted_at' LIMIT 1",
            [$tableName]
        );
        if ($newIndexExists) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropUnique('uk_setting_events_zone_slug_deleted_at');
            });
        }

        if (Schema::hasColumn($tableName, 'n_deleted_at')) {
            DB::statement("DROP TRIGGER IF EXISTS `{$triggerBi}`");
            DB::statement("DROP TRIGGER IF EXISTS `{$triggerBu}`");
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('n_deleted_at');
            });
        }

        $oldIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = 'uk_setting_events_zone_slug' LIMIT 1",
            [$tableName]
        );
        if (!$oldIndexExists) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->unique(['zone_id', 'slug'], 'uk_setting_events_zone_slug');
            });
        }
    }
};

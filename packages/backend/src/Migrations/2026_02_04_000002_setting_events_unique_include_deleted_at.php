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
     * zone+slug after deleting an event. Use a generated column so uniqueness
     * applies only to non-deleted rows: one active row per (zone_id, slug);
     * deleted rows get distinct deleted_at and do not block re-creating the slug.
     */
    public function up(): void
    {
        $tableName = (new SettingEvent())->getTable();

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
            // Use IFNULL for MariaDB compatibility (COALESCE can trigger ER_GENERATED_COLUMN_FUNCTION_IS_NOT_ALLOWED)
            DB::statement("ALTER TABLE `{$tableName}` ADD COLUMN `n_deleted_at` DATETIME GENERATED ALWAYS AS (IFNULL(`deleted_at`, '1980-01-01 00:00:00')) STORED");
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
            DB::statement("ALTER TABLE `{$tableName}` DROP COLUMN `n_deleted_at`");
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

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItem;

return new class extends Migration
{
    /**
     * Uniqueness for settings_items slug must be per zone.
     * Change unique from (slug, n_deleted_at) to (zone_id, slug, n_deleted_at)
     * so the same slug can exist in different zones.
     */
    public function up(): void
    {
        $tableName = (new SettingItem())->getTable();

        if (!Schema::hasTable($tableName)) {
            return;
        }

        if (!Schema::hasColumn($tableName, 'zone_id') || !Schema::hasColumn($tableName, 'n_deleted_at')) {
            return;
        }

        $oldIndexName = 'uk_settings_items_slug_deleted_at';
        $oldIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $oldIndexName]
        );
        if ($oldIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($oldIndexName) {
                $table->dropUnique($oldIndexName);
            });
        }

        $newIndexName = 'uk_settings_items_zone_slug_deleted_at';
        $newIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $newIndexName]
        );
        if (!$newIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($newIndexName) {
                $table->unique(['zone_id', 'slug', 'n_deleted_at'], $newIndexName);
            });
        }
    }

    public function down(): void
    {
        $tableName = (new SettingItem())->getTable();

        if (!Schema::hasTable($tableName)) {
            return;
        }

        $newIndexName = 'uk_settings_items_zone_slug_deleted_at';
        $newIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $newIndexName]
        );
        if ($newIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($newIndexName) {
                $table->dropUnique($newIndexName);
            });
        }

        $oldIndexName = 'uk_settings_items_slug_deleted_at';
        $oldIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $oldIndexName]
        );
        if (!$oldIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($oldIndexName) {
                $table->unique(['slug', 'n_deleted_at'], $oldIndexName);
            });
        }
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Kennofizet\RewardPlay\Models\SettingItem;

return new class extends Migration
{
    /**
     * With soft deletes, the unique on slug blocks reusing the same slug after
     * deleting an item. Use a generated column so uniqueness applies only to
     * non-deleted rows; deleted rows do not block re-creating the slug.
     */
    public function up(): void
    {
        $tableName = (new SettingItem())->getTable();

        if (!Schema::hasTable($tableName)) {
            return;
        }

        if (!Schema::hasColumn($tableName, 'deleted_at')) {
            return;
        }

        // Laravel creates unique index name: {table}_slug_unique
        $oldIndexName = $tableName . '_slug_unique';
        $indexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $oldIndexName]
        );
        if ($indexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($oldIndexName) {
                $table->dropUnique($oldIndexName);
            });
        }

        if (!Schema::hasColumn($tableName, 'n_deleted_at')) {
            // Use IFNULL for MariaDB compatibility (COALESCE can trigger ER_GENERATED_COLUMN_FUNCTION_IS_NOT_ALLOWED)
            DB::statement("ALTER TABLE `{$tableName}` ADD COLUMN `n_deleted_at` DATETIME GENERATED ALWAYS AS (IFNULL(`deleted_at`, '1980-01-01 00:00:00')) STORED");
        }

        $newIndexName = 'uk_settings_items_slug_deleted_at';
        $newIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $newIndexName]
        );
        if (!$newIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($newIndexName) {
                $table->unique(['slug', 'n_deleted_at'], $newIndexName);
            });
        }
    }

    public function down(): void
    {
        $tableName = (new SettingItem())->getTable();

        if (!Schema::hasTable($tableName)) {
            return;
        }

        $newIndexName = 'uk_settings_items_slug_deleted_at';
        $newIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $newIndexName]
        );
        if ($newIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($newIndexName) {
                $table->dropUnique($newIndexName);
            });
        }

        if (Schema::hasColumn($tableName, 'n_deleted_at')) {
            DB::statement("ALTER TABLE `{$tableName}` DROP COLUMN `n_deleted_at`");
        }

        $oldIndexName = $tableName . '_slug_unique';
        $oldIndexExists = DB::selectOne(
            "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1",
            [$tableName, $oldIndexName]
        );
        if (!$oldIndexExists) {
            Schema::table($tableName, function (Blueprint $table) use ($oldIndexName) {
                $table->unique('slug', $oldIndexName);
            });
        }
    }
};

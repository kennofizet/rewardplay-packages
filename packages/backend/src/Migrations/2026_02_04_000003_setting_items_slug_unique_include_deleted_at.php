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
     * deleting an item. Use a normal column n_deleted_at (kept in sync via
     * triggers) so uniqueness applies only to non-deleted rows; deleted rows do
     * not block re-creating the slug. Triggers are used instead of GENERATED
     * ALWAYS AS so the migration runs on all MySQL/MariaDB versions (many hosts
     * disallow IFNULL in generated columns).
     */
    public function up(): void
    {
        $tableName = (new SettingItem())->getTable();
        $triggerBi = $tableName . '_n_deleted_at_bi';
        $triggerBu = $tableName . '_n_deleted_at_bu';

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
            Schema::table($tableName, function (Blueprint $table) {
                $table->dateTime('n_deleted_at')->default('1980-01-01 00:00:00');
            });
            DB::statement("UPDATE `{$tableName}` SET `n_deleted_at` = IFNULL(`deleted_at`, '1980-01-01 00:00:00')");
            DB::statement("CREATE TRIGGER `{$triggerBi}` BEFORE INSERT ON `{$tableName}` FOR EACH ROW SET NEW.`n_deleted_at` = IFNULL(NEW.`deleted_at`, '1980-01-01 00:00:00')");
            DB::statement("CREATE TRIGGER `{$triggerBu}` BEFORE UPDATE ON `{$tableName}` FOR EACH ROW SET NEW.`n_deleted_at` = IFNULL(NEW.`deleted_at`, '1980-01-01 00:00:00')");
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
        $triggerBi = $tableName . '_n_deleted_at_bi';
        $triggerBu = $tableName . '_n_deleted_at_bu';

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
            DB::statement("DROP TRIGGER IF EXISTS `{$triggerBi}`");
            DB::statement("DROP TRIGGER IF EXISTS `{$triggerBu}`");
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('n_deleted_at');
            });
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

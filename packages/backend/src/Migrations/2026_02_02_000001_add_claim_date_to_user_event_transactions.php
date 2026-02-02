<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     * Allow one transaction per (user, zone, model_type, model_id) per claim date
     * so the same user can claim the same stack bonus (e.g. day 1) again on a different day after streak reset.
     */
    public function up(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserEventTransaction())->getTable();

        Schema::table($tableName, function (Blueprint $table) {
            $table->date('claim_date')->nullable()->after('model_id');
        });

        // Backfill claim_date from created_at for existing rows
        DB::table($tableName)->whereNull('claim_date')->update([
            'claim_date' => DB::raw('DATE(created_at)'),
        ]);

        // Make claim_date non-null (raw alter to avoid requiring doctrine/dbal)
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `{$tableName}` MODIFY `claim_date` DATE NOT NULL");
        }

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropUnique('uk_user_event');
            $table->unique(['user_id', 'zone_id', 'model_type', 'model_id', 'claim_date'], 'uk_user_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = (new \Kennofizet\RewardPlay\Models\UserEventTransaction())->getTable();

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropUnique('uk_user_event');
            $table->unique(['user_id', 'zone_id', 'model_type', 'model_id'], 'uk_user_event');
        });

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropColumn('claim_date');
        });
    }
};

<?php

namespace Kennofizet\RewardPlay\Core\Model;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait BaseModelManage
{
    /**
     * Check if table has column
     */
    public static function tableHasColumn(string $table, string $column): bool
    {
        $columns = Schema::getColumnListing($table);
        return isset($columns[$column]) ? true : false;
    }
}

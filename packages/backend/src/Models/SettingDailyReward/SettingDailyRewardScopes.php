<?php

namespace Kennofizet\RewardPlay\Models\SettingDailyReward;

use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

/**
 * SettingDailyReward Model Scopes
 */
trait SettingDailyRewardScopes
{
    /**
     * Scope to filter by date
     * 
     * @param Builder $query
     * @param string|Carbon $date
     * @return Builder
     */
    public function scopeByDate(Builder $query, $date)
    {
        return $query->whereDate('date', $date);
    }

    /**
     * Scope to filter by year
     * 
     * @param Builder $query
     * @param int $year
     * @return Builder
     */
    public function scopeByYear(Builder $query, int $year)
    {
        return $query->whereYear('date', $year);
    }

    /**
     * Scope to filter by month
     * 
     * @param Builder $query
     * @param int $month
     * @return Builder
     */
    public function scopeByMonth(Builder $query, int $month)
    {
        return $query->whereMonth('date', $month);
    }

    /**
     * Scope to filter by year and month
     * 
     * @param Builder $query
     * @param int $year
     * @param int $month
     * @return Builder
     */
    public function scopeByYearAndMonth(Builder $query, int $year, int $month)
    {
        return $query->byYear($year)->byMonth($month);
    }

    /**
     * Scope to filter by date range
     * 
     * @param Builder $query
     * @param Carbon|string $startDate
     * @param Carbon|string $endDate
     * @return Builder
     */
    public function scopeByDateRange(Builder $query, $startDate, $endDate)
    {
        $start = $startDate instanceof Carbon ? $startDate->toDateString() : $startDate;
        $end = $endDate instanceof Carbon ? $endDate->toDateString() : $endDate;
        return $query->whereBetween('date', [$start, $end]);
    }

    /**
     * Scope to filter by is_active
     * 
     * @param Builder $query
     * @param bool $isActive
     * @return Builder
     */
    public function scopeByActive(Builder $query, bool $isActive = true)
    {
        return $query->where('is_active', $isActive);
    }

    /**
     * Scope to filter by is_epic
     * 
     * @param Builder $query
     * @param bool $isEpic
     * @return Builder
     */
    public function scopeByEpic(Builder $query, bool $isEpic = true)
    {
        return $query->where('is_epic', $isEpic);
    }

    /**
     * Scope to filter by date after
     * 
     * @param Builder $query
     * @param Carbon|string $date
     * @return Builder
     */
    public function scopeAfterDate(Builder $query, $date)
    {
        $dateString = $date instanceof Carbon ? $date->toDateString() : $date;
        return $query->whereDate('date', '>', $dateString);
    }
}

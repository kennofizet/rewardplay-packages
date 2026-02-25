<?php

namespace Kennofizet\RewardPlay\Core\Model;

use Kennofizet\PackagesCore\Core\Model\BaseModel as CoreBaseModel;

/**
 * RewardPlay BaseModel
 *
 * Extends packages-core BaseModel which already provides:
 * - BaseModelActions (currentUserZoneId, currentServerId, getPivotTableName, etc.)
 * - BaseModelScopes (isInZone, withoutDeleteStatus, returnNull)
 * - BaseModelManage (tableHasColumn, etc.)
 * - BaseModelRelations
 * - SoftDeletes + global zone/delete scopes
 *
 * RewardPlay-specific override: the without_delete_status scope's $array_skips
 * reference PackagesCore User (already set in CoreBaseModel), so no override needed.
 */
class BaseModel extends CoreBaseModel
{
    // Rewardplay models extend this, which inherits everything from CoreBaseModel.
    // Add any rewardplay-specific boot logic here if needed in the future.
}
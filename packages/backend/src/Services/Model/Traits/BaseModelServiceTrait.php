<?php

namespace Kennofizet\RewardPlay\Services\Model\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

/**
 * Base trait for model services
 * Provides common methods for CRUD operations
 */
trait BaseModelServiceTrait
{
    /**
     * Load relationships on query based on mode
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $relationshipSettingClass - Full class name of RelationshipSetting
     * @param string|null $modeView
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function loadRelationships($query, string $relationshipSettingClass, ?string $modeView = null)
    {
        $withRelationships = $relationshipSettingClass::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }
        return $query;
    }

    /**
     * Find model or throw validation exception
     * 
     * @param Model|null $model
     * @param string $modelName - Name for error message (e.g., 'Setting daily reward')
     * @return Model
     * @throws ValidationException
     */
    protected function findOrFail(?Model $model, string $modelName): Model
    {
        if (!$model) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', $modelName . ' not found')
            );
        }
        return $model;
    }
}

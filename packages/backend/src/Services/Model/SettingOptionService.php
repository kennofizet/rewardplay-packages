<?php

namespace Kennofizet\RewardPlay\Services\Model;

use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Models\SettingOption\SettingOptionRelationshipSetting;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Repositories\Model\SettingOptionRepository;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\SettingOptionValidationService;
use Illuminate\Validation\ValidationException;

class SettingOptionService
{
    protected $settingOptionRepository;
    protected $validation;

    public function __construct(
        SettingOptionRepository $settingOptionRepository,
        SettingOptionValidationService $validation
    ) {
        $this->settingOptionRepository = $settingOptionRepository;
        $this->validation = $validation;
    }

    /**
     * Get setting options with pagination and filters
     */
    public function getSettingOptions(array $filters = [], ?string $modeView = null)
    {
        $perPage = $filters['perPage'] ?? HelperConstant::PER_PAGE_DEFAULT;
        $page = $filters['currentPage'] ?? 1;

        $query = SettingOption::query();

        // Load relationships based on mode - always eager load to prevent N+1
        $withRelationships = SettingOptionRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        // Apply search filter
        if (!empty($filters['keySearch']) || !empty($filters['q'])) {
            $search = $filters['keySearch'] ?? $filters['q'];
            $query->search($search);
        }

        // Paginate results
        return $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a single setting option by ID
     */
    public function getSettingOption(int $id, ?string $modeView = null): ?SettingOption
    {
        $query = SettingOption::query();

        // Load relationships based on mode
        $withRelationships = SettingOptionRelationshipSetting::buildWithArray($modeView);
        if (!empty($withRelationships)) {
            $query->with($withRelationships);
        }

        return $query->find($id);
    }

    /**
     * Create a new setting option
     */
    public function createSettingOption(array $data): SettingOption
    {
        // Validate data
        $this->validation->validateSettingOption($data);

        // Create setting option
        return $this->settingOptionRepository->create($data);
    }

    /**
     * Update a setting option
     */
    public function updateSettingOption(int $id, array $data): SettingOption
    {
        $settingOption = SettingOption::findById($id);
        
        if (!$settingOption) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', 'Setting option not found')
            );
        }

        // Validate data
        $this->validation->validateSettingOption($data, $id);

        // Update setting option
        return $this->settingOptionRepository->update($settingOption, $data);
    }

    /**
     * Delete a setting option
     */
    public function deleteSettingOption(int $id): bool
    {
        $settingOption = SettingOption::findById($id);
        
        if (!$settingOption) {
            throw new ValidationException(
                \Illuminate\Support\Facades\Validator::make([], [])->errors()->add('id', 'Setting option not found')
            );
        }

        return $this->settingOptionRepository->delete($settingOption);
    }
}

<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\SettingItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

class SettingItemRepository
{
    /**
     * Handle image upload and return relative path
     * 
     * @param UploadedFile|null $imageFile
     * @return string|null
     */
    protected function handleImageUpload(?UploadedFile $imageFile): ?string
    {
        if (!$imageFile) {
            return null;
        }
        
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $uploadPath = public_path($imagesFolder . '/items/' . BaseModelActions::currentUserZoneId());
        
        // Ensure directory exists
        File::ensureDirectoryExists($uploadPath);
        
        // Generate unique filename
        $extension = $imageFile->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        
        // Move uploaded file
        $imageFile->move($uploadPath, $filename);
        
        // Return relative path
        return $imagesFolder . '/items/' . BaseModelActions::currentUserZoneId() . '/' . $filename;
    }

    /**
     * Delete image file if exists
     * 
     * @param string|null $imagePath
     * @return void
     */
    protected function deleteImageFile(?string $imagePath): void
    {
        if ($imagePath) {
            $fullPath = public_path($imagePath);
            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }
        }
    }

    /**
     * Create a new setting item
     * 
     * @param array $data
     * @param UploadedFile|null $imageFile
     * @return SettingItem
     */
    public function create(array $data, ?UploadedFile $imageFile = null): SettingItem
    {
        // Handle image upload
        if ($imageFile) {
            $data['image'] = $this->handleImageUpload($imageFile);
        }

        return SettingItem::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'type' => $data['type'] ?? '',
            'default_property' => $data['default_property'] ?? null,
            'custom_stats' => $data['custom_stats'] ?? null,
            'image' => $data['image'] ?? null
        ]);
    }

    /**
     * Update a setting item
     * 
     * @param SettingItem $settingItem
     * @param array $data
     * @param UploadedFile|null $imageFile
     * @return SettingItem
     */
    public function update(SettingItem $settingItem, array $data, ?UploadedFile $imageFile = null): SettingItem
    {
        // Handle image upload
        if ($imageFile) {
            // Delete old image if exists
            $this->deleteImageFile($settingItem->image);
            
            // Upload new image
            $data['image'] = $this->handleImageUpload($imageFile);
        }

        $updateData = [];
        
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }
        if (isset($data['type'])) {
            $updateData['type'] = $data['type'];
        }
        $updateData['default_property'] = $data['default_property'] ?? null;
        $updateData['custom_stats'] = $data['custom_stats'] ?? null;
        if (isset($data['image'])) {
            $updateData['image'] = $data['image'];
        }

        $settingItem->update($updateData);

        return $settingItem;
    }

    /**
     * Delete a setting item
     * 
     * @param SettingItem $settingItem
     * @return bool
     */
    public function delete(SettingItem $settingItem): bool
    {
        // Soft delete: do not remove image files from disk so items can be restored later.
        // The model uses SoftDeletes trait, so calling delete() will set deleted_at.
        // $this->deleteImageFile($settingItem->image);

        return (bool) $settingItem->delete();
    }
}


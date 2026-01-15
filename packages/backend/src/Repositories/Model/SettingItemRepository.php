<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\SettingItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SettingItemRepository
{
    /**
     * Handle image upload and return relative path
     * 
     * @param UploadedFile|null $imageFile
     * @param int|null $zoneId
     * @return string|null
     */
    protected function handleImageUpload(?UploadedFile $imageFile, ?int $zoneId): ?string
    {
        if (!$imageFile || !$zoneId) {
            return null;
        }

        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $uploadPath = public_path($imagesFolder . '/items/' . $zoneId);
        
        // Ensure directory exists
        File::ensureDirectoryExists($uploadPath);
        
        // Generate unique filename
        $extension = $imageFile->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        
        // Move uploaded file
        $imageFile->move($uploadPath, $filename);
        
        // Return relative path
        return $imagesFolder . '/items/' . $zoneId . '/' . $filename;
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
        $zoneId = $data['zone_id'] ?? null;

        // Handle image upload
        if ($imageFile) {
            $data['image'] = $this->handleImageUpload($imageFile, $zoneId);
        }

        return SettingItem::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'type' => $data['type'] ?? '',
            'default_property' => $data['default_property'] ?? null,
            'image' => $data['image'] ?? null,
            'zone_id' => $zoneId,
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
        $zoneId = $data['zone_id'] ?? $settingItem->zone_id;

        // Handle image upload
        if ($imageFile) {
            // Delete old image if exists
            $this->deleteImageFile($settingItem->image);
            
            // Upload new image
            $data['image'] = $this->handleImageUpload($imageFile, $zoneId);
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
        if (isset($data['default_property'])) {
            $updateData['default_property'] = $data['default_property'];
        }
        if (isset($data['image'])) {
            $updateData['image'] = $data['image'];
        }
        if (isset($data['zone_id'])) {
            $updateData['zone_id'] = $data['zone_id'];
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
        // Delete associated image file
        $this->deleteImageFile($settingItem->image);

        return (bool) $settingItem->delete();
    }
}


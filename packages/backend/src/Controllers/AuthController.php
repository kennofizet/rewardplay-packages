<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\TokenService;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class AuthController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * Get image manifest file with CORS headers
     * Includes custom global images in the 'custom' key
     */
    public function getImageManifest()
    {
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $manifestPath = public_path($imagesFolder . '/image-manifest.json');
        $customFolder = public_path($imagesFolder . '/'. config('rewardplay.custom_global_images_folder', 'custom/global'));
        $cachePath = $customFolder .'/.cache.json';
        $now = Carbon::now();

        if (!File::exists($manifestPath)) {
            return $this->apiErrorResponse('Manifest file not found', 404);
        }

        $manifest = json_decode(File::get($manifestPath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->apiErrorResponse('Invalid manifest file', 500);
        }

        // Get custom global images with 5-minute cache
        $customManifest = [];
        $shouldRefresh = true;

        // Check if cache file exists in custom folder
        if (File::exists($cachePath)) {
            $cached = json_decode(File::get($cachePath), true);
            if (is_array($cached) && isset($cached['timestamp'])) {
                $last = Carbon::createFromTimestamp((int)$cached['timestamp']);
                if ($last && $last->diffInMinutes($now) < 5) {
                    // Remove timestamp from cached data to get the manifest structure
                    unset($cached['timestamp']);
                    $customManifest = $cached;
                    $shouldRefresh = false;
                }
            }
        }

        // If cache doesn't exist or is expired, scan folder and create/update cache
        if ($shouldRefresh) {
            $customManifest = [];
            
            if (File::isDirectory($customFolder)) {
                $customFiles = collect(File::files($customFolder))
                    ->map(fn($file) => $file->getFilename())
                    ->values()
                    ->toArray();

                // Build custom manifest structure matching image-manifest.json format
                // Map custom filenames to manifest keys
                foreach ($customFiles as $filename) {
                    $customBase = strtolower(pathinfo($filename, PATHINFO_FILENAME));
                    $found = false;
                    
                    // Try to find matching key in manifest by filename
                    // e.g., "coin.png" matches "global.coin" if manifest has "global.coin": "global/coin-df.png"
                    foreach ($manifest as $key => $value) {
                        // Extract filename from manifest value (e.g., "global/coin-df.png" -> "coin-df.png")
                        $manifestFilename = basename($value);
                        $manifestBase = strtolower(pathinfo($manifestFilename, PATHINFO_FILENAME));
                        
                        // Remove common suffixes like "-df", "-default" from manifest base for better matching
                        $manifestBaseClean = preg_replace('/[-_](df|default|def)$/i', '', $manifestBase);
                        $customBaseClean = preg_replace('/[-_](df|default|def)$/i', '', $customBase);
                        
                        // Match if base names match (exact or after cleaning)
                        if ($customBase === $manifestBase || 
                            $customBaseClean === $manifestBaseClean ||
                            strpos($manifestBase, $customBase) === 0 || 
                            strpos($customBase, $manifestBase) === 0 ||
                            strpos($manifestBaseClean, $customBaseClean) === 0 ||
                            strpos($customBaseClean, $manifestBaseClean) === 0) {
                            // Use the custom folder path relative to images folder
                            $customFolderRelative = config('rewardplay.custom_global_images_folder', 'custom/global');
                            $customManifest[$key] = $customFolderRelative . '/' . $filename;
                            $found = true;
                            break;
                        }
                    }
                    
                    // If no match found, try to infer key from filename for global images
                    if (!$found && preg_match('/^(coin|ticket|box[-_]?coin|epic[-_]?chest|reward)/i', $customBase)) {
                        // Normalize the base name to match manifest key format
                        $normalized = str_replace(['-', '_'], '', $customBase);
                        $potentialKey = 'global.' . $normalized;
                        
                        // Only add if it doesn't already exist in custom manifest
                        if (!isset($customManifest[$potentialKey])) {
                            $customFolderRelative = config('rewardplay.custom_global_images_folder', 'custom/global');
                            $customManifest[$potentialKey] = $customFolderRelative . '/' . $filename;
                        }
                    }
                }
            }

            // Ensure custom folder exists before creating cache file
            File::ensureDirectoryExists($customFolder);
            
            // Create/update cache file in custom folder with manifest structure
            $cacheData = $customManifest;
            $cacheData['timestamp'] = $now->timestamp;
            File::put($cachePath, json_encode($cacheData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }

        // Merge custom manifest into main manifest (custom entries replace manifest entries)
        $manifest = array_merge($manifest, $customManifest);

        return response()->json($manifest)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type');
    }

    /**
     * Check user authentication
     */
    public function checkUser(Request $request)
    {
        $token = $request->header('X-RewardPlay-Token');

        if (!$token) {
            return $this->apiErrorResponse('Token is required', 401);
        }

        $user = $this->tokenService->checkUser($token);

        if (!$user) {
            return $this->apiErrorResponse('Invalid or inactive token', 401);
        }

        // Get images folder URL from config
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $imagesUrl = url($imagesFolder);

        return $this->apiResponseWithContext([
            'images_url' => $imagesUrl,
        ]);
    }

    /**
     * Get user data
     */
    public function getUserData(Request $request)
    {
        $token = $request->header('X-RewardPlay-Token');

        if (!$token) {
            return $this->apiErrorResponse('Token is required', 401);
        }

        $user = $this->tokenService->checkUser($token);

        if (!$user) {
            return $this->apiErrorResponse('Invalid or inactive token', 401);
        }

        // Item details mapping (id, image, name only - no property)
        $itemDetails = [
            1 => [
                'id' => 1,
                'key_image' => 'bag.sword',
                'name' => 'Sword',
            ],
            2 => [
                'id' => 2,
                'key_image' => 'bag.hat',
                'name' => 'Hat',
            ],
            3 => [
                'id' => 3,
                'key_image' => 'bag.shirt',
                'name' => 'Shirt',
            ],
            4 => [
                'id' => 4,
                'key_image' => 'bag.necklace',
                'name' => 'Necklace',
            ],
            5 => [
                'id' => 5,
                'key_image' => 'bag.bracelet',
                'name' => 'Bracelet',
            ],
            6 => [
                'id' => 6,
                'key_image' => 'bag.ring',
                'name' => 'Ring',
            ],
            7 => [
                'id' => 7,
                'key_image' => 'bag.wing',
                'name' => 'Wing',
            ],
        ];

        // Bag items (general items)
        $bagItems = [
            [
                'id' => 1,
                'item_id' => 1,
                'quantity' => 1,
                'property' => [
                    'crit' => 15,
                    'crit_dmg' => 50,
                    'attack' => 100,
                    'defense' => 20,
                ]
            ],
            [
                'id' => 2,
                'item_id' => 2,
                'quantity' => 3,
                'property' => [
                    'crit' => 10,
                    'crit_dmg' => 30,
                    'attack' => 50,
                    'defense' => 80,
                ]
            ],
            [
                'id' => 3,
                'item_id' => 3,
                'quantity' => 4,
                'property' => [
                    'crit' => 5,
                    'crit_dmg' => 20,
                    'attack' => 30,
                    'defense' => 120,
                ]
            ],
            [
                'id' => 4,
                'item_id' => 4,
                'quantity' => 5,
                'property' => [
                    'crit' => 20,
                    'crit_dmg' => 60,
                    'attack' => 80,
                    'defense' => 10,
                ]
            ],
            [
                'id' => 5,
                'item_id' => 5,
                'quantity' => 6,
                'property' => [
                    'crit' => 12,
                    'crit_dmg' => 40,
                    'attack' => 60,
                    'defense' => 15,
                ]
            ],
            [
                'id' => 6,
                'item_id' => 6,
                'quantity' => 7,
                'property' => [
                    'crit' => 18,
                    'crit_dmg' => 55,
                    'attack' => 70,
                    'defense' => 12,
                ]
            ],
            [
                'id' => 7,
                'item_id' => 3,
                'quantity' => 1,
                'property' => [
                    'crit' => 25,
                    'crit_dmg' => 70,
                    'attack' => 90,
                    'defense' => 5,
                ]
            ]
        ];

        // Sword items (weapons)
        $swordItems = [
            [
                'id' => 101,
                'item_id' => 1,
                'quantity' => 2,
                'property' => [
                    'crit' => 30,
                    'crit_dmg' => 80,
                    'attack' => 150,
                    'defense' => 10,
                ]
            ],
            [
                'id' => 102,
                'item_id' => 1,
                'quantity' => 1,
                'property' => [
                    'crit' => 25,
                    'crit_dmg' => 70,
                    'attack' => 120,
                    'defense' => 15,
                ]
            ],
            [
                'id' => 103,
                'item_id' => 1,
                'quantity' => 3,
                'property' => [
                    'crit' => 20,
                    'crit_dmg' => 60,
                    'attack' => 100,
                    'defense' => 20,
                ]
            ],
        ];

        // Other items (accessories, rings, bracelets, etc.)
        $otherItems = [
            [
                'id' => 201,
                'item_id' => 4,
                'quantity' => 2,
                'property' => [
                    'crit' => 15,
                    'crit_dmg' => 40,
                    'attack' => 60,
                    'defense' => 30,
                ]
            ],
            [
                'id' => 202,
                'item_id' => 5,
                'quantity' => 1,
                'property' => [
                    'crit' => 18,
                    'crit_dmg' => 50,
                    'attack' => 70,
                    'defense' => 25,
                ]
            ],
            [
                'id' => 203,
                'item_id' => 6,
                'quantity' => 4,
                'property' => [
                    'crit' => 12,
                    'crit_dmg' => 35,
                    'attack' => 50,
                    'defense' => 35,
                ]
            ],
            [
                'id' => 204,
                'item_id' => 7,
                'quantity' => 1,
                'property' => [
                    'crit' => 22,
                    'crit_dmg' => 65,
                    'attack' => 85,
                    'defense' => 15,
                ]
            ],
        ];

        // Shop items (items available for purchase)
        $shopItems = [
            [
                'id' => 301,
                'item_id' => 1,
                'quantity' => 0,
                'property' => [
                    'crit' => 35,
                    'crit_dmg' => 90,
                    'attack' => 180,
                    'defense' => 5,
                ]
            ],
            [
                'id' => 302,
                'item_id' => 2,
                'quantity' => 0,
                'property' => [
                    'crit' => 15,
                    'crit_dmg' => 40,
                    'attack' => 60,
                    'defense' => 100,
                ]
            ],
            [
                'id' => 303,
                'item_id' => 3,
                'quantity' => 0,
                'property' => [
                    'crit' => 10,
                    'crit_dmg' => 30,
                    'attack' => 40,
                    'defense' => 150,
                ]
            ],
            [
                'id' => 304,
                'item_id' => 4,
                'quantity' => 0,
                'property' => [
                    'crit' => 25,
                    'crit_dmg' => 70,
                    'attack' => 90,
                    'defense' => 40,
                ]
            ],
            [
                'id' => 305,
                'item_id' => 5,
                'quantity' => 0,
                'property' => [
                    'crit' => 20,
                    'crit_dmg' => 60,
                    'attack' => 80,
                    'defense' => 35,
                ]
            ],
        ];

        // Demo user data - replace with actual user data retrieval
        return $this->apiResponseWithContext([
            'coin' => 1000000,
            'box_coin' => 100,
            'ruby' => 1000,
            'power' => 125000,
            'user_bag' => [
                'bag' => $bagItems,
                'sword' => $swordItems,
                'other' => $otherItems,
                'shop' => $shopItems,
            ],
            'item_detail' => $itemDetails,
        ]);
    }
}


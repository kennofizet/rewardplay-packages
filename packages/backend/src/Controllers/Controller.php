<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Traits\GlobalDataTrait;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

abstract class Controller
{
    use GlobalDataTrait, BaseModelActions;
}

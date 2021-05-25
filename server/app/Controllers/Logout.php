<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class Logout extends BaseController {
    use ResponseTrait;

    function post() {
        $session = session();

        if (!$session) {
            return $this->failUnauthorized();
        }

        $session->destroy();
    }
}

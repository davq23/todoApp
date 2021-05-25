<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\Config\Services;

/**
 * Simple cookie-based authentication
 */
class SessionAuthFilter implements FilterInterface
{
    /**
     * Filter to allow or disallow access to route
     * 
     * @param RequestInterface $request - Incomming request
     * @param array|null $arguments     - Valid arguments:
     *                                    -> noauth (restict access IF authorized)
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Obtain user ID from session
        $user_id = session('u_id');

        // Check to allow or disallow access
        $conditions = $arguments && in_array('noauth', $arguments) ? is_null($user_id) : !is_null($user_id);

        // If conditions are met
        if (!$conditions)
        {
            // Send Unauthorized
            $response = Services::response();
            $response->setStatusCode(401, 'Unauthorized');
         
            return $response;
        } 
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do something here
    }
}
<?php

namespace App\Providers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //Here we define custom guards for all roles
        Auth::viaRequest('scrum-master', function ($request) {
            return $this->authenticateUser($request, Role::SCRUM_MASTER);
        });

        Auth::viaRequest('product-owner', function ($request) {
            return $this->authenticateUser($request, Role::PRODUCT_OWNER);
        });

        Auth::viaRequest('developer', function ($request) {
            return $this->authenticateUser($request, Role::DEVELOPER);
        });
    }

    //Logic that guards use for checking if user has the right role
    private function authenticateUser($request, string $roleName): ?User
    {
        //Log::info("Authenticating user for {$roleName} guard");
        $user = $request->user();

        if ($user) {
            //Log::info('Authenticated user: ' . $user->id);
            if ($user->role->name === $roleName) {
                return $user;
            }
        }

        //Log::info('Authentication failed');
        return null;
    }
}

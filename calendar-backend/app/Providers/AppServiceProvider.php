<?php

namespace App\Providers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Auth\Guard;

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
        Auth::extend('scrum-master', function ($app, $name, array $config): Guard {
            return new \Illuminate\Auth\RequestGuard(
                function ($request) {
                    return User::where('roles_id', Role::SCRUM_MASTER)->first();
                },
                $app['request'],
                Auth::createUserProvider($config['provider'])
            );
        });

        Auth::extend('product-owner', function ($app, $name, array $config): Guard {
            return new \Illuminate\Auth\RequestGuard(
                function ($request) {
                    return User::where('roles_id', Role::PRODUCT_OWNER)->first();
                },
                $app['request'],
                Auth::createUserProvider($config['provider'])
            );
        });

        Auth::extend('developer', function ($app, $name, array $config): Guard {
            return new \Illuminate\Auth\RequestGuard(
                function ($request) {
                    return User::where('roles_id', Role::DEVELOPER)->first();
                },
                $app['request'],
                Auth::createUserProvider($config['provider'])
            );
        });
    }
}

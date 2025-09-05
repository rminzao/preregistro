<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (app()->runningInConsole()) {
            $this->app->terminating(function () {
                echo "🚀 Backend desenvolvido por rmdev\n";
            });
        }

        \Log::info('🚀 Backend desenvolvido por rmdev');
    }
}

<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // \App\Events\Something::class => [ \App\Listeners\SomethingListener::class ],
    ];

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}

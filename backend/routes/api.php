<?php

use App\Http\Controllers\PreregController;
use App\Http\Controllers\PhoneVerifyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/preregister', [PreregController::class, 'store'])
    ->withoutMiddleware('throttle:api')
    ->middleware('throttle:120,1'); // 120 req/min

//
// Verificação por e-mail
Route::get('/verify/{token}', [PreregController::class, 'verify'])
    ->withoutMiddleware('throttle:api');
// ->middleware('throttle:600,1'); // (opcional)

//
// Ranking
//
Route::get('/ranking', [PreregController::class, 'ranking'])
    ->withoutMiddleware('throttle:api')
    ->middleware('throttle:600,1');
//
// WhatsApp OTP
//
Route::post('/phone/send-otp', [PhoneVerifyController::class, 'sendOtp'])
    ->middleware('throttle:20,1');

Route::post('/phone/verify-otp', [PhoneVerifyController::class, 'verifyOtp'])
    ->middleware('throttle:60,1');

//
// Rota de teste
//
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando!',
        'timestamp' => now()->toDateTimeString(),
        'whatsapp_configured' => !empty(env('WHATSAPP_TOKEN')),
    ]);
})->middleware('throttle:300,1');

Route::get('/player/by-invite/{code}', [PreregController::class, 'getByInvite'])
    ->withoutMiddleware('throttle:api')
    ->middleware('throttle:300,1');
	
#login
	
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login'])
    ->withoutMiddleware('throttle:api')
    ->middleware('throttle:60,1'); // 60/min


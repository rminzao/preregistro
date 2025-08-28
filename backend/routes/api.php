<?php
// backend/routes/api.php

use App\Http\Controllers\PreregController;
use App\Http\Controllers\PhoneVerifyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rotas principais do pré-registro
Route::post('/preregister', [PreregController::class, 'store'])
    ->middleware('throttle:20,1'); // máx 20 tentativas por minuto

Route::get('/verify/{token}', [PreregController::class, 'verify'])
    ->middleware('throttle:60,1'); // máx 60 tentativas por minuto

Route::get('/ranking', [PreregController::class, 'ranking'])
    ->middleware('throttle:60,1'); // máx 60 tentativas por minuto

// Rotas opcionais do WhatsApp OTP
Route::post('/phone/send-otp', [PhoneVerifyController::class, 'sendOtp'])
    ->middleware('throttle:10,1'); // máx 10 tentativas por minuto

Route::post('/phone/verify-otp', [PhoneVerifyController::class, 'verifyOtp'])
    ->middleware('throttle:20,1'); // máx 20 tentativas por minuto

// Rota de teste (remover em produção)
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando!',
        'timestamp' => now()->toDateTimeString(),
        'whatsapp_configured' => !empty(env('WHATSAPP_TOKEN'))
    ]);
})->middleware('throttle:60,1');
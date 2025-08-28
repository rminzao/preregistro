<?php
// backend/app/Http/Controllers/PhoneVerifyController.php

namespace App\Http\Controllers;

use App\Models\PreRegistro;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PhoneVerifyController extends Controller
{
    public function sendOtp(Request $req, WhatsAppService $wa)
    {
        $data = $req->validate([
            'email' => 'required|email',
            'phone' => ['required','regex:/^\+?\d{11,15}$/'] // envie E.164 (+5511999999999)
        ]);

        $user = PreRegistro::where('email', $data['email'])->firstOrFail();

        // gera e salva OTP
        $otp = (string) random_int(100000, 999999);
        $ttl = (int) env('OTP_TTL_MINUTES', 10);

        // normaliza telefone
        $digits = preg_replace('/\D/', '', $data['phone']);
        $user->phone_number = $digits;
        $user->phone_otp = $otp;
        $user->phone_otp_expires_at = Carbon::now()->addMinutes($ttl);
        $user->save();

        // Formato E.164
        $to = str_starts_with($data['phone'], '+') ? $data['phone'] : ('+'.$digits);

        try {
            $wa->sendOtpTemplate(
                $to,
                env('WHATSAPP_TEMPLATE_AUTH', 'otp_login'),
                env('WHATSAPP_LANG', 'pt_BR'),
                $otp
            );

            return response()->json(['message' => 'Código enviado por WhatsApp.']);
        } catch (\Exception $e) {
            \Log::error('Erro WhatsApp OTP: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao enviar código. Tente novamente.'
            ], 500);
        }
    }

    public function verifyOtp(Request $req)
    {
        $data = $req->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6'
        ]);

        $user = PreRegistro::where('email', $data['email'])->firstOrFail();

        if (!$user->phone_otp || !$user->phone_otp_expires_at) {
            return response()->json(['message' => 'Solicite um novo código.'], 422);
        }

        if (Carbon::now()->greaterThan($user->phone_otp_expires_at)) {
            return response()->json(['message' => 'Código expirado.'], 422);
        }

        if (!hash_equals($user->phone_otp, $data['otp'])) {
            return response()->json(['message' => 'Código inválido.'], 422);
        }

        $user->phone_verified_at = Carbon::now();
        $user->phone_otp = null;
        $user->phone_otp_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Celular verificado com sucesso!']);
    }
}
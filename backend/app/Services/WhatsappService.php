<?php
// backend/app/Services/WhatsAppService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppService 
{
    public function sendOtpTemplate(string $toE164, string $template, string $lang, string $code): array 
    {
        // Verificar se as variáveis estão configuradas
        if (!env('WHATSAPP_TOKEN') || !env('WHATSAPP_PHONE_ID')) {
            throw new \RuntimeException('WhatsApp não configurado. Configure WHATSAPP_TOKEN e WHATSAPP_PHONE_ID no .env');
        }

        $url = "https://graph.facebook.com/v19.0/".env('WHATSAPP_PHONE_ID')."/messages";
        
        $payload = [
            "messaging_product" => "whatsapp",
            "to" => $toE164,
            "type" => "template",
            "template" => [
                "name" => $template,
                "language" => ["code" => $lang],
                "components" => [[
                    "type" => "body",
                    "parameters" => [[ 
                        "type" => "text", 
                        "text" => $code 
                    ]]
                ]]
            ]
        ];

        $response = Http::withToken(env('WHATSAPP_TOKEN'))->post($url, $payload);
        
        if (!$response->successful()) {
            throw new \RuntimeException('WhatsApp API Error: ' . $response->body());
        }
        
        return $response->json();
    }
}
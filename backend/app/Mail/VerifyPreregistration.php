<?php
// backend/app/Mail/VerifyPreregistration.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyPreregistration extends Mailable
{
    use Queueable, SerializesModels;

    public string $verifyUrl;
    public string $nickname;

    public function __construct(string $verifyUrl, string $nickname)
    {
        $this->verifyUrl = $verifyUrl;
        $this->nickname = $nickname;
    }

    public function build()
    {
        return $this->subject('Confirme seu e-mail - Pré-Registro')
            ->view('emails.verify-prereg')
            ->with([
                'verifyUrl' => $this->verifyUrl, 
                'nickname' => $this->nickname
            ]);
    }
}
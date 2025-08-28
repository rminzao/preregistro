<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreRegistro extends Model
{
    protected $table = 'PreRegistro';

    protected $fillable = [
        'name', 'email', 'phone_number', 'u_hash', 'password',
        'invite_code', 'referrer_code', 'referrer_name', 'points',
        'email_verified_at', 'phone_otp', 'phone_otp_expires_at', 'phone_verified_at'
    ];

    protected $hidden = ['password', 'u_hash', 'phone_otp'];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'phone_otp_expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
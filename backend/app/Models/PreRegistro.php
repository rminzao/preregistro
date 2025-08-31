<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreRegistro extends Model
{
    protected $table = 'PreRegistro';
    
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'email', 
        'phone_number',
        'password',
        'u_hash',
        'invite_code',
        'referrer_code',
        'referrer_name',
        'points',
        'email_verified_at'
    ];

    protected $hidden = [
        'password', 
        'u_hash'
    ];

    protected $casts = [
        'points' => 'integer',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // invite_code sempre UPPER
    public function setInviteCodeAttribute($value)
    {
        $this->attributes['invite_code'] = $value ? strtoupper(trim($value)) : null;
    }

    // referrer_code sempre UPPER  
    public function setReferrerCodeAttribute($value)
    {
        $this->attributes['referrer_code'] = $value ? strtoupper(trim($value)) : null;
    }

    // phone_number sempre só dígitos
    public function setPhoneNumberAttribute($value)
    {
        $this->attributes['phone_number'] = $value ? preg_replace('/\D/', '', $value) : null;
    }

    // Helper para buscar por código de convite
    public function scopeByInvite($q, string $code)
    {
        return $q->where('invite_code', strtoupper(trim($code)));
    }
}
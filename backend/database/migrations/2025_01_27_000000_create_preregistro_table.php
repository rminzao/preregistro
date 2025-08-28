<?php
// backend/database/migrations/2025_01_27_create_preregistro_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('PreRegistro', function (Blueprint $t) {
            $t->bigIncrements('id');
            $t->string('name', 64);                // nickname
            $t->string('email', 191)->unique();
            $t->string('phone_number', 32)->nullable(); // guardar só dígitos ou E.164
            $t->string('u_hash', 64)->unique();    // token de verificação de e-mail
            $t->string('password');                // hash
            $t->string('invite_code', 32)->unique(); // código do próprio usuário para indicar outros
            $t->string('referrer_code', 32)->nullable()->index();
            $t->string('referrer_name', 64)->nullable();
            $t->integer('points')->default(0);
            $t->dateTime('email_verified_at')->nullable();
            $t->dateTime('created_at')->nullable();
            $t->dateTime('updated_at')->nullable();

            // Campos opcionais para verificação de celular
            $t->string('phone_otp', 10)->nullable();
            $t->dateTime('phone_otp_expires_at')->nullable();
            $t->dateTime('phone_verified_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('PreRegistro');
    }
};
<?php

namespace App\Http\Controllers;

use App\Models\PreRegistro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $req)
    {
        $data = $req->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6|max:64',
        ]);

        $user = PreRegistro::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciais inválidas'
            ], 401);
        }

       if (is_null($user->email_verified_at)) {
             return response()->json([
                'success' => false,
                 'message' => 'Confirme seu e-mail para acessar.'
            ], 403);
         }

        return response()->json([
            'success' => true,
            'data' => [
                'id'             => (string)$user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone_number'   => $user->phone_number,
                'invite_code'    => $user->invite_code,
                'referrer_code'  => $user->referrer_code,
                'points'         => (int)$user->points,
                'email_verified' => !is_null($user->email_verified_at),
                'created_at'     => $user->created_at?->toISOString(),
            ]
        ]);
    }
}

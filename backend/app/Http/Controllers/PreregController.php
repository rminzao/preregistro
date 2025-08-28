<?php

namespace App\Http\Controllers;

use App\Mail\VerifyPreregistration;
use App\Models\PreRegistro;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PreregController extends Controller
{
    public function store(Request $req)
    {
        Log::info('=== INÍCIO DO PREREG STORE ===');
        Log::info('Dados recebidos', ['data' => $req->all()]);
        
        try {
            $data = $req->validate([
                'nickname' => 'required|string|min:3|max:32',
                'email' => 'required|email|unique:PreRegistro,email',
                'celular' => 'required|string',
                'senha' => 'required|string|min:6|max:64',
                'referrer_code' => 'nullable|string|max:32'
            ]);
            
            Log::info('Validação passou', ['validated_data' => $data]);
            
            $cleanPhone = preg_replace('/\D/', '', $data['celular']);
            $uHash = Str::uuid()->toString();
            $inviteCode = strtoupper(Str::random(8));
            
            Log::info('Dados processados', [
                'clean_phone' => $cleanPhone,
                'u_hash' => $uHash,
                'invite_code' => $inviteCode
            ]);
            
            $referrerName = null;
            if (!empty($data['referrer_code'])) {
                $referrer = PreRegistro::where('invite_code', $data['referrer_code'])->first();
                $referrerName = $referrer ? $referrer->name : null;
                Log::info('Referrer processado', ['referrer_name' => $referrerName]);
            }
            
            Log::info('Tentando criar registro...');
            
            $row = PreRegistro::create([
                'name' => $data['nickname'],
                'email' => $data['email'],
                'phone_number' => $cleanPhone,
                'password' => Hash::make($data['senha']),
                'u_hash' => $uHash,
                'invite_code' => $inviteCode,
                'referrer_code' => $data['referrer_code'] ?? null,
                'referrer_name' => $referrerName,
                'points' => 0,
            ]);
            
            Log::info('Registro criado com sucesso', ['id' => $row->id]);
            
            return response()->json([
                'message' => 'Pré-registro salvo. Verifique seu e-mail para confirmar.',
                'invite_code' => $inviteCode
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('ERRO DE VALIDAÇÃO', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('ERRO GERAL', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function verify(string $token)
    {
        $row = PreRegistro::where('u_hash', $token)->first();

        if (!$row) {
            return response()->json(['message' => 'Token inválido'], 404);
        }

        if ($row->email_verified_at) {
            return response()->json(['message' => 'E-mail já verificado.']);
        }

        DB::transaction(function () use ($row) {
            $row->email_verified_at = Carbon::now();
            $row->points = ($row->points ?? 0) + 50;
            $row->save();

            if ($row->referrer_code) {
                $ref = PreRegistro::where('invite_code', $row->referrer_code)->first();
                if ($ref) {
                    $ref->points = ($ref->points ?? 0) + 50;
                    $ref->save();
                }
            }
        });

        return response()->json(['message' => 'E-mail verificado com sucesso!']);
    }

    public function ranking()
    {
        $list = PreRegistro::select('name', 'invite_code', 'points')
            ->whereNotNull('email_verified_at')
            ->orderByDesc('points')
            ->limit(100)
            ->get();

        return response()->json($list);
    }
}
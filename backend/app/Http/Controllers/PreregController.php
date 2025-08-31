<?php

namespace App\Http\Controllers;

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
    public function index(Request $request) 
	{
		$referrerCode = $request->get('ref');
		
		if ($referrerCode) {
			return redirect('/?ref=' . $referrerCode);
		}
		
		return redirect('/');
	}

    public function store(Request $req)
	{
		Log::info('=== INÍCIO DO PREREG STORE ===');
		Log::info('Dados recebidos', ['data' => $req->all()]);

		try {
			$data = $req->validate([
				'name'          => 'required|string|min:3|max:32',
				'email'         => 'required|email|unique:PreRegistro,email',
				'phone_number'  => 'required|string',
				'password'      => 'required|string|min:6|max:64',
				'referrer_code' => 'nullable|string|max:32',
			]);

			Log::info('Validação passou', ['validated_data' => $data]);

			$cleanPhone  = preg_replace('/\D/', '', $data['phone_number']);
			$uHash       = Str::uuid()->toString();
			$inviteCode  = strtoupper(Str::random(8));
			$refCode     = null;
			$referrerName = null;

			// TRATAMENTO ROBUSTO DO REFERENCIADOR
			if (!empty($data['referrer_code'])) {
			try {
				$refCode = strtoupper(trim($data['referrer_code']));
				Log::info('Buscando referenciador', ['referrer_code' => $refCode]);
				
				$referrer = PreRegistro::where('invite_code', $refCode)->first();
				
				if ($referrer) {
					$referrerName = $referrer->name;
					Log::info('Referenciador encontrado', ['name' => $referrerName]);
				} else {
					Log::warning('Referenciador não encontrado', ['code' => $refCode]);
				}
				
			} catch (\Exception $e) {
				Log::error('ERRO AO BUSCAR REFERENCIADOR', [
					'referrer_code' => $refCode,
					'error' => $e->getMessage(),
					'line' => $e->getLine()
				]);
				
				// Continue o cadastro mesmo se falhar na busca do referenciador
				$refCode = null;
				$referrerName = null;
			}
		}

			Log::info('Dados processados', [
				'clean_phone' => $cleanPhone,
				'u_hash'      => $uHash,
				'invite_code' => $inviteCode,
				'referrer_code' => $refCode,
				'referrer_name' => $referrerName,
			]);

			Log::info('Tentando criar registro...');

			$row = PreRegistro::create([
				'name'          => $data['name'],
				'email'         => $data['email'],
				'phone_number'  => $cleanPhone,
				'password'      => Hash::make($data['password']),
				'u_hash'        => $uHash,
				'invite_code'   => $inviteCode,
				'referrer_code' => $refCode,
				'referrer_name' => $referrerName,
				'points'        => 0,
			]);

			Log::info('Registro criado com sucesso', ['id' => $row->id]);

			// Enviar e-mail de verificação (não falha o fluxo se der erro)
			try {
				$verificationUrl = rtrim(config('app.url'), '/') . "/api/verify/{$row->u_hash}";
				Log::info('Tentando enviar email de verificação', [
					'email' => $row->email,
					'verification_url' => $verificationUrl,
				]);

				Mail::send('emails.verify', [
					'player'          => $row,
					'verificationUrl' => $verificationUrl,
				], function ($message) use ($row) {
					$message->to($row->email, $row->name)
						->subject('Confirme sua conta - EvoTank Pré-Registro');
				});

				Log::info('Email de verificação enviado com sucesso', ['email' => $row->email]);
			} catch (\Exception $e) {
				Log::error('Erro ao enviar email de verificação', [
					'email' => $row->email,
					'error' => $e->getMessage(),
				]);
			}

			return response()->json([
				'success' => true,
				'message' => 'Pré-registro salvo! Verifique seu e-mail para confirmar.',
				'data' => [
					'id'             => (string) $row->id,
					'name'           => $row->name,
					'email'          => $row->email,
					'phone_number'   => $row->phone_number,
					'invite_code'    => $row->invite_code,
					'referrer_code'  => $row->referrer_code,
					'points'         => (int) $row->points,
					'email_verified' => !is_null($row->email_verified_at),
					'created_at'     => $row->created_at?->toISOString(),
				],
			], 201);
		} catch (\Illuminate\Validation\ValidationException $e) {
			Log::error('ERRO DE VALIDAÇÃO', ['errors' => $e->errors()]);
			return response()->json([
				'message' => 'Dados inválidos',
				'errors'  => $e->errors(),
			], 422);
		} catch (\Exception $e) {
			Log::error('ERRO GERAL STORE', [
				'message' => $e->getMessage(),
				'file'    => $e->getFile(),
				'line'    => $e->getLine(),
			]);

			return response()->json([
				'error'   => 'Erro interno do servidor',
				'message' => $e->getMessage(),
			], 500);
		}
	}

    public function verify(string $token)
	{
		$row = PreRegistro::where('u_hash', $token)->first();

		if (!$row) {
			$front = rtrim(env('FRONTEND_URL', config('app.url')), '/');
			return redirect()->away($front . '/?verified=0&reason=invalid_token');
		}

		// Se já estiver verificado, mantém o mesmo comportamento
		if ($row->email_verified_at) {
			$front = rtrim(env('FRONTEND_URL', config('app.url')), '/');
			return redirect()->away($front . '/?verified=1&already=1&email=' . urlencode($row->email));
		}

		// BÔNUS EM CAMADAS
		$playerBonus = 10;  // confirmação do próprio e-mail
		$refBonus    = 40;  // bônus para o padrinho (convidador direto)
		$grandBonus  = 10;  // bônus para o “avô” (convidador do padrinho)

		DB::transaction(function () use ($row, $playerBonus, $refBonus, $grandBonus) {
			$row->email_verified_at = Carbon::now();
			$row->points = ($row->points ?? 0) + $playerBonus;

			if ($row->referrer_code) {
				$ref = PreRegistro::where('invite_code', $row->referrer_code)
					->lockForUpdate()
					->first();

				if ($ref) {
					$ref->points = ($ref->points ?? 0) + $refBonus;

					//referrer_code do padrinho
					if (!empty($ref->referrer_code)) {
						$grand = PreRegistro::where('invite_code', $ref->referrer_code)
							->lockForUpdate()
							->first();

						if ($grand && $grand->id !== $row->id) {
							$grand->points = ($grand->points ?? 0) + $grandBonus;
							$grand->save();
						}
					}

					$ref->save();
				}
			}

			$row->save();
		});

		$front = rtrim(env('FRONTEND_URL', config('app.url')), '/');
		$qs = http_build_query([
			'verified' => 1,
			'email'    => $row->email,
			'invite'   => $row->invite_code,
		]);
		return redirect()->away($front . '/?' . $qs);
	}

    public function ranking()
    {
        try {
            $totalPlayers   = PreRegistro::count();
            $verifiedPlayers = PreRegistro::whereNotNull('email_verified_at')->count();
            $totalInvites   = PreRegistro::whereNotNull('referrer_code')
                                ->whereNotNull('email_verified_at')
                                ->count();

            $conversionRate = $totalPlayers > 0 ? ($verifiedPlayers / $totalPlayers) * 100 : 0;

            // Ranking (somente quem confirmou e tem > 0 pontos)
            $topPlayers = PreRegistro::select('name', 'points', 'email_verified_at')
                ->whereNotNull('email_verified_at')
                ->where('points', '>', 0)
                ->orderByDesc('points')
                ->orderBy('created_at', 'ASC')
                ->limit(50)
                ->get()
                ->map(function ($player, $index) {
                    return [
                        'position'       => $index + 1,
                        'name'           => $player->name,
                        'points'         => (int) $player->points,
                        'email_verified' => !is_null($player->email_verified_at),
                    ];
                });

            return response()->json([
                'success'         => true,
                'total_players'   => $totalPlayers,
                'total_invites'   => $totalInvites,
                'conversion_rate' => round($conversionRate, 1),
                'top_players'     => $topPlayers,
            ]);
        } catch (\Throwable $e) {
            Log::error('ERRO NO RANKING', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Falha ao carregar ranking',
            ], 500);
        }
    }

    public function getByInvite(string $code)
    {
        $code = strtoupper(trim($code));
        $row = PreRegistro::where('invite_code', $code)->first();

        if (!$row) {
            return response()->json([
                'success' => false,
                'message' => 'Player não encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id'             => (string) $row->id,
                'name'           => $row->name,
                'email'          => $row->email,
                'phone_number'   => $row->phone_number,
                'invite_code'    => $row->invite_code,
                'referrer_code'  => $row->referrer_code,
                'points'         => (int) $row->points,
                'email_verified' => !is_null($row->email_verified_at),
                'created_at'     => $row->created_at?->toISOString(),
            ],
        ]);
    }
}
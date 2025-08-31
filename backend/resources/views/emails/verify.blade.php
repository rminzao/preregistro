<!DOCTYPE html>
<html>
<head>
    <title>Confirme sua conta - EvoTank</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .info-box { background: white; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 EvoTank Pré-Registro</h1>
            <p>Bem-vindo(a) ao futuro dos games!</p>
        </div>
        
        <div class="content">
            <h2>Olá, {{ $player->name }}! 👋</h2>
            
            <p>Obrigado por se registrar no <strong>EvoTank Pré-Registro</strong>!</p>
            
            <p>Para ativar sua conta e começar a acumular pontos, clique no botão abaixo:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $verificationUrl }}" class="button">
                    ✅ Confirmar Minha Conta
                </a>
            </div>
            
            <div class="info-box">
                <h3>📊 Seus Dados</h3>
                <ul>
                    <li><strong>Nickname:</strong> {{ $player->name }}</li>
                    <li><strong>Email:</strong> {{ $player->email }}</li>
                    <li><strong>Código de convite:</strong> <code>{{ $player->invite_code }}</code></li>
                    @if($player->referrer_name)
                    <li><strong>Convidado por:</strong> {{ $player->referrer_name }}</li>
                    @endif
                </ul>
            </div>
            
            <h3>🎁 Ganhe Pontos:</h3>
            <ul>
                <li><strong>+50 pontos</strong> ao verificar seu email</li>
                <li><strong>+50 pontos</strong> para cada amigo que convidar</li>
            </ul>
            
            <p><strong>💡 Compartilhe seu código de convite:</strong> <code>{{ $player->invite_code }}</code></p>
            
            <hr style="margin: 30px 0; border: 1px solid #eee;">
            
            <p><strong>⚠️ Link direto (caso o botão não funcione):</strong></p>
            <p><a href="{{ $verificationUrl }}">{{ $verificationUrl }}</a></p>
        </div>
        
        <div class="footer">
            <p>Se você não se registrou em nosso site, ignore este email.</p>
            <p>© 2025 EvoTank - Todos os direitos reservados</p>
        </div>
    </div>
</body>
</html>
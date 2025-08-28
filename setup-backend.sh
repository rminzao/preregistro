#!/bin/bash

echo "🎮 Criando Estrutura do Backend - Sistema de Pré-Registro"
echo "========================================================="

# Verificar se está na raiz do projeto
if [ ! -d "src" ]; then
    echo "❌ Execute este script na raiz do projeto (onde está a pasta src/)"
    exit 1
fi

# Criar estrutura Laravel na pasta backend
echo "📁 Criando estrutura de pastas..."

# Pastas principais do Laravel
mkdir -p backend/app/Http/Controllers
mkdir -p backend/app/Models  
mkdir -p backend/app/Mail
mkdir -p backend/app/Services
mkdir -p backend/database/migrations
mkdir -p backend/resources/views/emails
mkdir -p backend/routes
mkdir -p backend/config
mkdir -p backend/storage/logs

# Criar arquivos vazios com comentários identificadores
echo "📄 Criando arquivos..."

# ==============================================
# CONTROLLERS
# ==============================================
cat > backend/app/Http/Controllers/PreregController.php << 'EOF'
<?php
// backend/app/Http/Controllers/PreregController.php
// CONTROLLER PRINCIPAL: Registro, Verificação e Ranking

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PreregController extends Controller
{
    // TODO: Implementar store(), verify(), ranking()
}
EOF

cat > backend/app/Http/Controllers/PhoneVerifyController.php << 'EOF'
<?php
// backend/app/Http/Controllers/PhoneVerifyController.php  
// CONTROLLER WHATSAPP: Enviar e Verificar OTP

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PhoneVerifyController extends Controller
{
    // TODO: Implementar sendOtp(), verifyOtp()
}
EOF

# ==============================================
# MODELS
# ==============================================
cat > backend/app/Models/PreRegistro.php << 'EOF'
<?php
// backend/app/Models/PreRegistro.php
// MODEL PRINCIPAL: Tabela PreRegistro

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreRegistro extends Model
{
    // TODO: Implementar fillables, casts, etc.
}
EOF

# ==============================================
# SERVICES
# ==============================================
cat > backend/app/Services/WhatsAppService.php << 'EOF'
<?php
// backend/app/Services/WhatsAppService.php
// SERVICE WHATSAPP: Integração com Meta API

namespace App\Services;

class WhatsAppService 
{
    // TODO: Implementar sendOtpTemplate()
}
EOF

# ==============================================
# MAIL
# ==============================================
cat > backend/app/Mail/VerifyPreregistration.php << 'EOF'
<?php
// backend/app/Mail/VerifyPreregistration.php
// MAILABLE: E-mail de verificação

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyPreregistration extends Mailable
{
    use Queueable, SerializesModels;
    
    // TODO: Implementar construtor e build()
}
EOF

# ==============================================
# MIGRATIONS
# ==============================================
cat > backend/database/migrations/2025_01_27_000000_create_preregistro_table.php << 'EOF'
<?php
// backend/database/migrations/2025_01_27_000000_create_preregistro_table.php
// MIGRATION: Criar tabela PreRegistro

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // TODO: Implementar Schema::create()
    }

    public function down(): void
    {
        Schema::dropIfExists('PreRegistro');
    }
};
EOF

# ==============================================
# VIEWS
# ==============================================
cat > backend/resources/views/emails/verify-prereg.blade.php << 'EOF'
<!-- backend/resources/views/emails/verify-prereg.blade.php -->
<!-- VIEW: Template do e-mail de verificação -->

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Confirme seu e-mail</title>
</head>
<body>
    <!-- TODO: Implementar template bonito -->
    <h1>Olá {{ $nickname }}!</h1>
    <p>Clique no link para verificar: {{ $verifyUrl }}</p>
</body>
</html>
EOF

# ==============================================
# ROUTES
# ==============================================
cat > backend/routes/api.php << 'EOF'
<?php
// backend/routes/api.php
// ROUTES: Todas as rotas da API

use Illuminate\Support\Facades\Route;

// TODO: Implementar rotas com throttling
/*
Route::post('/preregister', ...);
Route::get('/verify/{token}', ...);  
Route::get('/ranking', ...);
Route::post('/phone/send-otp', ...);
Route::post('/phone/verify-otp', ...);
*/
EOF

# ==============================================
# CONFIG
# ==============================================
cat > backend/config/cors.php << 'EOF'
<?php
// backend/config/cors.php
// CONFIG: CORS para permitir frontend

return [
    // TODO: Implementar configuração CORS
];
EOF

# ==============================================
# ENVIRONMENT
# ==============================================
cat > backend/.env.example << 'EOF'
# backend/.env.example
# ENVIRONMENT: Configurações do ambiente

APP_NAME="Pré-Registro Gaming"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database (SQL Server)
DB_CONNECTION=sqlsrv
DB_HOST=127.0.0.1
DB_PORT=1433
DB_DATABASE=preregistro_db
DB_USERNAME=sa
DB_PASSWORD=

# TODO: Adicionar mais configurações (MAIL, WHATSAPP, etc.)
EOF

# ==============================================
# DOCUMENTATION
# ==============================================
cat > backend/README.md << 'EOF'
# 🎮 Backend - Sistema de Pré-Registro

Sistema completo de pré-registro com pontuação, convites e verificação.

## 📁 Estrutura Criada

- ✅ Controllers (PreregController, PhoneVerifyController)
- ✅ Models (PreRegistro)  
- ✅ Services (WhatsAppService)
- ✅ Mailable (VerifyPreregistration)
- ✅ Migration (create_preregistro_table)
- ✅ Views (verify-prereg.blade.php)
- ✅ Routes (api.php)
- ✅ Config (cors.php)
- ✅ Environment (.env.example)

## 🚀 Próximos Passos

1. Cole os códigos nos arquivos criados
2. Execute: `composer install`
3. Execute: `php artisan key:generate`
4. Configure banco e e-mail no .env
5. Execute: `php artisan migrate`
6. Execute: `php artisan serve`

## 📱 WhatsApp (Opcional)
Configure depois no .env:
- WHATSAPP_TOKEN
- WHATSAPP_PHONE_ID
EOF

# ==============================================
# SCRIPTS DE INSTALAÇÃO
# ==============================================
cat > backend/install.sh << 'EOF'
#!/bin/bash
# backend/install.sh
# SCRIPT: Instalação automática

echo "🎮 Instalando Backend..."

# TODO: Implementar instalação completa
echo "Execute os comandos manualmente por enquanto:"
echo "1. composer install"
echo "2. cp .env.example .env" 
echo "3. php artisan key:generate"
echo "4. php artisan migrate"
echo "5. php artisan serve"
EOF

chmod +x backend/install.sh

# ==============================================
# ARQUIVO DE INTEGRAÇÃO FRONTEND
# ==============================================
cat > backend/frontend-integration.ts << 'EOF'
// backend/frontend-integration.ts  
// INTEGRATION: Exemplo de uso no frontend

// TODO: Implementar classe PreRegistroAPI com:
// - register()
// - getRanking() 
// - sendWhatsAppOtp()
// - verifyWhatsAppOtp()
EOF

echo ""
echo "✅ ESTRUTURA CRIADA COM SUCESSO!"
echo ""
echo "📁 Arquivos criados em backend/:"
echo "   📂 app/Http/Controllers/"
echo "      📄 PreregController.php"
echo "      📄 PhoneVerifyController.php"
echo "   📂 app/Models/"
echo "      📄 PreRegistro.php"
echo "   📂 app/Services/"
echo "      📄 WhatsAppService.php"
echo "   📂 app/Mail/"
echo "      📄 VerifyPreregistration.php"
echo "   📂 database/migrations/"
echo "      📄 2025_01_27_000000_create_preregistro_table.php"
echo "   📂 resources/views/emails/"
echo "      📄 verify-prereg.blade.php"
echo "   📂 routes/"
echo "      📄 api.php"
echo "   📂 config/"
echo "      📄 cors.php"
echo "   📄 .env.example"
echo "   📄 README.md"
echo "   📄 install.sh"
echo ""
echo "🎯 PRÓXIMO PASSO:"
echo "   Cole os códigos nos arquivos criados usando os artefatos do Claude!"
echo ""
echo "🚀 ORDEM RECOMENDADA:"
echo "   1. Migration (tabela)"
echo "   2. Model" 
echo "   3. Controllers"
echo "   4. Service (WhatsApp)"
echo "   5. Mailable + View"
echo "   6. Routes"
echo "   7. Config (CORS)"
echo "   8. Environment"
echo ""
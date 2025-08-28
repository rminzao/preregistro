# 🎮 Backend - Sistema de Pré-Registro

Sistema completo de pré-registro com pontuação, convites e verificação por e-mail/WhatsApp.

## 📁 Estrutura

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── PreregController.php       # Registro, verificação, ranking
│   │   └── PhoneVerifyController.php  # WhatsApp OTP
│   ├── Models/
│   │   └── PreRegistro.php           # Model principal
│   ├── Mail/
│   │   └── VerifyPreregistration.php # E-mail de verificação
│   └── Services/
│       └── WhatsAppService.php       # Integração WhatsApp
├── database/migrations/
│   └── create_preregistro_table.php
├── resources/views/emails/
│   └── verify-prereg.blade.php       # Template do e-mail
├── routes/
│   └── api.php                       # Rotas da API
└── config/
    └── cors.php                      # CORS para frontend
```

## 🚀 Instalação Rápida

### 1. Instalar Laravel (se não fez ainda):
```bash
cd backend
composer install
```

### 2. Configurar Ambiente:
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configurar Banco (SQL Server):
```env
# .env
DB_CONNECTION=sqlsrv
DB_HOST=127.0.0.1
DB_PORT=1433
DB_DATABASE=preregistro_db
DB_USERNAME=sa
DB_PASSWORD=SuaSenha
```

### 4. Executar Migrations:
```bash
php artisan migrate
```

### 5. Configurar E-mail:
```env
# .env
MAIL_MAILER=smtp
MAIL_HOST=smtp.seuprovedor.com
MAIL_PORT=587
MAIL_USERNAME=seu@email.com
MAIL_PASSWORD=suasenha
MAIL_ENCRYPTION=tls
```

### 6. Iniciar Servidor:
```bash
php artisan serve
# API rodando em: http://localhost:8000
```

## 📱 WhatsApp (Opcional)

### Para ativar depois:
1. Configure Meta Business Account
2. Crie template `otp_login` aprovado
3. Adicione no `.env`:
```env
WHATSAPP_TOKEN=EAAx...
WHATSAPP_PHONE_ID=123456789
```

## 🔧 APIs Disponíveis

### Pré-Registro
```bash
POST /api/preregister
{
  "nickname": "GamePlayer",
  "email": "player@email.com", 
  "celular": "(11) 99999-9999",
  "senha": "minhasenha123",
  "referrer_code": "ABCD1234" // opcional
}
```

### Verificar E-mail
```bash
GET /api/verify/{token}
```

### Ranking
```bash
GET /api/ranking
```

### WhatsApp OTP (se configurado)
```bash
POST /api/phone/send-otp
{
  "email": "player@email.com",
  "phone": "+5511999999999"
}

POST /api/phone/verify-otp  
{
  "email": "player@email.com",
  "otp": "123456"
}
```

### Teste
```bash
GET /api/test
```

## 🎯 Sistema de Pontos

- **+50 pontos** ao confirmar e-mail
- **+50 pontos** para quem indicou 
- **Ranking** ordenado por pontos
- **Códigos únicos** para cada usuário

## 🔒 Segurança

- ✅ Throttling em todas rotas
- ✅ Validação forte de dados
- ✅ Senhas hasheadas
- ✅ Tokens únicos para verificação
- ✅ CORS configurado

## 🚀 Produção

### 1. Configurar Queue:
```bash
# .env
QUEUE_CONNECTION=database

# Executar
php artisan queue:table
php artisan migrate
php artisan queue:work
```

### 2. Configurar Cache:
```bash
php artisan config:cache
php artisan route:cache
```

### 3. Logs:
```bash
tail -f storage/logs/laravel.log
```

## 🐛 Troubleshooting

### Erro de CORS:
- Verificar `FRONTEND_URL` no `.env`
- Ajustar `config/cors.php` se necessário

### E-mail não chega:
- Verificar configurações SMTP
- Checar `storage/logs/laravel.log`

### WhatsApp não funciona:
- Verificar se variáveis estão preenchidas
- Template precisa estar aprovado no Meta

### SQL Server:
- Instalar drivers necessários
- Verificar conexão com `php artisan tinker`

---

## ✅ Checklist de Deploy

- [ ] Banco configurado e migrations rodadas
- [ ] E-mail funcionando  
- [ ] CORS configurado para frontend
- [ ] SSL/HTTPS em produção
- [ ] Queue configurada (se usar e-mail em massa)
- [ ] WhatsApp configurado (opcional)
- [ ] Logs monitorados
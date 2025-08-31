# 🎮 Sistema de Pré-Registro com Ranking – DDTank  

Projeto completo de **pré-registro com ranking de convites**, integrando **frontend em React/TypeScript** com **backend em Laravel**.  

---

## 📌 Funcionalidades Implementadas

- **Cadastro de usuários (pré-registro)**  
  - Validação de email e celular  
  - Geração de código de convite único  

- **Ranking em tempo real**  
  - Lista dos jogadores que mais convidaram  
  - Exibição de pontos, total de convites e taxa de conversão  

- **Compartilhamento via WhatsApp**  
  - Geração automática de link de convite  
  - Mensagem pronta para compartilhamento rápido  

- **Login e Sessão**  
  - Alternância entre cadastro e login na página inicial  
  - Função de logout  
  - Modal com informações promocionais após o registro  

- **WhatsApp OTP (opcional)**  
  - Envio de código de verificação  
  - Validação do número de celular  

- **Integração completa com API Laravel**  
  - Pré-registro  
  - Ranking  
  - Autenticação básica  
  - Envio e verificação de OTP  

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- ⚡ [Vite](https://vitejs.dev/)  
- ⚛️ [React + TypeScript](https://react.dev/)  
- 🎨 [TailwindCSS](https://tailwindcss.com/)  
- 🧩 [shadcn/ui](https://ui.shadcn.com/)  
- 🌐 [Axios](https://axios-http.com/)  

### **Backend**
- 🐘 [Laravel](https://laravel.com/) (PHP 8+)  
- 📦 Composer para dependências  
- 🛢️ Banco de Dados SQL (SQLite em dev, compatível com MySQL/PostgreSQL em prod)  
- 🔑 Autenticação e validação via Middleware  

---

## 🚀 Como Rodar o Projeto Localmente

### 📂 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA>
```

---

### 🖥️ 2. Configurar o Backend (Laravel)
```bash
cd backend

# Instalar dependências
composer install

# Copiar variáveis de ambiente
cp .env.example .env

# Gerar key da aplicação
php artisan key:generate

# Rodar migrations
php artisan migrate --seed

# Iniciar servidor local
php artisan serve
```

🔗 O backend estará rodando em:  
`http://localhost:8000/api`

---

### 💻 3. Configurar o Frontend (React/Vite)
```bash
cd ../

# Instalar dependências
npm install

# Rodar projeto em modo dev
npm run dev
```

🔗 O frontend estará rodando em:  
`http://localhost:5173`

---

## ⚙️ Configuração de Ambiente

No **frontend**, crie um arquivo `.env` com a URL da API Laravel:

```env
VITE_API_URL=http://localhost:8000/api
```

No **backend**, ajuste o `.env` para seu banco de dados e credenciais.  
Exemplo (SQLite em desenvolvimento):
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/backend/database/database.sqlite
```

---

## 📱 Fluxo do Usuário

1. Usuário acessa a página inicial e pode **se registrar ou logar**  
2. Ao se registrar, recebe um **código de convite único**  
3. Pode compartilhar o convite no **WhatsApp** com link automático  
4. Os convites válidos contabilizam pontos no **ranking**  
5. Ranking atualizado pode ser visto em tempo real na **página de ranking**  

---

## 🌍 Deploy

O projeto pode ser hospedado em qualquer servidor compatível com **Laravel (backend)** e **React (frontend)**.  

### Opções de Deploy:
- Backend: VPS/Dedicated, Laravel Forge, Docker  
- Frontend: Vercel, Netlify, Cloudflare Pages, ou deploy direto no mesmo servidor do backend  

👉 Em desenvolvimento inicial, parte do projeto foi criada via **Lovable.dev**, mas o repositório é totalmente independente.  

---

## 🤝 Créditos

Projeto desenvolvido por **rmdev**  
> Integração frontend + backend, ranking de convites e sistema de pré-registro.  

---

## 📜 Licença


Sinta-se livre para usar, modificar e contribuir!  

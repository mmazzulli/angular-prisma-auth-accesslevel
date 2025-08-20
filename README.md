🔐 Angular + Node + Prisma Auth App

Aplicação de autenticação e autorização com Angular (frontend) e Node.js/Express + Prisma (backend), incluindo JWT para autenticação e AuthGuard no Angular para proteger rotas baseadas em diferentes roles de usuário.

✨ Funcionalidades

Registro e login de usuários com senha criptografada (bcrypt).

Geração de JWT para autenticação.

Diferentes papéis de usuário. 

Proteção de rotas no frontend com AuthGuard.

Redirecionamento automático do usuário para o dashboard correspondente ao seu papel.

Estrutura pronta para expansão.

🛠️ Tecnologias utilizadas
Backend

Node.js + Express

Prisma ORM (SQLite ou outro banco configurável)

JWT (jsonwebtoken)

Bcrypt.js

Frontend

Angular 17+ (Standalone Components + Routing)

Reactive Forms

AuthGuard com base em roles

🚀 Como rodar o projeto
1. Clonar o repositório
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo

2. Configurar o backend
cd src
npm install


Crie um arquivo .env na raiz do backend:

PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=sua_chave_secreta_aqui


Rodar as migrations e iniciar:

npx prisma migrate dev --name init


O backend estará em: http://localhost:3000

3. Configurar o frontend
cd frontend
npm install
ng serve


O frontend estará em: http://localhost:4200

📂 Estrutura das rotas
Backend (/api/auth)


Frontend (Angular)

/home → Página inicial

/login → Login

/register → Registro

/superadmin → Dashboard SuperAdmin

/empresa → Dashboard Empresa

/funcionarios → Dashboard Funcionários

/clientes → Dashboard Clientes

🧪 Como testar

Registre um usuário (/register) escolhendo um papel.

Faça login (/login) e copie o token JWT.

No frontend, após login, você será redirecionado para o dashboard do seu papel.

Teste acessar rotas protegidas → se o papel não tiver permissão, acesso negado.


# 🛡️ Projeto Base de Autenticação (Angular + Node + Prisma + MySQL + CSS)

Este é um **projeto base** para autenticação de usuários com **login**, **registro** e **logout**, pronto para ser reutilizado em outros sistemas.  
Inclui **frontend em Angular standalone** e **backend em Node.js com Prisma ORM e MySQL**, utilizando **JWT** para autenticação.

> 📌 Este projeto está funcional até a etapa de login/registro/logout. Ainda **não** inclui AuthGuard ou proteção de rotas no Angular.

---

## 📂 Estrutura do Projeto
/frontend → Aplicação Angular Standalone + CSS
/backend → API Node.js com Prisma + MySQL

## 🚀 Funcionalidades

- Registro de novos usuários
- Login com JWT
- Logout
- Validação no frontend e backend
- Integração completa Angular ↔ Node
- MySQL com Prisma ORM

---

## 🖥️ Tecnologias Utilizadas

**Frontend**
- Angular Standalone
- Reactive Forms
- TailwindCSS (opcional para estilização)
- HTTPClient

**Backend**
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT (Json Web Token)
- bcrypt (hash de senha)

---

## 📦 Como Rodar Localmente

### 1️⃣ Pré-requisitos
- Node.js >= 18
- Angular CLI instalado globalmente
- MySQL rodando (pode usar XAMPP, WAMP, MAMP ou similar)
- Git

---

### 2️⃣ Clonar o repositório

git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
3️⃣ Configurar o Backend
bash
Copiar
Editar
cd backend
npm install
Crie o arquivo .env com o conteúdo:

env
Copiar
Editar
DATABASE_URL="mysql://root:senha@localhost:3306/nome_do_banco"
JWT_SECRET="uma_chave_secreta_segura"
PORT=3000
Inicialize o Prisma:

bash
Copiar
Editar
npx prisma migrate dev --name init
npx prisma generate
Inicie o servidor:

bash
Copiar
Editar
npm run dev
O backend estará disponível em:
http://localhost:3000

4️⃣ Configurar o Frontend
bash
Copiar
Editar
cd ../frontend
npm install
Atualize a URL do backend no serviço AuthService (se necessário):

ts
Copiar
Editar
private apiUrl = 'http://localhost:3000';
Inicie o servidor Angular:

bash
Copiar
Editar
ng serve
Acesse:
http://localhost:4200

🐳 Rodando com Docker
Essa configuração permite subir backend, frontend e banco de dados MySQL usando Docker Compose.

1️⃣ Pré-requisitos
Docker instalado

Docker Compose instalado

2️⃣ Estrutura esperada
Crie um arquivo docker-compose.yml na raiz do projeto:

yaml
Copiar
Editar
version: '3.8'

services:
  mysql:
    image: mysql:8
    container_name: mysql_auth
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: auth_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    container_name: backend_auth
    restart: always
    environment:
      DATABASE_URL: mysql://root:root@mysql:3306/auth_db
      JWT_SECRET: uma_chave_secreta_segura
      PORT: 3000
    depends_on:
      - mysql
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    container_name: frontend_auth
    restart: always
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  mysql_data:
3️⃣ Subir tudo com um comando
bash
Copiar
Editar
docker-compose up --build
4️⃣ Acessos
Frontend: http://localhost:4200

Backend: http://localhost:3000

MySQL: porta 3306

📌 Como Reutilizar este Projeto
Clone este repositório como base para um novo projeto

Renomeie as pastas e ajuste as variáveis no .env

Adicione suas páginas e funcionalidades

Mantenha a estrutura de autenticação para reaproveitar o login/registro/logout sem alterações

📝 Licença
FREE for Students

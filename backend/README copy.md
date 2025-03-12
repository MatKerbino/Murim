# Backend da Academia Murim

Este é o backend do sistema de gerenciamento da Academia Murim, desenvolvido com Laravel e PostgreSQL.

## Requisitos

- PHP >= 8.1
- Composer
- PostgreSQL
- Extensões PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## Instalação

1. Clone o repositório
2. Entre na pasta do projeto: `cd backend`
3. Instale as dependências: `composer install`
4. Copie o arquivo de ambiente: `cp .env.example .env`
5. Configure o arquivo .env com suas credenciais de banco de dados PostgreSQL
6. Gere a chave da aplicação: `php artisan key:generate`
7. Execute as migrations: `php artisan migrate`
8. Execute os seeders (opcional): `php artisan db:seed`
9. Inicie o servidor: `php artisan serve`

## Estrutura do Projeto

O backend segue a arquitetura MVC do Laravel:

- `app/Models`: Modelos de dados
- `app/Http/Controllers`: Controladores da API
- `app/Http/Requests`: Classes de validação de requisições
- `app/Http/Resources`: Transformadores de recursos da API
- `app/Http/Middleware`: Middlewares para autenticação e autorização
- `database/migrations`: Migrações do banco de dados
- `database/seeders`: Seeders para popular o banco de dados
- `routes/api.php`: Rotas da API

## API Endpoints

A documentação completa da API está disponível em `/api/documentation` após iniciar o servidor.


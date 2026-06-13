# Sistema E-commerce

Sistema de e-commerce full-stack com backend em Spring Boot e frontend em Angular, containerizado com Docker.

## Tecnologias

**Backend**
- Java 21 + Spring Boot 3.2.5
- Spring Security + JWT (jjwt 0.12.5)
- Spring Data JPA + PostgreSQL 16
- Lombok, Bean Validation
- Springdoc OpenAPI (Swagger UI)
- JUnit 5 + Spring Security Test

**Frontend**
- Angular (TypeScript)
- Nginx (servido em container)

**Infra**
- Docker + Docker Compose
- PostgreSQL 16 (Alpine)

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Controle de acesso por roles: `ADMIN` e `USER`
- CRUD de produtos e categorias (Admin)
- Upload de imagem de produto
- Carrinho de compras por usuário
- Criação de pedidos (lê o carrinho, calcula total, atualiza estoque, limpa carrinho)
- Histórico de pedidos
- Documentação interativa via Swagger UI
- Tratamento global de erros (`@RestControllerAdvice`)

## Endpoints principais

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| POST | `/auth/register` | Cadastro de usuário | Público |
| POST | `/auth/login` | Login (retorna JWT) | Público |
| GET | `/products` | Listar produtos | Público |
| POST | `/products` | Criar produto | ADMIN |
| PUT | `/products/{id}` | Editar produto | ADMIN |
| DELETE | `/products/{id}` | Remover produto | ADMIN |
| GET | `/cart` | Ver carrinho | USER |
| POST | `/cart/add` | Adicionar item | USER |
| DELETE | `/cart/item/{id}` | Remover item | USER |
| POST | `/orders` | Finalizar pedido | USER |
| GET | `/orders` | Listar pedidos | USER |

## Como rodar

### Com Docker (recomendado)

```bash
docker-compose up --build
```

Serviços disponíveis:
- Frontend: http://localhost:4200
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432

### Sem Docker

**Pré-requisitos:** Java 21, Maven, PostgreSQL rodando localmente.

1. Crie o banco de dados:
```sql
CREATE DATABASE ecommerce;
```

2. Configure `backend/src/main/resources/application.properties` se necessário.

3. Suba o backend:
```bash
cd backend
mvn spring-boot:run
```

4. Suba o frontend:
```bash
cd frontend
npm install
ng serve
```

## Estrutura do projeto

```
sistema_ecommerce/
├── backend/
│   ├── src/
│   │   ├── main/java/com/ecommerce/backend/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── security/
│   │   │   ├── config/
│   │   │   └── exception/
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
├── frontend/
│   └── src/
├── docker-compose.yml
└── README.md
```

## Modelo de dados

```
User         — id, name, email, password, role
Category     — id, name
Product      — id, name, description, price, imageUrl, stock, category_id
Cart         — id, user_id
CartItem     — id, cart_id, product_id, quantity
Order        — id, user_id, date, total, status
OrderItem    — id, order_id, product_id, price, quantity
```

## Testes

```bash
cd backend
mvn test
```

Cobertura alvo: 80%+ nos serviços (`ProductService`, `OrderService`, `UserService`).

## Variáveis de ambiente (Docker)

| Variável | Valor padrão | Descrição |
|----------|-------------|-----------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/ecommerce` | URL do banco |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | Senha do banco |

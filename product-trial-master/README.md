# AltenShop — Product Trial

This repository is a demo e-commerce application used for a product-trial exercise. It contains a Spring Boot backend (REST API with JWT authentication) and an Angular (standalone components) frontend. The project implements product management, user registration/login, cart and wishlist features, and a paginated product listing.

---

## Quick summary (what this app is)

- Backend: Java Spring Boot REST API that exposes endpoints for products, authentication (/account, /token), cart and wishlist management.
- Frontend: Angular 18 single-page app that consumes the backend REST API, manages authentication via JWT, and provides product listing, add-to-cart, and wishlist UX.

This project was built as an implementation of the exercise described below (original instructions are preserved at the end of this file).

## Main functionality (user-facing)

- Browse paginated list of products (search/filter supported).
- Add a product to your cart from the product list.
- View cart contents (each cart entry includes product details and quantity).
- Add/remove product IDs to/from a wishlist.
- Register a new user and log in (JWT); token is stored in the browser and used for authenticated calls.
- Admin-only product management (create/update/delete) is restricted to `admin@admin.com`.

## How it works (high level)

- Authentication: users register via `POST /api/account` and obtain a token via `POST /api/token`. The token is a JWT that identifies the user email.
- Protected endpoints: cart and wishlist endpoints require an Authorization header with `Bearer <token>`. The product create/update/delete endpoints check the authenticated principal and allow writes only when the email equals `admin@admin.com`.
- Pagination: `GET /api/products` accepts `page`, `size`, `q` and `category` query parameters and returns a JSON payload with `{ items: Product[], total, page, size }`.

## API (Swagger)

The backend exposes an OpenAPI/Swagger UI. After starting the backend, open:

- http://localhost:3000/swagger-ui.html
  or
- http://localhost:3000/swagger-ui/index.html

This UI documents all endpoints (`/api/products`, `/api/account`, `/api/token`, `/api/cart`, `/api/wishlist`) and allows you to try requests directly from the browser.

## Technologies used

- Backend: Java 17, Spring Boot 3.x, Spring Web, Spring Data JPA (H2 in-memory DB for development), Spring Security (JWT), jjwt for token handling, springdoc-openapi for Swagger UI.
- Frontend: Angular 18 (standalone components), HttpClient, Signals, PrimeNG (UI components), PrimeFlex utilities, TypeScript.
- Build & test: Maven for backend, npm / Angular CLI for frontend. Unit/integration tests for backend use JUnit + Spring MockMvc.

## Run locally

Prerequisites:

- Java 17+
- Maven
- Node.js + npm
- Angular CLI (optional, `npx ng` works too)

1) Start the backend

```powershell
cd back
mvn -DskipTests spring-boot:run
```

The backend will start on port 3000 by default and seed some products. Optionally an admin user can be seeded in development if you provide the environment variables `ALTENSHOP_DEV_ADMIN_EMAIL` and `ALTENSHOP_DEV_ADMIN_PASSWORD` before starting the backend (recommended for local testing). For example on PowerShell:

```powershell
$env:ALTENSHOP_DEV_ADMIN_EMAIL = 'admin@admin.com'; $env:ALTENSHOP_DEV_ADMIN_PASSWORD = 'your-local-password'
mvn -DskipTests spring-boot:run
```

2) Start the frontend

```powershell
cd front
npm install   # first time only
ng serve
```

The frontend dev server runs on http://localhost:4200 and talks to the backend at http://localhost:3000.

## Project structure (high level)

- back/: Spring Boot backend
  - src/main/java/com/altenshop/controller: REST controllers (ProductController, CartController, WishlistController, AuthController)
  - src/main/java/com/altenshop/model: JPA entities and DTOs
  - src/main/java/com/altenshop/repository: Spring Data JPA repositories
  - src/main/java/com/altenshop/service: JwtService, UserService, etc.
  - src/main/resources: application properties and dev seed data

- front/: Angular frontend
  - src/app/auth: login/register, AuthService, AuthInterceptor
  - src/app/products: product list, product service (getPaged), product form
  - src/app/cart, src/app/wishlist: pages & services
  - package.json, tsconfig.json, angular.json, etc.

## Running tests

### Backend

Run the backend integration tests (MockMvc):

```powershell
cd back
mvn test
```

These tests exercise account creation, token issuance, cart and wishlist flows, and the paged product endpoint.

### Frontend

Frontend unit tests (Jasmine/Karma) are present in `front/src/app` as `.spec.ts` files, but the project does not include test runner devDependencies by default. To run them:

```powershell
cd front
# install dev deps (example)
npm install --save-dev karma karma-chrome-launcher karma-jasmine jasmine-core @types/jasmine @angular-devkit/build-angular
ng test --watch=false
```


## End-to-end notes & shortcuts

- Dev admin seeding: if you want the app to create a dev admin user, set `ALTENSHOP_DEV_ADMIN_EMAIL` and `ALTENSHOP_DEV_ADMIN_PASSWORD` in your environment before starting the backend. The application will NOT print passwords to console.
- Swagger UI: http://localhost:3000/swagger-ui.html
- API base: http://localhost:3000/api

## What was implemented (feature checklist)

- User registration (`POST /api/account`) and login/token (`POST /api/token`).
- Product listing with server-side pagination and search (`GET /api/products`).
- Product create/update/delete protected: only `admin@admin.com` can write.
- Cart endpoints (`GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/{productId}`) that return enriched product entries.
- Wishlist endpoints (`GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/{productId}`).
- Frontend: login, registration (auto-login), product listing UI, add-to-cart, wishlist, top-right cart badge, toast for 403 warnings, paginator & search wired to backend.

---

# Consignes

- Vous êtes développeur front-end : vous devez réaliser les consignes décrites dans le chapitre [Front-end](#Front-end)

- Vous êtes développeur back-end : vous devez réaliser les consignes décrites dans le chapitre [Back-end](#Back-end) (*)

- Vous êtes développeur full-stack : vous devez réaliser les consignes décrites dans le chapitre [Front-end](#Front-end) et le chapitre [Back-end](#Back-end) (*)

(*) Afin de tester votre API, veuillez proposer une stratégie de test appropriée.

## Front-end

Le site de e-commerce d'Alten a besoin de s'enrichir de nouvelles fonctionnalités.

### Partie 1 : Shop

- Afficher toutes les informations pertinentes d'un produit sur la liste
- Permettre d'ajouter un produit au panier depuis la liste 
- Permettre de supprimer un produit du panier
- Afficher un badge indiquant la quantité de produits dans le panier
- Permettre de visualiser la liste des produits qui composent le panier.

### Partie 2

- Créer un nouveau point de menu dans la barre latérale ("Contact")
- Créer une page "Contact" affichant un formulaire
- Le formulaire doit permettre de saisir son email, un message et de cliquer sur "Envoyer"
- Email et message doivent être obligatoirement remplis, message doit être inférieur à 300 caractères.
- Quand le message a été envoyé, afficher un message à l'utilisateur : "Demande de contact envoyée avec succès".

### Bonus : 

- Ajouter un système de pagination et/ou de filtrage sur la liste des produits
- On doit pouvoir visualiser et ajuster la quantité des produits depuis la liste et depuis le panier 

## Back-end

### Partie 1

Développer un back-end permettant la gestion de produits définis plus bas.
Vous pouvez utiliser la technologie de votre choix parmi la liste suivante :

- Node.js/Express
- Java/Spring Boot
- C#/.net Core
- PHP/Symphony : Utilisation d'API Platform interdite

Un produit a les caractéristiques suivantes : 

``` typescript
class Product {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  internalReference: string;
  shellId: number;
  inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
  rating: number;
  createdAt: number;
  updatedAt: number;
}
```

Le back-end créé doit pouvoir gérer les produits dans une base de données SQL/NoSQL ou dans un fichier json.

### Partie 2

- Imposer à l'utilisateur de se connecter pour accéder à l'API.
  La connexion doit être gérée en utilisant un token JWT.  
  Deux routes devront être créées :
  * [POST] /account -> Permet de créer un nouveau compte pour un utilisateur avec les informations fournies par la requête.   
    Payload attendu : 
    ```
    {
      username: string,
      firstname: string,
      email: string,
      password: string
    }
    ```
  * [POST] /token -> Permet de se connecter à l'application.  
    Payload attendu :  
    ```
    {
      email: string,
      password: string
    }
    ```
    Une vérification devra être effectuée parmi tout les utilisateurs de l'application afin de connecter celui qui correspond aux infos fournies. Un token JWT sera renvoyé en retour de la reqûete.
- Faire en sorte que seul l'utilisateur ayant le mail "admin@admin.com" puisse ajouter, modifier ou supprimer des produits. Une solution simple et générique devra être utilisée. Il n'est pas nécessaire de mettre en place une gestion des accès basée sur les rôles.
- Ajouter la possibilité pour un utilisateur de gérer un panier d'achat pouvant contenir des produits.
- Ajouter la possibilité pour un utilisateur de gérer une liste d'envie pouvant contenir des produits.

## Bonus

Vous pouvez ajouter des tests Postman ou Swagger pour valider votre API
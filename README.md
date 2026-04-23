# ShopHub

ShopHub egy teljes stackes webáruház alkalmazás NestJS backenddel és React/Vite frontenddel. A projekt egy működő e-kereskedelmi alapot ad: felhasználókezelés, termékek, rendelések, címek, vélemények, kívánságlista, összehasonlítás, legutóbb megtekintett termékek, fordítások és admin funkciók.

## Projekt Felépítése

- `backend`: NestJS API, Prisma, migrációk, seed, Swagger
- `frontend`: React + TypeScript + Vite kliens
- `database/exports`: adatbázis exportok `.sql` formátumban

## Rendszerkövetelmények

- Node.js 18 vagy újabb
- npm 9 vagy újabb
- MySQL vagy MySQL-kompatibilis adatbázis
- internetkapcsolat a külső szolgáltatásokhoz, ha használod őket

## Technológiai Stack

### Backend

- NestJS 11
- Prisma 6
- JWT / Passport
- Swagger / OpenAPI
- Multer fájlfeltöltés
- Cloudinary képfeltöltéshez

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- i18next

## Környezeti Változók

A projekt a repóban már commitolt [backend/.env](backend/.env) és [frontend/.env](frontend/.env) fájlokat használja. Ezek a jelenlegi backend és frontend konfigurációk, a kód ezekből olvas induláskor.

A backend oldalon a fontos kulcsok a `PORT`, `DATABASE_URL`, `FRONTEND_URL` és `JWT_SECRET`, plusz az opcionális külső szolgáltatás kulcsok. A frontend oldalon a fontos kulcsok a `VITE_API_URL`, `VITE_PACKETA_API_KEY`, `VITE_PACKETA_API_LOCALE` és `VITE_PACKETA_INVOICE_LOCALE`.

## Telepítés

```bash
npm install
```

A gyökér `postinstall` script lefuttatja a `setup.js`-t, ami külön telepíti a backend és frontend függőségeket, majd Prisma generate és migrate lépéseket is futtat.
Seed automatikusan nem fut.

## Fejlesztői Indítás

### Gyors Lokális Indítás (Ajánlott)

Ezt a flow-t használd, ha a frontend és backend Vercelen is megy, de lokálisan is ugyanazzal a TiDB Cloud adatbázissal akarsz tesztelni:

```bash
npm install
npm run local:dev
```

Mit csinál:

- `local:setup`: Prisma client generálás + migrációk futtatása backend kontextusban
- `dev`: backend + frontend párhuzamos indítása

Fontos: ez a flow nem futtat seedet, így a meglévő TiDB adatok érintetlenek maradnak.

Ha a `3000` vagy `5173` port foglalt, állítsd át a portot `.env`-ben, vagy zárd be a korábban futó folyamatot.
`npm run dev:backend` indítás előtt automatikusan felszabadítja a `3000` portot.

### Teljes alkalmazás

```bash
npm run dev
```

### Csak backend

```bash
npm run dev:backend
```

### Csak frontend

```bash
npm run dev:frontend
```

## Adatbázis

A projekt adatbázisa TiDB Cloudon fut, és a jelenlegi alapadatok már fel vannak töltve.

### Prisma műveletek

```bash
npm run db:generate
npm run db:migrate
```

Fontos: a Prisma parancsokat mindig backend kontextusban futtasd (például a fenti npm scriptekkel), ne közvetlenül a repo gyökeréből `npx prisma ...` formában.

### Mit csinálnak ezek

- `db:generate`: legenerálja a Prisma klienst
- `db:migrate`: backend oldali migrációs parancs

Seedet csak kézzel futtass, ha kifejezetten újra akarod tölteni a mintaadatokat:

```bash
npm run db:seed
```

## Hasznos Parancsok

```bash
npm run build
npm run build:backend
npm run build:frontend
```

Backend könyvtárból:

```bash
npm run start:dev
npm run test:api
```

## Elérési Címek Lokálisan

- frontend: `http://localhost:5173`
- backend API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Swagger / API Dokumentáció

A backend indulása után az OpenAPI dokumentáció a következő címen érhető el:

`http://localhost:3000/api/docs`

Az API globális prefixe: `/api`

## Fő Modulok és Funkciók

- `auth`: regisztráció, belépés, tokenfrissítés
- `users`: felhasználók, profil, avatar feltöltés
- `products`: termékek, featured lista, képfeltöltés
- `orders`: rendelések, státusz, teljesítés
- `order-items`: admin rendelési tételek
- `reviews`: termékértékelések
- `wishlist`: kívánságlista
- `compare`: összehasonlító lista
- `addresses`: szállítási címek
- `recently-viewed`: legutóbb megtekintett termékek
- `translations`: szövegfordítási segédvégpontok

## Adatmodell Röviden

A backend Prisma sémája az e-kereskedelmi működés köré épül, a tényleges adatbázis pedig TiDB Cloudon van.

- felhasználók és szerepkörök
- termékek és fordítások
- rendelések és rendeléstételek
- címek
- vélemények
- wishlist és compare elemek
- legutóbb megtekintett termékek

## Seed és Mintaadatok

A seed a mintaadatok kezelésére szolgál; a jelenlegi alapadatok már fent vannak a TiDB Cloud adatbázisban.

- több kategóriás termékek
- felhasználók különböző szerepkörrel
- rendelések és rendeléstételek
- címek, vélemények, wishlist, compare, recently viewed adatok

## SQL Exportok

A `database/exports` mappában az exportok közvetlen `.sql` fájlok, ezért import előtt nem kell tömörített állományokat bontani.

## Hibaelhárítás

### A backend nem indul

- ellenőrizd a `backend/.env` tartalmát
- nézd meg, hogy a `DATABASE_URL` elérhető adatbázisra mutat-e
- futtasd újra: `npm run db:generate`

### A frontend nem éri el az API-t

- ellenőrizd, hogy a backend fut-e a 3000-es porton
- nézd meg, hogy a `VITE_API_URL` helyes-e
- ellenőrizd a CORS és a `FRONTEND_URL` értékét

### A Packeta widget nem jelenik meg

- ellenőrizd a `VITE_PACKETA_API_KEY` értékét
- ellenőrizd a `VITE_PACKETA_API_LOCALE` értékét

### A Swagger nem nyílik meg

- ellenőrizd, hogy a backend elindult-e
- nézd meg a `http://localhost:3000/api/docs` címet

## Megjegyzés

A projektben nincs külön WebSocket réteg, ezért ehhez nem érdemes külön dokumentációt vagy környezeti változót keresni.

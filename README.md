# ShopHub

ShopHub egy teljes stackes webáruház alkalmazás NestJS backenddel és React/Vite frontenddel. A projekt egy működő e-kereskedelmi alapot ad: felhasználókezelés, termékek, rendelések, címek, vélemények, kívánságlista, összehasonlítás, legutóbb megtekintett termékek, fordítások és admin funkciók.

## Projekt felépítése

- backend: NestJS API, Prisma, migrációk, seed, Swagger
- frontend: React + TypeScript + Vite kliens
- database/exports: adatbázis exportok `.sql` formátumban

## Rendszerkövetelmények

- Node.js 18 vagy újabb
- npm 9 vagy újabb
- MySQL vagy MySQL-kompatibilis adatbázis
- internetkapcsolat a külső szolgáltatásokhoz, ha használod őket

## Technológiai stack

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

## Indítás előtti beállítások

A repó már tartalmazza a használt backend `.env` példát és a projektben ténylegesen használt Vite környezeti változókat. Ne régi, idegen példák alapján állítsd be, hanem a jelenlegi kódban használt neveket használd.

### Backend környezeti változók

Hozz létre egy `backend/.env` fájlt, és töltsd ki legalább ezeket:

- `PORT`
- `DATABASE_URL`
- `FRONTEND_URL`
- `JWT_SECRET`

Opcionálisan, ha a megfelelő funkciókat is használod:

- `OPENAI_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PACKETA_API_KEY`
- `PACKETA_API_PASSWORD`
- `PACKETA_API_LOCALE`
- `PACKETA_INVOICE_LOCALE`
- `LIBRETRANSLATE_API_URL`
- `LIBRETRANSLATE_API_KEY`

A helyi fejlesztéshez a backend az `http://localhost:3000` portot használja, a frontend pedig alapból az `http://localhost:5173` címen fut.

### Frontend környezeti változók

A frontend a következő Vite env változókat használja:

- `VITE_API_URL`
- `VITE_PACKETA_API_KEY`
- `VITE_PACKETA_API_LOCALE`

Ha ezek nincsenek megadva, a frontend a helyi alapértékekkel próbál működni, de a Packeta widgethez és az API célpontjához érdemes beállítani őket.

## Telepítés

A projekt gyökerében:

```bash
npm install
```

A gyökér `postinstall` script lefuttatja a `setup.js`-t, ami külön telepíti a backend és frontend függőségeket, majd Prisma generate és migrate lépéseket is futtat.

## Fejlesztői indítás

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

### Prisma

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Mit csinálnak ezek

- `db:generate`: legenerálja a Prisma klienst
- `db:migrate`: lefuttatja a migrációkat
- `db:seed`: feltölti a tesztadatokat

## Hasznos parancsok

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

## Elérési címek lokálisan

- frontend: `http://localhost:5173`
- backend API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Swagger / API dokumentáció

A backend indulása után az OpenAPI dokumentáció a következő címen érhető el:

`http://localhost:3000/api/docs`

Az API globális prefixe: `/api`

## Fő modulok és funkciók

- auth: regisztráció, belépés, tokenfrissítés
- users: felhasználók, profil, avatar feltöltés
- products: termékek, featured lista, képfeltöltés
- orders: rendelések, státusz, teljesítés
- order-items: admin rendelési tételek
- reviews: termékértékelések
- wishlist: kívánságlista
- compare: összehasonlító lista
- addresses: szállítási címek
- recently-viewed: legutóbb megtekintett termékek
- translations: szövegfordítási segédvégpontok

## Adatmodell röviden

A backend Prisma sémája az e-kereskedelmi működés köré épül:

- felhasználók és szerepkörök
- termékek és fordítások
- rendelések és rendeléstételek
- címek
- vélemények
- wishlist és compare elemek
- legutóbb megtekintett termékek

## Seed és mintaadatok

A seed célja, hogy fejlesztéshez és bemutatóhoz azonnal használható adatok legyenek:

- több kategóriás termékek
- felhasználók különböző szerepkörrel
- rendelések és rendeléstételek
- címek, vélemények, wishlist, compare, recently viewed adatok

## SQL exportok

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

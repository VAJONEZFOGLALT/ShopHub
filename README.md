# ShopHub – Fejlesztői Dokumentáció

## 1. Projekt áttekintés
A ShopHub egy teljes stackes webáruház-rendszer, amely valós e-kereskedelmi folyamatokat fed le:

- felhasználókezelés (regisztráció, bejelentkezés, profil)
- terméklista és termékadatlap
- kosár és rendelésleadás
- rendeléskövetés
- vélemények, kívánságlista, összehasonlítás, legutóbb megtekintett elemek
- adminisztrációs műveletek
- többnyelvű felület

A projekt célja egy gyakorlatban is használható, bővíthető architektúra bemutatása frontend és backend oldalon.

## 2. Technológiai stack
### Backend
- Node.js
- NestJS
- Prisma ORM
- JWT autentikáció (Passport)
- Swagger / OpenAPI dokumentáció
- Multer fájlfeltöltés (termék- és avatarképek)

### Frontend
- React
- TypeScript
- Vite
- React Router
- i18next

### Adatbázis és egyéb integrációk
- MySQL-kompatibilis adatbázis (Prisma datasource)
- Cloudinary (képtárolás)
- SMTP/Nodemailer (értesítő e-mailek)

Megjegyzés: a jelenlegi kódbázisban nincs aktív WebSocket Gateway.

## 3. Rendszerkövetelmények
- Node.js 18+
- npm 9+
- MySQL vagy MySQL-kompatibilis szerver
- (Opcionális) Cloudinary és SMTP hozzáférés, ha képfeltöltést és e-mail küldést is használnál

## 4. Projektstruktúra
- backend: NestJS API, Prisma séma, migrációk, seed
- frontend: React/Vite kliensalkalmazás
- database/exports: adatbázis exportok (immár közvetlen .sql fájlok)

## 5. Környezeti változók
Hozz létre egy .env fájlt a backend könyvtárban.

Ajánlott minta:

DATABASE_URL="mysql://root:password@localhost:3306/shophub"
JWT_SECRET="ide-egy-hosszú-véletlen-jelszó"
PORT=3000
FRONTEND_URL="http://localhost:5173"

# Opcionális, ha képfeltöltést is használsz
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Opcionális, ha e-mail küldést is használsz
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM=""

Erős JWT kulcs generálása:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## 6. Indítási útmutató
### 6.1 Függőségek telepítése
A projekt gyökerében:

npm install

Megjegyzés: a gyökér postinstall script automatikusan futtatja a setup.js lépéseit (backend/frontend install, Prisma generate, migráció deploy).

### 6.2 Adatbázis inicializálása (ha szükséges)

npm run db:generate
npm run db:migrate
npm run db:seed

Ez legenerálja a Prisma klienst, lefuttatja a migrációkat, majd feltölti az adatokat.

### 6.3 Teljes rendszer indítása (frontend + backend)

npm run dev

Elérési címek helyi futásnál:

- frontend: http://localhost:5173
- backend API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs

## 7. Hasznos parancsok
Gyökér könyvtárból:

- npm run dev:backend – csak backend
- npm run dev:frontend – csak frontend
- npm run build – teljes build
- npm run build:backend – backend build
- npm run build:frontend – frontend build
- npm run db:generate – Prisma kliens generálás
- npm run db:migrate – migrációk futtatása
- npm run db:seed – seed futtatása

Backend könyvtárból:

- npm run start:dev
- npm run test:api

## 8. API dokumentáció
A backend indulása után a Swagger UI itt érhető el:

http://localhost:3000/api/docs

Az API globális prefixe: /api

## 9. Adatbázis séma és fő entitások
Főbb modellek:

- Users
- Products
- Orders
- OrderItems
- Address
- Reviews
- Wishlist
- CompareItems
- RecentlyViewed
- Translation

Kapcsolatok röviden:

- egy felhasználónak több rendelése lehet
- egy rendelés több tételből áll
- termékhez tartozhat vélemény, wishlist, compare és recently-viewed kapcsolat
- címek felhasználóhoz kapcsolódnak

## 10. Biztonság és jogosultság
- JWT alapú autentikáció
- role alapú hozzáférés (USER / ADMIN)
- érzékeny végpontok guardolva
- saját adatokhoz tulajdonosi ellenőrzés

## 11. Fordítás és lokalizáció
A frontend i18next-et használ.

Fő locale fájlok:

- frontend/src/i18n/locales/hu.json
- frontend/src/i18n/locales/en.json

A backend oldalon a terméknév/kategória fordításokhoz a Translation tábla és fordítási szolgáltatás is használatban van.

## 12. Seed és demó adatok
A seed script valószerű mintaadatokat tölt fel:

- termékek több kategóriában
- felhasználók különböző szerepkörrel
- rendelések és rendeléstételek
- címek, vélemények, wishlist, compare, recently viewed

Ez megkönnyíti a fejlesztést és a bemutatást lokális környezetben.

## 13. SQL exportok
A database/exports mappában a dumpok közvetlen .sql formátumban érhetők el, így nem kell .gz fájlokat kicsomagolni import előtt.

## 14. Hibaelhárítás
### Backend nem indul
- ellenőrizd a backend .env fájlt
- ellenőrizd, hogy a DATABASE_URL elérhető adatbázisra mutat-e
- futtasd újra: npm run db:generate

### Frontend nem éri el az API-t
- ellenőrizd, hogy a backend fut-e a 3000-es porton
- ellenőrizd a CORS és FRONTEND_URL beállítást

### Swagger nem elérhető
- ellenőrizd a backend indulási logját
- helyes útvonal: /api/docs

## 15. További fejlesztési ötletek
- online fizetési szolgáltató integráció
- kupon- és kedvezményrendszer
- részletesebb admin riportok
- E2E tesztelés bővítése
- cache/performancia finomhangolás nagy adatmennyiségre

## 16. Rövid összegzés
A ShopHub egy jól szeparált, modern webalkalmazás, amely alkalmas fejlesztői dokumentáció, vizsgaremek-bemutató és további bővítés alapjaként is.

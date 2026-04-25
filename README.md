# ShopHub - Vizsgaremek dokumentacio

## Projekt rovid bemutatasa
A ShopHub egy teljes stackes webaruhaz alkalmazas, amely valos e-kereskedelmi mukodest modellez: termeklistazas, kosar, rendeles, felhasznaloi fiok es admin kezeles.

A projekt celja, hogy gyakorlati peldan mutassa be egy modern webes rendszer tervezeset es megvalositasat frontend es backend oldalon egyarant.

## Projekt celjai
- korszeru, felhasznalobarat webshop felulet kialakitasa
- stabil backend API letrehozasa jogosultsagkezelessel
- adatbazis alapu termek- es rendeleskezeles
- admin oldali menedzsment funkciok biztositas
- tobbnyelvu tamogatas es valoszeru adatokkal valo mukodes

## Funkcionalis kovetelmenyek
Felhasznaloi oldal:
- regisztracio, bejelentkezes
- termekek bongeszese kategoriak szerint
- szures, kereses, rendezes
- kosar kezeles
- rendeles letrehozasa es rendelesek megtekintese

Admin oldal:
- felhasznalok kezelese
- termekek kezelese
- rendelesek allapotanak kezelese
- alap statisztikai attekintes

Kozos funkciok:
- tobbnyelvu felulet
- kepkezeles
- e-mailertesitesek

## Nem funkcionalis kovetelmenyek
- jol tagolt, bovitheto kodstruktura
- tipusos fejlesztes TypeScript alapon
- API es kliens oldali hibakezeles
- tesztelheto endpoint szerkezet

## Technologiai kornyezet
Frontend:
- React
- TypeScript
- Vite
- React Router
- i18next

Backend:
- NestJS
- TypeScript
- Prisma
- JWT alapu autentikacio

Adattarolas es integraciok:
- MySQL kompatibilis adatbazis
- Cloudinary (kepkezeles)
- SMTP (ertesito e-mailek)

## Rendszerfelépites
A megoldas ket fo reszre bontva mukodik:

1. Frontend kliensalkalmazas
- felhasznaloi felulet
- allapotkezeles
- API kommunikacio

2. Backend REST API
- uzleti logika
- adatbazis muveletek
- hitelesites es jogosultsagkezeles

## Adatmodell (magas szintu)
Legfontosabb entitasok:
- Users
- Products
- Orders
- OrderItems
- Reviews
- Wishlist
- RecentlyViewed
- CompareItems
- Address
- Translation

A modell ugy lett kialakitva, hogy valos webshop szcenariokat tudjon kiszolgalni.

## Biztonsag es jogosultsag
- JWT alapu tokenes hitelesites
- vedett vegpontok
- rendeles-hozzaferes tulajdonos alapon (vagy admin jogosultsaggal)

## Valoszeru adatok (seed)
A projekt tartalmaz automatikus adatfeltoltest, amely:
- valoszerubb termekneveket es arkategoriakat general
- kategoriankent elteto keszletmintakat hasznal
- rendelesi es felhasznaloi adatsorokat hoz letre

Ez lehetove teszi, hogy a rendszer demo korulmenyek kozott is hitelesen viselkedjen.

## Futtatasi alaplepesek
Gyoker konyvtarbol:

1. Fuggosegek telepitese:
- npm install

2. Helyi fejlesztes inditasa:
- npm run dev

3. Build ellenorzes:
- npm run build

## Teszteles
A projekt tamogat API endpoint lefedettsegi ellenorzest, valamint forditasi/build ellenorzeseket.

Alap ellenorzesek:
- backend TypeScript check
- backend API endpoint tesztek
- frontend build

## Tovabbfejlesztesi lehetosegek
- online fizetesi szolgaltato integracio
- szallitasi dij dinamikus szamitas
- kupon- es kedvezmeny modul
- fejlettebb riportok admin oldalon
- automatizalt E2E tesztek

## Osszegzes
A ShopHub vizsgaremek projekt bemutatja, hogyan epitheto fel egy modern, valos problemat megcelzo webes rendszer a teljes fejlesztesi lanc menten: adatmodell, backend logika, frontend UX, jogosultsagkezeles es uzemeltethetoseg.

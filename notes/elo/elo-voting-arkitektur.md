# ELO-voting — hvordan det fungerer
>**KOMMENTAR**: Dette er mega-claude, men bare se hvor flink den er til å direkte-oversette fra engelsk :)

Dette dokumentet forklarer ELO-voting-funksjonen fra ende til ende: hvilke filer som
inneholder hvilke funksjoner, hvordan frontend og backend snakker sammen, og hvorfor
systemet er delt opp slik det er.

For selve ELO-matematikken, se [elo-notater.md](./elo-notater.md). Dette dokumentet
handler om *rørleggingen* rundt den.

## Overordnet idé

Brukeren får se to sanger og klikker på den de liker best. Dette klikket:

1. Registrerer resultatet og oppdaterer ELO-ratingen til begge sanger i databasen.
2. Henter et nytt par sanger.
3. Bytter inn de nye sangene på siden uten full reload.

Astro lager statisk HTML som standard, så den eneste måten å oppdatere siden etter et
klikk uten reload er å kjøre JavaScript i nettleseren som kaller serveren og endrer
DOM-en. Den nettleser-JS-en er "frontend"; server-endepunktene den kaller er
"backend".

## Filer og deres ansvar

| Fil | Lag | Ansvar |
| --- | --- | --- |
| [db/config.ts](../../../db/config.ts) | DB-skjema | Definerer tabellene `Songs` og `Matches`. |
| [db/seed.ts](../../../db/seed.ts) | DB-seed | Setter inn de første sangene med start-ELO og historikk. |
| [src/lib/songs.ts](../../lib/songs.ts) | Backend-logikk | `getRandomLowMatchSong()` — velger en sang som skal vises. Ren datalogikk, ingen UI. |
| [src/pages/api/random-pair.ts](../api/random-pair.ts) | Backend (API-rute) | `GET /api/random-pair` — returnerer to sanger som JSON. |
| [src/pages/api/vote.ts](../api/vote.ts) | Backend (API-rute) | `POST /api/vote` — oppdaterer ELO, historikk, og registrerer kampen. |
| [src/pages/elo/index.astro](./index.astro) | Frontend (side) | Laster det *første* paret på server-siden og rendrer komponenten. |
| [src/pages/elo/components/EloVoting.astro](./components/EloVoting.astro) | Frontend (markup + nettleser-JS) | Rendrer de to kolonnene og håndterer klikk. |

## Hvorfor denne oppdelingen?

- **`src/lib/` inneholder logikk, ikke markup.** `getRandomLowMatchSong()` er ren
  utvelgingslogikk, så den kan gjenbrukes både av den første server-renderingen
  (`index.astro`) og av API-ruten (`random-pair.ts`) uten duplisering.
- **API-rutene er broen.** Nettleser-JS kan ikke røre databasen direkte — den kan
  bare gjøre HTTP-forespørsler. Filene i `src/pages/api/` er server-side endepunkter
  som *kan* røre databasen, så de fungerer som den kontrollerte døra mellom nettleser
  og DB.
- **Siden rendrer det første paret; API-et serverer alle par etterpå.**
  `index.astro` kjører allerede på serveren, så den kaller `getRandomLowMatchSong()`
  direkte — ingen HTTP-rundtur trengs for den første visningen. Hvert *påfølgende*
  par kommer fra `/api/random-pair`, fordi vi da er i nettleseren.

## Funksjonene

### `getRandomLowMatchSong(numDistinctValues, excludeSongID?)` — `src/lib/songs.ts`

Velger én sang som skal vises. For å holde matchene rettferdige favoriserer den
sanger som har blitt vist færrest ganger: den finner de `numDistinctValues` laveste
distinkte `numMatches`-verdiene og velger tilfeldig en sang på eller under den
terskelen.

- `excludeSongID` er valgfri — send med ID-en til den første sangen når du velger den
  andre, slik at en sang ikke kan spille mot seg selv.
- Returnerer `null` kun hvis det ikke finnes noen kvalifiserte sanger i det hele tatt.

### `GET /api/random-pair` — `src/pages/api/random-pair.ts`

Kaller `getRandomLowMatchSong()` to ganger (det andre kallet ekskluderer den første
sangen) og returnerer `{ song1, song2 }` som JSON. Returnerer HTTP 500 hvis det ikke
finnes nok sanger.

### `POST /api/vote` — `src/pages/api/vote.ts`

Mottar `{ winnerId, loserId }`. Deretter:

1. Laster begge sangene fra DB-en.
2. `calcNewElos(winnerElo, loserElo)` beregner de nye ratingene med konstantene `K`
   (maks endring per kamp) og `f` (skaleringsfaktor). Vinneren har alltid `S = 1` og
   taperen `S = 0`, siden brukeren valgte vinneren.
3. Oppdaterer hver sangs `elo`, øker `numMatches`, og legger den nye ratingen til den
   kommaseparerte `eloHistory`-strengen.
4. Setter inn en rad i `Matches` som registrerer hvem som spilte og hvem som vant.

Returnerer `{ ok: true }`, eller HTTP 404 hvis en sang-ID ikke finnes.

### Nettleser-script — `src/pages/elo/components/EloVoting.astro`

Kjører i nettleseren. Ved last henter den referanser til de to kolonnene, de to
knappene, og feil-elementet. Hvert knappeklikk kaller `vote(winnerId, loserId)`, og
leser ID-ene fra knappenes `data-song-id`-attributter.

`vote()`:

1. Deaktiverer begge knappene og fjerner eventuell feil (hindrer dobbeltstemming).
2. `POST`-er til `/api/vote`. Kaster feil hvis responsen ikke er OK.
3. `GET`-er `/api/random-pair`. Kaster feil hvis responsen ikke er OK.
4. Kaller `updateColumn()` for hver kolonne for å bytte inn den nye sangens cover,
   navn, artist og `data-song-id`.
5. Ved en hvilken som helst feil vises en melding og den logges; `finally` aktiverer
   knappene igjen slik at UI-et aldri låser seg.

`updateColumn(col, btn, song)` skriver én sangs data inn i DOM-elementene til én
kolonne.

## Kommunikasjonsflyt

```
                    Første last
  ┌──────────────┐  kaller direkte   ┌────────────────────┐
  │ index.astro  ├──────────────────►│ getRandomLowMatch- │
  │ (server)     │◄──────────────────┤ Song()  (src/lib)  │
  └──────┬───────┘   song1, song2    └─────────┬──────────┘
         │ rendrer                              │ leser
         ▼                                      ▼
  ┌──────────────┐                       ┌────────────┐
  │ EloVoting    │                       │  Database  │
  │ (nettleser)  │                       │  (astro:db)│
  └──────┬───────┘                       └────────────┘
         │                                      ▲
         │ bruker klikker "Stem"                │
         │                                      │ oppdaterer / leser
         │  POST /api/vote {winnerId, loserId}  │
         ├─────────────────────────────────────┤
         │  GET  /api/random-pair               │
         │◄──────────────────────────  { song1, song2 }
         │
         ▼ updateColumn() bytter DOM, ingen reload
```

## Datamodell — oppsummering

- **`Songs`** — én rad per sang: `songID`, `artistName`, `songName`, `elo`,
  `numMatches`, `qualified`, `albumCoverLink`, og `eloHistory` (kommaseparert
  rating-historikk, f.eks. `"1000,1016,1008"`).
- **`Matches`** — én rad per stemme: `matchID`, `songID1`, `songID2`,
  `songIDwinner`. Dette er den permanente loggen over hver stemme, atskilt fra den
  per-sang `eloHistory`-strengen.

De to lagringene overlapper med vilje: `Matches` er den relasjonelle kilden til
sannhet for *hva som skjedde*, mens `eloHistory` er en denormalisert, klar-til-å-
plotte rating-tidslinje for hver sang.

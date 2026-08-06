# Documentation nation
[Astro dokumentasjon](https://docs.astro.build/en/)

## Routing
Legg path til mappen til siden du vil nå og putt inn i en `<link href="din/path">` eller `<a href="din/path">`

## Ny side
lag en mappe, linken følger mappestrukturen, for eksempel:
```/pages/blog/stian/```
url vil her være `sauogfjell.no/blog/stian`

pathen vil da prøve å lese index.astro filen, så det er her du lager nettsiden din

### Tags
Dette er standardtags, men det er mulig å legge inn sine egne hvis man vil det
- Reisebrev
- Hverdag
- Akademisk
- Tøys
- Fylla



## CSS

### Klasser og IDer
Bruk `#`for id og `.` for klasse. 
Altså alle buttons skal ha en `.`button så de får riktig styling og sizing, mens footer kan ha `#`fordi det bare finnes en type footer

### Variabler
Må finne ut av dette for å kunne endre styling til floop-design

Når du lager noe som trenger css-styling, legg inn css i [`globals.css`](../src/styles/global.css) og link det til componenten med id `<div id="dababy-car">` eller klasse `<div class="dababy-car">`.

### Protips

#### Sentrere en div

Sørg for at parent (her `#parent`) tar opp all bredden (`width: 100%;`).

Gi child `display: flex;`for å la den justere ting som den vil, `justify-content: center;` for horisontal sentrering og `align-items: center;` for vertikal sentrering.



*Eksempel:*
```
#parent {
  width: 100%;
}

#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Content collection
Her har astro helt ass dokumentasjon.

Uansett er det kort sagt ganske greit:

### Config
I `src` skal du ha en fil som heter `content.config.ts`.  
Denne filen definerer egenskaper til greiene dine (tittel, draft, dato endret osv) og spesifiserer hvilken collection det ligger i basert på _noe_. For vår del er dette nebuløse _noe_ bare hvilken mappe det ligger i. `developer updates` ligger i mappen dev og havner da i collection dev også for eksempel.

### Hvordan lage content
Sørg for at det har alle props som er definert i collection. Dette gjøres på toppen i md filen med syntaks:  

```  
---  
title: dababy  
---  
```  

Deretter formaterer du markdown som du vanligvis ville gjort.

### Hvordan bruke i komponenter

Hvis du vil hente flere i en collection så må du gjøre sånn:   

```
---
import { getCollection, render } from 'astro:content';
const prop = Astro.props;
const posts = await getCollection('dev');
---
<div>
  { await Promise.all(
    posts.map(async (post) => { const {Content} = await render(post);
      return (
        <div>
          <Content />
        </div>
      );
    })
  )}
</div>
```

Her tar du og henter alle posts i 'dev' og rendrer dem i hver sin Content komponent.  
Her kan man også legge inn sortering og sånt om man vil.  
Dersom man bare vil hente en post så kommer det kanskje info på det senere.



## Database (Cloudflare D1)
> Dette er claude sitt verk

Dynamic data lives in a **Cloudflare D1** (SQLite) database, reached through the `DB` binding
declared in [wrangler.toml](wrangler.toml). The schema is managed as plain SQL migrations in
[migrations/](migrations/) — one numbered file per change (e.g. `0003_subscribers.sql`).

There are two separate databases:

- **local** — a SQLite simulation under `.wrangler/state/`, used by `npm run dev`. Nothing you do
  here touches production. Target it with the `--local` flag.
- **remote** — the real production database, targeted with `--remote`. It lives in the Cloudflare
  account that owns the deployment; you need access to that account to reach it (see *Gotchas*).

### Migrations

Writing a `migrations/*.sql` file does **not** run it — you have to apply it to each database.

```
# Apply all pending migrations
npx wrangler d1 migrations apply sauogfjell --local     # to the local dev DB
npx wrangler d1 migrations apply sauogfjell --remote    # to production (needs account access)

# Preview which migrations are still pending before applying
npx wrangler d1 migrations list sauogfjell --local
npx wrangler d1 migrations list sauogfjell --remote
```

Rule of thumb: apply a migration to **production before the code that uses it goes live**, or the
live site will error with "no such table".

### Inspecting the data

Run ad-hoc SQL to check what's stored:

```
npx wrangler d1 execute sauogfjell --local --command "SELECT * FROM Subscribers"
npx wrangler d1 execute sauogfjell --remote --command "SELECT * FROM Feedback"
```

Swap `--local` for `--remote` to query production (read-only queries are safe; be careful with
writes).

### Gotchas

- **`no such table: ...`** in local dev almost always means the migration hasn't been applied to the
  *local* DB. Run the `--local` apply command above. It is not a "can't reach production" error —
  local dev never contacts production.
- **`database ... could not be found [code: 7404]`** on a `--remote` command means the D1 database
  isn't in the Cloudflare account you're logged into (it belongs to whoever owns the deploy). Check
  who you are and what you can see:
  ```
  npx wrangler whoami      # which account is wrangler logged into
  npx wrangler d1 list     # D1 databases in that account
  ```
  If the database isn't listed, the account owner has to run the `--remote` migration, or add you to
  their Cloudflare account. Do **not** change `database_id` in wrangler.toml or run
  `wrangler d1 create` to "fix" it — that creates a separate database and forks the data.

### Content collections

Blog content is Astro content collections under `src/content/`. After changing a collection schema
in [src/content.config.ts](src/content.config.ts), regenerate the types:

```
npx astro sync
```
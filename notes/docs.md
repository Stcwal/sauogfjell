# Documentation nation
[Astro dokumentasjon](https://docs.astro.build/en/)

## Routing
Legg path til mappen til siden du vil nå og putt inn i en `<link href="din/path">` eller `<a href="din/path">`

## Ny side
lag en mappe, linken følger mappestrukturen, for eksempel:
```/pages/blog/stian/```
url vil her være `sauogfjell.no/blog/stian`

pathen vil da prøve å lese index.astro filen, så det er her du lager nettsiden din

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
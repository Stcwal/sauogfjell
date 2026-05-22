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
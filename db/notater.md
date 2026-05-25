Guide for hvordan lage tabeller: (og kanskje litt queries)
https://docs.astro.build/en/guides/astro-db/

# ELO-rating
## Elo-beregning


## Sang-elo-rating
Songs(<u>songID</u>, <u>artistID</u>, songName,  elo, numMatches)
- artistID er fremmednøkkel mot Artists

Artists(<u>artistID</u>, artistName)


Matches(<u>matchID</u>, <u>songID1</u>, <u>songID2</u>, <u>songIDwinner</u>)
- songID1 er fremmednøkkel mot Songs. Indikerer første deltaker
- songID2 er fremmednøkkel mot Songs. Indikerer andre deltaker
- songIDwinner er fremmednøkkel mot Songs. Indikerer vinner



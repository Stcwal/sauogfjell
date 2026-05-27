Guide for hvordan lage tabeller: (og kanskje litt queries)
https://docs.astro.build/en/guides/astro-db/

# ELO-rating
## Elo-beregning


## Sang-elo-rating
Songs(<u>songID</u>, artistName, songName,  elo, numMatches, albumCoverLink)


Matches(<u>matchID</u>, <u>songID1</u>, <u>songID2</u>, <u>songIDwinner</u>)
- songID1 er fremmednøkkel mot Songs. Indikerer første deltaker
- songID2 er fremmednøkkel mot Songs. Indikerer andre deltaker
- songIDwinner er fremmednøkkel mot Songs. Indikerer vinner



Guide for hvordan lage tabeller: (og kanskje litt queries)
https://docs.astro.build/en/guides/astro-db/

# ELO-rating
## Elo-beregning
https://en.wikipedia.org/wiki/Elo_rating_system#Theory

**Definisjon av variabler**
$$\begin{aligned}
	R_A:&\quad\text{Rating for spiller }A \\
	R_B:&\quad\text{Rating for spiller }B \\
	E_A:&\quad\text{Forventet score for spiller } A \\
	E_B:&\quad\text{Forventet score for spiller } B \\
	S_A:&\quad\text{Poeng fra match for spiller }A \\
	S_B:&\quad\text{Poeng fra match for spiller }B \\
	f:&\quad\text{skaleringsfaktor} \\
	K:&\quad\text{K-faktor. Maks endring av elo per match} \\
\end{aligned}$$

**Formler for $E_A$ og $E_B$**
$$\begin{aligned}
	E_A
		&=\frac{1}{1+10^{(R_B-R_A)/f}} \\
	E_B
		&=\frac{1}{1+10^{(R_A-R_B)/f}} \\
\end{aligned}$$

**Oppdatert elo-rating $R_x'$ for spiller $x$**
$$\begin{aligned}
	R_A'
		&=R_A+ K\cdot(S_A-E_A) \\
	R_B'
		&=R_B+ K\cdot(S_B-E_B) \\
\end{aligned}$$

### Eksempel
$R_A=2000$
$R_B=1800$
$f=400$
$K=32$

Regner ut $E$
$$\begin{aligned}
	E_A 
		&=\frac{1}{1+10^{(1800-2000)/400}}=0.7597 \\
	E_B
		&=\frac{1}{1+10^{(2000-1800)/400}}=0.2403 \\
\end{aligned}$$

Si at spiller $A$ vinner, slik at $S_A=1$ og $S_B=0$
Regner ut ny elo-rating
$$\begin{aligned}
	R_A'
		&=2000+32\cdot(1-0.7597)=2000 + 7.6896 \approx 2008 \\
	R_B'
		&=1800+32\cdot(0-0.2403)=1800-7.6896\approx1792
\end{aligned}$$



## Elo-rating sanger relasjonsdatabase
Songs(<u>songID</u>, artistName, songName,  elo, numMatches, albumCoverLink)


Matches(<u>matchID</u>, <u>songID1</u>, <u>songID2</u>, <u>songIDwinner</u>)
- songID1 er fremmednøkkel mot Songs. Indikerer første deltaker
- songID2 er fremmednøkkel mot Songs. Indikerer andre deltaker
- songIDwinner er fremmednøkkel mot Songs. Indikerer vinner



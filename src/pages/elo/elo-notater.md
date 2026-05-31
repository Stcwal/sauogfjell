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

$f$ sier noe om hvor viktig forskjellen i rating er. Stor $f$ gjør at $E$ nærmer seg $0.5$ for begge spillere, som gjør at vinneren får omtrent like stor endring i elo hver gang. Lav $f$ gjør at spillere med høy rating som taper mot spillere med lav rating taper veldig mange ratingpoeng. 

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

### Maksimal ELO
Skal undersøke hva som skjer med elo for spiller $A$ $R_A$ når denne vinner alle sine kamper. Siden $R_A$ skal være høyeste elo, blir elo for spiller $B$ $R_B=R_A-1$

For én kamp får vi da
$$\begin{aligned}
	E_A
		&=\frac{1}{1+10^{(R_B-R_A)/f}} \\
		&=\frac{1}{1+10^{(R_A-1-R_A)/f}} \\
		&=\frac{1}{1+10^{-1/f}}
\end{aligned}$$
og videre, med $S_A=1$
$$\begin{aligned}
	R_A'
		&=R_A+ K\cdot(S_A-E_A) \\
		&=R_A+K\cdot\left(1-\frac{1}{1+10^{-1/f}}\right) \\
\end{aligned}$$
La $R_A^n$ være elo etter $n$ kamper.
$R_A^0=1000$ er første elo, $R_A^1$ er elo etter én kamp osv. 
Kan da uttrykke
$$\begin{aligned}
	R_A^n
		&=R_A^{n-1}+K\cdot\left(1-\frac{1}{1+10^{-1/f}}\right)\\
	\implies \Delta R_A=R_A^n-R_A^{n-1}
		&=K\cdot\left(1-\frac{1}{1+10^{-1/f}}\right)
\end{aligned}$$
Starter fra $n=0$
$$\begin{aligned}
	R_A^1 &=R_A^0+\Delta R_A \\
	R_A^2 &=R_A^1+\Delta R_A =\left(R_A^0+\Delta R_A\right)+\Delta R_A=R_A^0+2\Delta R_A\\
	R_A^3 &=R_A^2+\Delta R_A =\left(R_A^0+2\Delta R_A\right)+\Delta R_A=R_A^0+3\Delta R_A\\
	\vdots \\
	R_A^n &=R_A^0+n\Delta R_A
\end{aligned}$$
Dette kan bevises med induksjon, men det gidder jeg ikke o((⊙﹏⊙))o.

$$\begin{aligned}
	\Delta R_A 
		&>0 \\
	K\cdot\left(1-\frac{1}{1+10^{-1/f}}\right) 
		&> 0 \\
	1 
		&> \frac{1}{1+10^{-1/f}} \\
	1
		&<1+10^{-1/f} \\
	0
		&<10^{-1/f}
\end{aligned}$$
Som er sant for alle $f$, som betyr at $\Delta R_A$ alltid er positiv. Det betyr at $$\lim_{n\to\infty}R_A^n=\lim_{n\to\infty}R_A^0+n\Delta R_A=\infty$$
Elo-score er altså ubegrenset

## Elo-rating sanger relasjonsdatabase
Songs(<u>songID</u>, artistName, songName,  elo, numMatches, albumCoverLink)


Matches(<u>matchID</u>, <u>songID1</u>, <u>songID2</u>, <u>songIDwinner</u>)
- songID1 er fremmednøkkel mot Songs. Indikerer første deltaker
- songID2 er fremmednøkkel mot Songs. Indikerer andre deltaker
- songIDwinner er fremmednøkkel mot Songs. Indikerer vinner



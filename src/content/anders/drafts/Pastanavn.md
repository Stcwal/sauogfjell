---
title: Amerikansk påvirkning #Format Fikset datoer
author: Anders #Format Stian
draft: true #true/false
publishDate: 2026-08-12 #Format 2026-05-24
#editDate: #Format 2026-05-24, denne er optional
tags: [Akademisk] #Format [X, Y, Z], optional
---

# Amerikanske tilstander i pastahyllen

- Pasta spirals er et elendig navn
- Fusilli er først og fremst ikke en spiral
- Kanskje en heliks
- Tenk å glemme sin europeiske kulturarv på den måten. Bare kall det fusilli. Veldig amerikansk av dere
- Skruer i verste fall
- 

https://www.delallo.com/blog/pasta-shapes?srsltid=AfmBOopn5FIVzhkpHiv3Hv7GQA7b2ZQxxy30JL16DESLrnP2Hgo1ZpGT


Heliks i geogebra
Curve(sin(t), cos(t), t / s, t, 0, 10)
Curve(sin(t + 2π / 3), cos(t + 2π / 3), t / 2, t, 0, 10)
Curve(sin(t + 4π / 3), cos(t + 4π / 3), t / 2, t, 0, 10)
Denne kan gjøres med en liste også, sånn at det blir dynamisk hvor mange skruer


Spiral
Curve((θ; θ), θ, 0, 4π)
ekvivalent: Curve(cos(θ) θ, sin(θ) θ, θ, 0, 4π)

Curve((θ; θ + 2π / 3), θ, 0, 4π)
Curve((θ; θ + 4π / 3), θ, 0, 4π)

Faseskift:
ϕ=First(Sequence(0, 2π, 2π / n), n)
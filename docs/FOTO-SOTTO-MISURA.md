# Le fotografie sotto misura

Registrato il 20/08/2026, perché sia uno **scambio** e non un'indagine il giorno
in cui arrivassero file migliori.

## La decisione

Il titolare **non manda gli originali più grandi** e non glieli chiediamo più.
Si usa quello che ha mandato. Questo documento esiste perché quella scelta resti
scritta accanto ai file a cui si applica.

## Il metro

Il sito serve ogni fotografia a schermo intero e la richiesta più larga della
`srcset` è **2560px** (`FULL_BLEED_WIDTHS` in `src/lib/image.ts`). Sanity non
inventa i pixel che non ci sono: un file da 1200 di larghezza viene servito a
1200 dentro una superficie che ne chiederebbe 2560.

Da sapere, perché cambia il giudizio: **il dataset è già così.** Su 137
immagini, 24 sono 3024x4032 ma 17 sono 1200x1600 e **83 stanno sotto i 1920**.
Questi file non sono sotto lo standard della casa: sono sotto quello che
chiedono gli schermi grandi. Si vede sulla **prima** fotografia di una pagina,
che è a tutto schermo ed è anche l'immagine del link condiviso.

## L'elenco

| Capo | File | Pixel | Dove pesa |
|---|---|---|---|
| Abyssys | ABYSSYS(2).JPG | 1640x2360 | ritaglio su fondo chiaro, non apre la pagina |
| Abyssys | ABYSSYS(3).JPG | 1640x2360 | come sopra |
| Aleya | ALEYA.jpg | 1200x1600 | **apre la pagina** |
| Aleya | ALEYA(1).jpg | 1200x1600 | anche su Styrax nero: è lo stesso file |
| Aleya | ALEYA(2).jpg | 1200x1600 | |
| Aleya | ALEYA(3).jpg | 1200x1600 | |
| Glovyes | GLOVYES(1).WEBP | 1680x2240 | **apre la pagina** |
| Glovyes | GLOVYES(2).WEBP | 1536x2048 | |
| Tibia Cut | TIBIA.CUT.jpg | 1319x1773 | l'unica indossata, seconda in pagina |
| Tibia Cut | TIBIA.CUT(1).jpg | 1320x1766 | l'altra indossata |
| Tomar | TOMAR.WEBP | 1680x2240 | **apre la pagina** |
| Tomar | TOMAR(1).WEBP | 1680x2240 | |
| Tomar | TOMAR(2).WEBP | 1680x2240 | |
| Tomar | TOMAR.JPG | 1680x2240 | dettaglio |
| Tomar | TOMAR(1).JPG | 1680x2240 | dettaglio |
| Tomar | TOMAR.FIT.PNG | 1319x1630 | l'unica indossata |

**Tomar è il caso peggiore**: nessun suo fotogramma arriva a 1920, ed è un capo
nuovo, quindi non c'è niente di più grande da mettergli accanto.

## Non è una questione di pixel, ma va nello stesso elenco

| Capo | File | Pixel | Cosa c'è che non va |
|---|---|---|---|
| Arak | ARAK.HEIC | 3024x2834 | quasi quadrata: a schermo intero si taglia |
| Arak | ARAK(1).HEIC | 4032x3024 | orizzontale, unica in tutto il sito |

## Se un giorno arrivano i file veri

È uno scambio, non un reimport: si carica il file nuovo, si mette al posto di
quello vecchio nella lista `media` del capo, si tiene lo stesso testo
alternativo e si rimisura la polarità (`npm run shots -- --audit`). Il vecchio
asset resta in Sanity finché non lo si cancella a mano.

**Non si passa da `scripts/import-photos.mjs`**, che dal 20/08/2026 si rifiuta
di partire e spiega perché.

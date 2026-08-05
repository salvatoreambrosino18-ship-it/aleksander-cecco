# Guida allo studio

**Per Ferdinando e Ciro. Come cambiare il sito da soli, senza chiedere a nessuno.**

Questa guida non spiega come funziona il sito: spiega solo cosa devi fare tu.
Non serve sapere niente di programmazione. Se una cosa non è scritta qui, non
devi farla.

---

## Prima di tutto: due avvertimenti

### 1. Non far mai eseguire `npm run seed` né `npm run import`

Sono due comandi che stanno dentro al progetto. **Riscrivono i contenuti**:
il primo rimette tutto com'era all'inizio, il secondo ricarica le fotografie
dalla cartella di Drive e sovrascrive quello che hai scritto nello studio.

Non li lanceresti mai per sbaglio da solo, perché servono un computer e un
terminale. Ma se qualcuno che ti aiuta ti propone di lanciarli, **la risposta è
no**, finché non hai chiesto a chi ha costruito il sito. Il lavoro che hai fatto
nello studio non è recuperabile con un tasto.

### 2. Tutti i prezzi e diversi nomi sul sito sono inventati

Sono segnaposto scritti da noi per costruire le pagine, non valori tuoi. Sono
**invisibili a chi visita il sito**, ma sono contati e segnati nello studio, e il
sito non può essere lanciato finché ci sono.

Ogni volta che sostituisci un valore inventato con quello vero, devi anche
togliere la spunta corrispondente: come si fa è spiegato in fondo, in
[Togliere i segnalibri](#togliere-i-segnalibri-quello-che-sblocca-il-lancio).
È la cosa che più di ogni altra avvicina il sito al lancio.

---

## Come si entra

Lo studio è il pannello dove vivono i contenuti del sito: fotografie, nomi,
prezzi, testi.

> **DA COMPLETARE — l'indirizzo dello studio non esiste ancora.**
> Va creato una volta sola da chi ha costruito il sito (un comando solo,
> `sanity deploy`). Finché non è fatto, non c'è una pagina dove entrare.
> Quando esiste, l'indirizzo sarà di questa forma:
> `https://aleksander-cecco.sanity.studio`
>
> Scrivilo qui sopra quando ce l'hai, e mettilo nei preferiti del telefono.

Si entra con la mail. Lo studio funziona anche dal telefono: le liste sono state
pensate per essere leggibili su uno schermo piccolo.

## Cosa vedi quando entri

Una colonna con quattro voci:

```
Collezioni / Collections     i drop
Capi / Garments              le Creature, una per capo
Archivio / Archive           i pezzi passati
──────────────────────────
Impostazioni / Site settings  home, Instagram, i testi, i contatti
```

Ogni voce apre una lista; ogni riga della lista apre una scheda; ogni scheda ha
in basso un tasto **Publish**. Finché non premi Publish, quello che scrivi resta
una bozza che vedi solo tu.

Tutte le etichette dei campi sono scritte in due lingue, prima in italiano:
*Nome / Name*, *Prezzo / Price*, e così via. Nella guida uso la parte italiana.

---

## Pubblicare un nuovo drop e farlo diventare quello di apertura

Il sito ha una pagina, **NEW**, che mostra sempre il drop corrente. Il drop
corrente non è deciso da una data né da una spunta: **è semplicemente il primo
della lista Collezioni**. Questo significa che per cambiare drop non serve
toccare il sito: basta riordinare una lista.

1. Apri **Collezioni / Collections**.
2. In alto a destra, il tasto per creare un documento nuovo (**+**, oppure
   *Create*). Scegli *Collezione*.
3. Compila:
   - **Nome / Name** — come si chiama il drop.
   - **Slug (URL)** — si genera da solo dal nome. Premi *Generate* e lascialo
     stare.
   - **Stagione / Season** — se ha senso per te; se no, lascia vuoto.
   - **Testo / Statement** — le tue parole sul drop, in italiano e in inglese.
     Questo testo compare **per intero** sulla pagina NEW: è la pagina per cui
     è scritto. Altrove ne compare solo un pezzo.
   - **Copertina / Cover** — la fotografia grande in cima alla pagina NEW.
   - **Pubblicata / Published** — accendila.
4. **Publish**.
5. Torna alla lista **Collezioni** e **trascina il nuovo drop in cima**
   (la maniglia a sinistra di ogni riga: tieni premuto e sposta).

Il primo della lista è il drop su cui si apre NEW. Gli altri restano
raggiungibili dal fondo della pagina. Se ti penti, trascini indietro: si
inverte in un secondo.

Poi assegna i capi al drop nuovo (campo **Collezione** dentro ogni Creatura,
vedi sotto).

---

## Aggiungere una Creatura

Apri **Capi / Garments**, poi crea un documento nuovo. I campi, nell'ordine in
cui li trovi:

| Campo | Cosa metterci |
| --- | --- |
| **Nome / Name** | Il nome del capo. Compare sotto la fotografia nel catalogo. |
| **Slug (URL)** | Premi *Generate*. È l'indirizzo della pagina. |
| **Codice / Reference code** | Il codice interno, se lo usi. Compare in piccolo. |
| **Collezione / Collection** | A quale drop appartiene. |
| **Tenebrae o Lux** | La famiglia: nero lavato, pezzi chiari, o il rosso. Decide l'ordine in cui i capi si susseguono nel catalogo. |
| **Per chi / Who it is for** | Uomo, Donna, Entrambi. **Vedi sotto: lasciarlo vuoto è una risposta valida.** |
| **Prezzo / Price (EUR)** | Solo il numero, senza € e senza punti: `1450`. |
| **Materiali / Materials** | La composizione, in italiano e in inglese. |
| **Misure di riferimento** | Le misure del capo come esiste. Non sono le misure del cliente. |
| **Descrizione / Description** | Le tue parole sul capo. |
| **Galleria / Gallery** | Le fotografie. **L'ordine conta, vedi sotto.** |
| **Come si ottiene** | Disponibile, su ordinazione, pezzo unico, venduto. **Vedi la sezione dedicata.** |

### Le fotografie, e perché l'ordine conta

Dentro **Galleria** aggiungi le immagini una per una. Per ognuna:

- **Immagine / Image** — il file. Trascinalo, o scegli dal telefono.
- **Testo alternativo / Alt text** — una riga che descrive cosa si vede, per chi
  non può vedere la fotografia. **Serve sempre.** Scrivi quello che diresti al
  telefono a qualcuno: «giacca in pelle nera appesa a un muro di calce».
- **Testo sopra / Text over this media** — dice se le scritte sopra la
  fotografia devono essere bianche o nere. Guarda la foto: se è scura scegli il
  bianco, se è chiara scegli il nero. Se sbagli, il nome del capo diventa
  illeggibile su quella foto e basta tornare qui e invertire.

L'ordine delle fotografie decide due cose:

1. **La prima** è quella che si vede nel catalogo e in cima alla pagina del capo.
2. **La seconda** è quella che appare quando il mouse passa sopra la fotografia,
   sul computer. Metti in seconda posizione la foto che racconta meglio l'altro
   lato del capo: un dettaglio, il retro, il capo addosso.

Le altre seguono in pagina nell'ordine in cui le metti. Si trascinano come le
collezioni.

### «Per chi»: è solo un filtro

Nel catalogo c'è una riga in alto con **TUTTI / UOMO / DONNA**. Quel campo serve
solo a quello. Non crea sezioni, non crea pagine separate, non divide il sito in
due: cambia solo cosa resta a schermo quando qualcuno tocca il filtro.

**Se non hai deciso, lascialo vuoto.** Un capo senza questo campo compare sotto
ogni filtro, che è il comportamento onesto: nessuno ha detto che è da uomo o da
donna, quindi lo vedono tutti. Oggi undici capi su diciassette sono vuoti, ed è
voluto: nessuno ha indovinato al posto tuo.

---

## Segnare un capo venduto, o disponibile

È un campo solo: **Come si ottiene / How it can be had**, dentro la scheda del
capo. Sono cinque possibilità e cambiano dove il capo finisce nel catalogo.

| Se scegli | Il capo finisce | Si può ordinare? |
| --- | --- | --- |
| **Disponibile subito** | in alto, sotto *Disponibili* | sì |
| **Su ordinazione** | in alto, sotto *Disponibili* | sì, con le misure |
| **Pezzo unico, 1 di 1** | nella sezione di mezzo, *1 di 1* | sì, ma **solo così com'è** |
| **Non disponibile ora** | in fondo, sotto *Esauriti* | no |
| **Ordine privato** | in fondo, sotto *Esauriti* | no |

**Per dire "venduto" usa *Non disponibile ora*.** Il capo scende in fondo alla
pagina, sotto il titolo *Esauriti*, resta visibile con le sue fotografie, al
posto del prezzo mostra la parola **Esaurito** e non si può più ordinare. È l'unica cosa da fare: non cancellare il capo. Un capo
cancellato porta via anche la sua pagina, e chi ha quel link in un messaggio
trova il vuoto.

Per rimetterlo in vendita, rimetti *Disponibile subito* o *Su ordinazione*.

**Riga aggiuntiva / Extra line** serve se vuoi dire una cosa in più accanto alla
disponibilità («ne resta uno», «pronto in due settimane»).

### Cosa vuol dire «Pezzo unico, 1 di 1»

Sono le commissioni private: fatte una volta sola, sulle misure di una persona.
Il sito le tratta di conseguenza, da solo:

- il modulo d'ordine **non chiede le misure** e non offre di rifarlo;
- l'unica scelta è prenderlo com'è;
- il testo dice cos'è il pezzo, non promette di poterlo ripetere.

Non devi fare niente oltre a scegliere quella voce.

---

## Cambiare la fotografia di apertura della home

**Impostazioni / Site settings** → **Fotografia di apertura / Opening
photograph**.

Sostituisci l'immagine, e controlla **Testo sopra / Text over this media**: su
questa fotografia ci vanno sopra le tue due righe di apertura, quindi se la foto
nuova è più chiara di quella vecchia vanno messe nere.

È la prima cosa che vede chiunque arrivi. Vale la pena guardarla sul telefono
dopo averla cambiata: il taglio verticale è diverso da quello che vedi qui.

---

## Cambiare le quattro fotografie di Instagram

**Impostazioni** → **Instagram: le fotografie / Instagram: the frames**.

Sono quattro, scelte da te, e sono normali immagini caricate qui: **non sono
collegate al tuo profilo**, quindi non cambiano da sole quando pubblichi un post.
È voluto — così nessuno decide al posto tuo cosa appare sul sito — ma vuol dire
che quando vuoi aggiornarle devi passare di qui.

Sostituisci le immagini, tieni le migliori quattro, e metti l'**alt text** anche
qui. Il blocco porta al tuo profilo; il link sta in **Instagram**, in cima alle
Impostazioni.

---

## Modificare i tuoi testi

I testi tuoi stanno in due posti.

**Nelle Impostazioni:**

- **Chi siamo, in breve (home)** — le righe in home.
- **Chi siamo / About** — la storia lunga, quella della pagina About.
- **Chi siamo: la riga di apertura** — la frase grande in cima ad About.
- **La lavorazione, il testo** — le tue parole sul processo.
- **Chi lo fa / The creators** — i vostri nomi. Se un giorno siete in tre, si
  aggiunge una riga qui e basta.
- **In collaborazione con** e **Link del partner** — Ferdressed e il suo sito.

**Dentro ogni drop:** il **Testo / Statement** della collezione.

Ogni testo ha due caselle, **it** e **en**. Scrivi in italiano quello che pensi;
l'inglese, se non te la senti, chiedi di farlo tradurre invece di lasciarlo
vuoto: una pagina inglese con un buco è peggio di una traduzione da rivedere.

Le tue parole non vengono mai riscritte da noi. Quello che trovi già scritto e
non è tuo è segnato, e si toglie così:

### Togliere i segnalibri (quello che sblocca il lancio)

Ci sono due liste di spunte che tengono il conto di quello che abbiamo inventato
noi.

**Per un capo:** dentro la scheda, in fondo, **Campi inventati, da sostituire /
Invented fields**. Se c'è la spunta su `price` e tu hai appena messo il prezzo
vero, **togli la spunta su `price`**. Stesso discorso per `name`, `materials`,
`measurements`, `description`, `wornBy`.

**Per il sito:** in Impostazioni, **Testi scritti da noi, da approvare /
Copy we wrote**. Quando riscrivi (o approvi così com'è) uno di quei testi, togli
la voce dalla lista.

Ogni spunta tolta è un blocco in meno prima del lancio. Oggi ne restano **30**.
Nessuna di queste spunte si vede sul sito: servono solo a non lanciare per
sbaglio un sito che dice cose che non hai detto tu.

---

## Cosa succede quando premi Publish

Il sito non legge lo studio in diretta: ogni volta che pubblichi, il sito viene
**ricostruito** e poi sostituito. Serve a farlo restare velocissimo e a non
dipendere da nessun server.

In pratica:

1. Premi **Publish**.
2. Parte una ricostruzione automatica.
3. Dopo **circa un minuto e mezzo** il sito è aggiornato su
   https://aleksander-cecco.pages.dev

A volte ci mette di più: sette, otto minuti. Non è un errore, ed è normale che
tu debba ricaricare la pagina per vedere la differenza (sul telefono, tira giù
la pagina per ricaricarla; sul computer, `Cmd + Shift + R`).

---

## Quando il sito non cambia

Capita, ed è una cosa nota: **il piano gratuito costruisce un sito alla volta**.
Se pubblichi due cose ravvicinate, la seconda richiesta può arrivare mentre la
prima ricostruzione è ancora in corso e venire semplicemente buttata via invece
di mettersi in coda. Il contenuto è salvo — è nello studio, l'hai pubblicato —
è la ricostruzione che non è partita.

Cosa fare, in ordine:

1. **Aspetta dieci minuti** e ricarica forzando l'aggiornamento. La maggior
   parte delle volte finisce qui.
2. **Ripubblica.** Apri la scheda, cambia qualcosa di minuscolo (aggiungi uno
   spazio e toglilo), premi di nuovo **Publish**. È una richiesta nuova, e
   stavolta probabilmente non trova nessuna ricostruzione in corso.
3. **Fai forzare la ricostruzione.** C'è un modo che non ha mai fallito, ma non
   passa dallo studio: è un'operazione sul pannello di Cloudflare, dove il sito
   è ospitato (il progetto → l'elenco delle pubblicazioni → il tasto che rilancia
   l'ultima). Se hai l'accesso, è un clic. Se non ce l'hai, è questo il momento
   di scrivere a chi ti segue il sito: è un minuto di lavoro.

**Quello che non devi fare** è ripubblicare dieci volte di seguito: ogni
tentativo occupa la coda e rende meno probabile che passi quello dopo.

Se dopo tutto questo il sito continua a mostrare la versione vecchia, scrivi e
dì **cosa hai cambiato e a che ora**: da quelle due informazioni si capisce in
pochi minuti se la richiesta è partita e non è arrivata, o se non è mai partita.

---

## Le poche cose da non toccare

- **Lo Slug di un capo o di un drop già pubblicato.** È il suo indirizzo: se lo
  cambi, tutti i link a quella pagina — quelli nei messaggi, quelli nelle storie
  — portano al vuoto. Il nome visibile si può cambiare quando vuoi; lo slug no.
- **Il campo Valuta.** È EUR e basta.
- **Non cancellare un capo per dire che è venduto.** Usa *Non disponibile ora*.
- **Le impostazioni che non sono in questa guida.** Se una casella non è scritta
  qui, non ha bisogno di te.

---

## Se qualcosa va storto

Nello studio quasi niente è irreversibile: ogni documento tiene la sua storia
(**History**, in alto nella scheda) e si può tornare a una versione precedente.
Le fotografie caricate non si perdono.

L'unica cosa che non si recupera è il contenuto riscritto dai due comandi
dell'avvertimento in cima. Per tutto il resto: prova, guarda il sito, e se non
ti piace torna indietro.

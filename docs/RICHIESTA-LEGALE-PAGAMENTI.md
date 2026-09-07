# Richiesta di riemissione — pagamento con carta sul sito

**Per:** il legale di Cecco Trading SRLS
**Da:** Cecco Trading SRLS
**Data:** 7 settembre 2026
**Riguarda:** Condizioni generali di vendita v1.1 del 18/08/2026, e Informativa privacy aggiornata al 17/08/2026

---

## In una riga

La società ha ottenuto la partita IVA e vuole incassare con carta direttamente
sul sito. I testi in vigore dicono che il pagamento si concorda per e-mail dopo
l'ordine, e lo dicono come **meccanismo**, non come preferenza. Servono quindi
**quattro articoli riemessi** e **tre punti dell'informativa aggiornati**, prima
che il pulsante venga acceso.

**Il codice del pagamento è già scritto e già in produzione, ma è spento.** Non
può incassare finché non vengono inserite due variabili nel pannello di
Cloudflare, e non verranno inserite finché i testi riemessi non saranno
pubblicati sul sito. Non c'è quindi nessuna fretta operativa e nessun rischio
che il sito incassi prima del tempo: la sequenza è nelle vostre mani.

---

## 1. Cosa cambia di fatto sul sito

Perché il giudizio sia dato su ciò che accade davvero, e non su una descrizione.

**Cosa cambia:**

- Nel carrello compare un secondo pulsante accanto a quello che oggi invia
  l'ordine. Chi lo preme viene portato **su un dominio di Stripe** (`stripe.com`),
  paga lì, e torna sul sito su una pagina di ringraziamento.
- Il pagamento avviene quindi **prima** che il venditore risponda, non dopo.
- Al momento del pagamento il cliente vede il totale, la destinazione e la
  spedizione, che è gratuita e indicata come tale.
- Il cliente riceve una ricevuta automatica da Stripe; il venditore riceve una
  notifica con il pezzo, la taglia e l'importo.

**Cosa NON cambia, e sono scelte prese apposta:**

- **Nessuno script di Stripe viene caricato sulle pagine del sito.** Il pagamento
  è ospitato da Stripe su un suo dominio ed è raggiunto con un rimando. Di
  conseguenza il sito **continua a non installare alcun cookie** e non introduce
  alcun banner. Se preferite la soluzione con i campi di pagamento incorporati
  nella pagina, cambia tutto questo: ditelo e lo rifacciamo, ma volevamo che la
  scelta fosse vostra e non nostra.
- **Il venditore continua a non raccogliere dati di carte attraverso il sito.**
  I numeri di carta sono digitati su Stripe. La frase dell'art. 6 che lo dice
  resta quindi vera alla lettera, ed è per questo che di quell'articolo si
  chiede la riemissione ma non l'eliminazione integrale.
- **Nessun prezzo del sito cambia.** Il titolare ha confermato che le cifre
  esposte sono quelle che il cliente paga, **IVA compresa**. Il sistema è
  configurato di conseguenza (imposta già inclusa nel prezzo esposto).
- **Il canale e-mail resta e resta primario.** Ogni pezzo mantiene il suo modulo
  d'ordine e il carrello mantiene il pulsante di invio. Chi non vuole pagare con
  carta ordina esattamente come oggi.
- **I due pezzi unici NON sono acquistabili con il pulsante.** Vedi §5.

---

## 2. Condizioni generali di vendita v1.1 — i quattro articoli

Qui sotto il testo **integrale e verbatim** in vigore, italiano e inglese, così
che possiate emendare invece di cercare. Sotto ciascuno, cosa lo rende
incompatibile e cosa serve.

---

### Art. 3 — Invio dell'ordine

> **IT (in vigore):** «Il cliente può inviare una richiesta tramite il modulo del
> singolo prodotto o tramite il carrello. L'invio costituisce una richiesta di
> acquisto e non comporta automaticamente l'accettazione dell'ordine né
> l'incasso del prezzo.»

> **EN (in vigore):** "Customers may submit a request through an individual
> product form or through the cart. Submission constitutes a purchase request and
> does not automatically constitute acceptance or payment."

**Perché non regge.** «né l'incasso del prezzo» / "or payment" diventa falso sul
percorso con carta: lì l'invio **è** l'incasso.

**Cosa serve.** Un articolo che distingua i due percorsi che il sito offrirà
davvero: la richiesta d'acquisto senza pagamento (invariata) e l'ordine con
pagamento immediato.

---

### Art. 4 — Conferma e conclusione del contratto

> **IT (in vigore):** «Il venditore verifica la richiesta e comunica al cliente,
> tramite e-mail, disponibilità, prezzo applicabile, costi di spedizione,
> modalità di pagamento, tempi di consegna e ogni altro elemento necessario. Il
> contratto si conclude quando il venditore comunica l'accettazione dell'ordine
> al cliente su un supporto durevole, salvo diverso accordo.»

> **EN (in vigore):** "The Seller reviews the request and communicates by email
> the applicable availability, price, shipping charges, payment method, delivery
> timing and other information required. The contract is concluded when the
> Seller communicates acceptance to the customer on a durable medium, unless
> otherwise agreed."

**Perché non regge, ed è l'articolo che ci preoccupa di più.** Definisce **il
momento in cui il contratto si conclude** e lo colloca nell'accettazione via
e-mail del venditore. Con il pagamento sul sito, il cliente ha già pagato quando
quel momento, secondo questo testo, non è ancora arrivato. Non vogliamo trovarci
a trattenere il denaro di un consumatore fuori da un contratto concluso, secondo
le nostre stesse condizioni pubblicate.

**Cosa serve.** La regola di conclusione per il percorso con pagamento
immediato, e l'indicazione di quale comunicazione costituisca la conferma su
supporto durevole in quel caso (la ricevuta automatica di Stripe? una nostra
e-mail successiva? entrambe?). **Diteci voi quale documento vale**, perché da
questo dipende cosa il sistema deve inviare, e lo configureremo di conseguenza.

---

### Art. 5 — Prezzi

> **IT (in vigore):** «I prezzi dei prodotti sono quelli indicati sul sito al
> momento dell'ordine, salvo errori manifesti. Prima della conclusione del
> contratto saranno comunicati eventuali costi di spedizione, tasse o altri
> oneri applicabili.»

> **EN (in vigore):** "Product prices are those displayed on the website at the
> time of the order, except in cases of manifest error. Any applicable shipping
> charges, taxes or other charges will be communicated before the contract is
> concluded."

**Perché non regge del tutto.** La frase è formulata per una comunicazione
successiva via e-mail. Nel percorso con carta i costi sono **mostrati nella
pagina di pagamento**, prima del clic finale.

**Da confermare.** Che i prezzi esposti sono comprensivi di IVA, che è la
situazione di fatto dal 7/09/2026 e che riteniamo debba essere detta
esplicitamente ora che la società ha una partita IVA.

---

### Art. 6 — Pagamento

> **IT (in vigore):** «Il sito non dispone di un sistema di pagamento integrato.
> Le modalità e i termini di pagamento sono comunicati nella conferma
> dell'ordine. Il venditore non raccoglie dati di carte di pagamento attraverso
> il sito.»

> **EN (in vigore):** "The website does not currently provide an integrated
> payment system. Payment method and timing are communicated in the order
> confirmation. The Seller does not collect payment-card details through the
> website."

**Perché non regge.** La prima frase diventa un'affermazione falsa in un
documento che il cliente legge come vincolante. **La terza frase invece resta
vera** e vorremmo conservarla: i dati di carta sono inseriti su Stripe e non
transitano dal sito.

**Cosa serve.** L'indicazione del prestatore di servizi di pagamento (**Stripe
Payments Europe, Ltd.**, Irlanda), i mezzi accettati, e il momento
dell'addebito.

---

## 3. Informativa privacy — tre punti

Non ha numero di versione ma una data di ultimo aggiornamento (17/08/2026).

**§2 — Quali dati trattiamo.** In vigore: «Non esiste un account cliente e il
sito non raccoglie numeri di carta, credenziali bancarie o altri dati di
pagamento.» / "There is no customer account and the website does not collect
card numbers, banking credentials or other payment details." **Resta vera alla
lettera**, ma va detto che i dati di pagamento sono raccolti da Stripe sul suo
dominio, e che il venditore riceve da Stripe i dati dell'operazione (importo,
esito, indirizzo di spedizione, ultime cifre della carta).

**§6 — Destinatari e responsabili del trattamento.** In vigore: «...tra cui
Cloudflare per infrastruttura e servizi di rete, Resend per la trasmissione
delle e-mail, Google per il servizio di posta elettronica utilizzato dal
Titolare e Sanity per la distribuzione di contenuti multimediali.» **Va aggiunta
Stripe.** Segnaliamo che a nostra conoscenza Stripe agisce in parte come
titolare autonomo per gli obblighi antiriciclaggio e antifrode, e non solo come
responsabile: la qualificazione la fate voi, noi trascriviamo.

**§7 — Trasferimenti internazionali.** Da verificare se l'aggiunta di Stripe
richieda un'integrazione, coerentemente con quanto già indicato per gli altri
fornitori.

**§11 — Newsletter (già in attesa, indipendente da Stripe).** L'articolo descrive
un campo newsletter che **dal 18/08/2026 non esiste più sul sito**: è stato
rimosso in ogni sua parte. Poiché l'informativa viene comunque riaperta,
chiediamo di correggerlo nello stesso passaggio invece di emettere due versioni a
due settimane di distanza.

**Conservazione (§8).** Va valutato se i dati dell'operazione conservati da
Stripe richiedano un'indicazione propria accanto ai dieci anni già previsti per
la documentazione commerciale.

---

## 4. La dicitura del pulsante — domanda diretta

L'art. 51 comma 2 del Codice del consumo chiede che il pulsante che fa sorgere
l'obbligo di pagamento rechi una dicitura inequivocabile.

**Oggi il sito non ha un pulsante di pagamento, quindi la norma non si applica.
Con Stripe si applicherà.**

Nel codice abbiamo messo, in attesa della vostra parola:

- **IT:** «Ordina con obbligo di pagare»
- **EN:** "Order with obligation to pay"

**Confermate o sostituite.** Non è una scelta editoriale del marchio: la stringa
è deliberatamente esclusa dai testi che il titolare può modificare da solo dal
pannello, proprio perché non sia riscritta un pomeriggio.

---

## 5. Cosa NON vi chiediamo di rifare, e perché

**I quattro diritti sull'export CITES restano come li avete scritti.** Nella
risposta del 23/08/2026 avete indicato quattro diritti da inserire nelle
condizioni di vendita: verificare preventivamente l'esportabilità, prendere il
tempo per le autorizzazioni, sospendere o ritardare la spedizione, annullare e
rimborsare se la spedizione non può avvenire legalmente. **Non vanno riscritti
per il pagamento con carta**, e la ragione è una decisione presa dal titolare il
7/09/2026:

> **Severya, l'unico capo in pelle di pitone del sito, non sarà acquistabile con
> il pulsante.** Resta ordinabile solo per e-mail, come oggi.

Quindi nessun pagamento con carta potrà mai riguardare un capo soggetto a
formalità CITES, e i quattro diritti continuano a operare nel contesto per cui
li avete redatti, cioè una richiesta a cui il venditore risponde prima che il
denaro si muova. Se non condividete questa lettura, ditelo: è il punto su cui
abbiamo consapevolmente ristretto il progetto per non toccare il vostro testo.

**Il motivo per cui Severya è esclusa non è però solo CITES.** Il titolare ha
stabilito che i pezzi che può rifare restano rifabbricabili, e due ordini
contemporanei sono semplicemente due ordini. I due pezzi marcati «ne esiste uno
solo» — **Severya** e **Styrax Red Goat** — non sono rifabbricabili, e un oggetto
irripetibile non deve poter essere venduto da un pulsante alle tre di notte
senza che nessuno risponda. Entrambi restano sul modello e-mail.

Gli altri undici capi in vendita sono tutti rifabbricabili e saranno pagabili
con carta.

---

## 6. La versione 1.1 non è firmata, e vorremmo chiudere la questione qui

Segnalazione che facciamo noi, perché risulta dai nostri stessi documenti.

`docs/TESTI-LEGALI.md` riporta le clausole della **versione 1.1 del 18/08/2026**
accanto a un **blocco di sottoscrizione datato 17/08/2026**. Le due date non
coincidono. Le quattro clausole che distinguono la 1.1 dalla versione precedente
— l'aggiunta del secondo indirizzo e-mail accanto alla PEC, in Condizioni §11 e
§18 e Resi §3 e §10 — sono state da voi **lette e confermate**, ma senza invio di
un documento sostitutivo firmato.

**Non esiste quindi un originale sottoscritto della 1.1**, cioè del testo che i
clienti hanno effettivamente visto sul sito dal 18/08/2026.

**Chiediamo che la riemissione sia una versione 1.2 completa e sottoscritta**,
che assorba anche le quattro clausole della 1.1. Così la società avrà, per la
prima volta, un originale firmato del testo pubblicato, e la questione si chiude
nello stesso passaggio invece di restare aperta accanto a una versione nuova.

---

## 7. Cosa ci serve indietro

1. **Condizioni generali di vendita v1.2**, sottoscritte, italiano e inglese,
   con gli artt. 3, 4, 5 e 6 riemessi e gli artt. 7, 8 e 13 verificati alla luce
   del pagamento anticipato (spedizione e rimborso sono oggi scritti attorno alla
   conferma via e-mail).
2. **Informativa privacy aggiornata**: Stripe fra i destinatari, il chiarimento
   su §2, la verifica di §7 e §8, e la correzione di §11 sulla newsletter.
3. **Politica di resi e recesso**: confermare se il testo regge invariato, o
   riemetterla come v1.2 con l'indicazione del rimborso sullo stesso mezzo di
   pagamento.
4. **La dicitura del pulsante**, confermata o sostituita, in entrambe le lingue.
5. **Quale comunicazione vale come conferma su supporto durevole** nel percorso
   con pagamento immediato. Da questa risposta dipende cosa il sistema invia.

I testi vanno consegnati in **entrambe le lingue**: vengono trascritti
verbatim in `src/content/legal.ts` e pubblicati parola per parola. Non
riscriviamo, non riassumiamo e non traduciamo noi.

**Finché non arrivano, il pulsante resta spento e il sito vende come ha sempre
venduto.**

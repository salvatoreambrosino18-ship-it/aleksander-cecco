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
**sei articoli riemessi** e **tre punti dell'informativa aggiornati**, prima che
il pulsante venga acceso. La spedizione, che fino a oggi era gratuita, da adesso
si paga, e questo tocca altri due articoli oltre a quelli sul pagamento.

**Il codice del pagamento è già scritto e già in produzione, ma è spento.** Non
può incassare finché non viene inserita una variabile nel pannello di
Cloudflare, e non verrà inserita finché i testi riemessi non saranno pubblicati
sul sito. Non c'è quindi nessuna fretta operativa e nessun rischio
che il sito incassi prima del tempo: la sequenza è nelle vostre mani.

---

## 1. Cosa cambia di fatto sul sito

Perché il giudizio sia dato su ciò che accade davvero, e non su una descrizione.

**Cosa cambia:**

- Nel carrello compare un secondo pulsante accanto a quello che oggi invia
  l'ordine. Chi lo preme viene portato **su un dominio di Stripe** (`stripe.com`),
  paga lì, e torna sul sito su una pagina di ringraziamento.
- Il pagamento avviene quindi **prima** che il venditore risponda, non dopo.
- **Prima di partire, sul carrello, il cliente sceglie il paese di
  destinazione.** Serve perché la spedizione non è più gratuita e il suo costo
  dipende dalla destinazione: il sistema di Stripe raccoglie l'indirizzo solo
  dopo, e la sua documentazione dice espressamente che non può ricalcolare la
  spedizione a partire da quell'indirizzo. Il paese scelto viene poi bloccato,
  così l'indirizzo che il cliente digita su Stripe è per forza quello per cui ha
  pagato.
- Al momento del pagamento il cliente vede il totale, la destinazione e il costo
  di spedizione, già sommati.
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
- **Nessun prezzo dei capi cambia.** Il titolare ha confermato che le cifre
  esposte sono quelle che il cliente paga, **IVA compresa**. Il sistema è
  configurato di conseguenza (imposta già inclusa nel prezzo esposto).
- **Il canale e-mail resta e resta primario.** Ogni pezzo mantiene il suo modulo
  d'ordine e il carrello mantiene il pulsante di invio. Chi non vuole pagare con
  carta ordina esattamente come oggi.
- **I due pezzi unici NON sono acquistabili con il pulsante.** Vedi §5.

**E UNA COSA CAMBIA CHE PRIMA NON C'ERA: LA SPEDIZIONE SI PAGA.** Fino a oggi
era gratuita e concordata nella risposta, ed è così che la descrivono le
clausole in vigore. Il titolare ha deciso il 07/09/2026:

- **Europa: 15 euro.**
- **Resto del mondo: 35 euro.**
- **Da 500 euro in su: gratuita, ovunque.**

Quattro precisazioni che contano per il testo delle clausole:

- **Europa** significa i ventisette Stati membri più **Regno Unito, Svizzera e
  Norvegia**.
- **La soglia dei 500 euro è compresa**: un ordine di esattamente 500 euro
  spedisce gratis. Si calcola sul valore dei capi, non sul totale con la
  spedizione già sommata.
- Lo striscione del sito dice oggi «spedizione gratuita in tutto il mondo
  **sopra** i 500 euro», mentre il sistema la darà gratis **già a** 500. La
  differenza è a favore di chi compra e chiediamo al titolare di allineare la
  frase; la segnaliamo perché è una promessa pubblicata e preferiamo che lo
  sappia da noi.
- **Il pagamento con carta è possibile solo verso un elenco chiuso di paesi**,
  circa sessantacinque, scelti fra quelli raggiungibili da un corriere e
  accettati da Stripe. Chi si trova altrove non vede il pulsante e ordina per
  e-mail, come oggi. Lo segnaliamo perché è una limitazione dell'offerta, e
  vogliamo che sia lei a dirci se e come vada dichiarata.

---

## 2. Condizioni generali di vendita v1.1 — i sei articoli

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

**Perché non regge, e ora ci sono due ragioni.** La prima: la frase è scritta
per una comunicazione **successiva** via e-mail, mentre nel percorso con carta i
costi sono mostrati nella pagina di pagamento, prima del clic finale. La
seconda, nuova: fino a oggi la voce «costi di spedizione» era sempre zero, e da
adesso non lo è.

**Cosa serve.** Che l'articolo dica che le spese di spedizione sono indicate
**prima dell'invio dell'ordine**, e che riporti o richiami le tariffe: **15 euro
in Europa, 35 nel resto del mondo, gratuita per ordini pari o superiori a 500
euro**. Ci dica lei se le cifre vanno scritte dentro la clausola o richiamate
come «indicate sul sito»: la seconda forma ci permetterebbe di cambiarle senza
rifare il documento, ma va bene solo se lei ci dice che va bene.

**Da confermare.** Che i prezzi dei capi sono comprensivi di IVA, che è la
situazione di fatto dal 7/09/2026 e che riteniamo debba essere detta
esplicitamente ora che la società ha una partita IVA. E se la spedizione, quando
è a pagamento, vada indicata anch'essa IVA compresa.

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

### Art. 7 — Spedizione e consegna

> **IT (in vigore):** «Le spedizioni sono effettuate all'indirizzo indicato dal
> cliente utilizzando, a seconda della destinazione e della disponibilità del
> servizio, corrieri internazionali quali DHL o UPS. I tempi di spedizione e
> consegna applicabili all'ordine sono indicati nella conferma dell'ordine.
>
> Il venditore non risponde dei ritardi imputabili esclusivamente al vettore,
> alle autorità doganali o a eventi fuori dal ragionevole controllo del
> venditore, fermo restando ogni diritto inderogabile del consumatore.»

> **EN (in vigore):** "Orders are shipped to the address provided by the
> customer using, depending on destination and service availability,
> international carriers such as DHL or UPS. Applicable shipping and delivery
> timing is stated in the order confirmation.
>
> The Seller is not responsible for delays attributable exclusively to the
> carrier, customs authorities or events beyond the Seller's reasonable control,
> without prejudice to mandatory consumer rights."

**Perché non regge.** «indicati nella conferma dell'ordine» / "stated in the
order confirmation" descrive un passaggio che nel percorso con carta non esiste
più: quando arriva la conferma, il cliente ha già pagato la spedizione. Il costo
e la destinazione sono scelti e mostrati **prima**.

Il secondo comma, sui ritardi, non ci risulta toccato da nulla di quanto sopra e
per noi resta com'è. Lo diciamo perché sia lei a confermarlo, non perché lo
diamo per scontato.

**Cosa serve.** Che il primo comma valga per tutti e due i percorsi: il costo e
i tempi indicati **prima della conclusione dell'ordine** nel percorso con carta,
e nella conferma via e-mail nell'altro.

---

### Art. 8 — Spedizioni internazionali

> **IT (in vigore):** «Per destinazioni al di fuori dell'Unione Europea possono
> applicarsi dazi, imposte, oneri doganali o altri costi di importazione. La
> loro eventuale applicazione e la relativa imputazione saranno indicate nella
> conferma dell'ordine in base alla destinazione e alle condizioni di
> spedizione.»

> **EN (in vigore):** "For destinations outside the European Union, customs
> duties, taxes, import charges or other destination-country costs may apply.
> Their possible application and allocation will be stated in the order
> confirmation according to destination and applicable shipping terms."

**Perché non regge, ed è il caso peggiore dei tre.** Anche qui l'articolo rinvia
alla conferma dell'ordine, che nel percorso con carta arriva **dopo il
pagamento**. Ma qui la posta è più alta: si tratta di dazi e oneri doganali che
possono essere una frazione consistente del prezzo, e il cliente li scoprirebbe
quando ha già pagato. La destinazione, però, adesso la conosciamo **prima**,
perché il cliente la sceglie sul carrello: siamo quindi in grado di dirglielo al
momento giusto, se lei ci dice cosa dobbiamo dire.

**Cosa serve.**

- Il testo di un avviso da mostrare **nella pagina di pagamento**, per le
  destinazioni fuori dall'Unione, sul fatto che dazi e oneri di importazione
  sono a carico del cliente e non sono compresi nella cifra pagata. Serve nelle
  due lingue e lo mettiamo dove ci dice.
- La conferma che la spedizione avvenga **con oneri a carico del destinatario**
  (DAP/DDU) e non sdoganata a nostro carico, o l'indicazione contraria.
- Se questo interagisca con i **quattro diritti sull'export** che ci ha già
  indicato: si veda il §5, dove spieghiamo perché riteniamo di no.

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
   con gli **artt. 3, 4, 5, 6, 7 e 8 riemessi** e l'**art. 13 verificato** alla
   luce del pagamento anticipato (il rimborso è oggi scritto attorno alla
   conferma via e-mail, e ora il denaro parte prima).
2. **Il testo dell'avviso su dazi e oneri doganali** da mostrare nella pagina di
   pagamento per le destinazioni fuori dall'Unione, nelle due lingue, e la
   conferma che si spedisce con oneri a carico del destinatario.
3. **Informativa privacy aggiornata**: Stripe fra i destinatari, il chiarimento
   su §2, la verifica di §7 e §8, e la correzione di §11 sulla newsletter.
4. **Politica di resi e recesso**: confermare se il testo regge invariato, o
   riemetterla come v1.2 con l'indicazione del rimborso sullo stesso mezzo di
   pagamento.
5. **La dicitura del pulsante**, confermata o sostituita, in entrambe le lingue.
6. **Quale comunicazione vale come conferma su supporto durevole** nel percorso
   con pagamento immediato. Da questa risposta dipende cosa il sistema invia.

I testi vanno consegnati in **entrambe le lingue**: vengono trascritti
verbatim in `src/content/legal.ts` e pubblicati parola per parola. Non
riscriviamo, non riassumiamo e non traduciamo noi.

**Finché non arrivano, il pulsante resta spento e il sito vende come ha sempre
venduto.**

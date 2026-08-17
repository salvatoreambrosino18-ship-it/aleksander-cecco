# Brief per il legale — sito Aleksander Cecco

**Cosa è questo documento.** È una descrizione tecnica del sito, scritta da chi
lo ha costruito, per chi dovrà redigere i documenti legali. **Non è un parere
legale e non contiene valutazioni giuridiche.** Dove compare una parola tecnica
del GDPR è usata per farsi capire, non per qualificare un trattamento: quella
qualificazione spetta al legale.

**Verificato sul sito pubblicato il 16 agosto 2026.** Le parti cambiate quel
giorno sono segnalate una per una nel testo, perché la versione precedente di
questo documento diceva il contrario e potrebbe essere già stata letta.

Tutto ciò che segue è verificato leggendo il codice del sito, non ricordato.
Dove un dato non è verificabile da qui — un contratto, una regione di
archiviazione, l'intestazione di un account — è scritto esplicitamente
**[DA VERIFICARE]** e messo in fondo tra le cose da accertare.

**Stato del sito.** È online, in due lingue (italiano e inglese), ed è
**deliberatamente escluso dai motori di ricerca** e non è stato annunciato.
Il dominio definitivo è `aleksandercecco.com`, acquistato e in corso di
collegamento; fino a quel momento il sito risponde all'indirizzo tecnico
`https://aleksander-cecco.pages.dev`, che resterà comunque raggiungibile. Non può essere lanciato finché non
esistono i documenti richiesti qui sotto: l'informativa privacy in particolare
blocca sia il modulo d'ordine sia la newsletter.

**Attività.** Abbigliamento artigianale in pelle, vendita internazionale.
Tredici pezzi acquistabili oggi, da 275 a 1.850 €.

**Esiste una posizione fiscale**, con partita IVA, aggiornamento del 16/08/2026.
I dati identificativi completi vanno nell'informativa e sul sito, dove oggi non
compaiono ancora.

**Il su misura non esiste più**, in nessuna forma. Fino al 12/08/2026 il negozio
lo offriva; dal 16/08/2026 il sito non lo nomina più da nessuna parte. Chi compra
sceglie una taglia fra quelle che il produttore realizza.

**Il sito non incassa pagamenti.** L'ordine è una richiesta a cui si risponde via
email, e pagamento e consegna si concordano in quella risposta.

---

## 1. Quali dati raccoglie il sito, e da quale modulo

Il sito è **statico**: le pagine sono file già pronti, non c'è un database e non
c'è un'area riservata. Esiste **un solo punto** in cui un visitatore invia dati,
e uno in cui li invierebbe se venisse attivato.

**I canali di vendita sono due, non uno.** Il modulo di un capo singolo e la
cassa del carrello. Raccolgono le stesse informazioni sulla persona e passano
dallo stesso indirizzo sul server, ma quello che dichiarano sull'acquisto è
diverso, quindi sono descritti separatamente.

### 1.1 Il modulo d'ordine di un capo singolo (attivo)

Si trova sulla pagina di ogni capo, dietro il tasto «Acquista» («Acquire» in
inglese).

Dati inseriti dalla persona:

| Dato | Obbligatorio | Note |
| --- | --- | --- |
| Nome | sì | testo libero, max 120 caratteri |
| Indirizzo email | sì | serve per rispondere |
| Taglia | sì, dove il capo ha più taglie | una scelta fra XS, S, M, L |
| Nota libera | no | max 2.000 caratteri, la persona ci scrive quello che vuole |

**AGGIORNAMENTO 2026-08-12, ed è la modifica più rilevante per questo brief: il
sito NON raccoglie più misure del corpo.** Fino a oggi il modulo chiedeva torace,
spalle e lunghezza. Il proprietario ha cambiato il funzionamento del negozio:
ora chi compra **sceglie una taglia** e il capo viene realizzato in quella
taglia. Le tre misure sono state rimosse dal modulo, dal server e dall'email
d'ordine: **non vengono più chieste, né inviate, né conservate da nessuna
parte.**

Dati aggiunti automaticamente dal sito, non digitati dalla persona: quale capo,
il suo codice, il prezzo mostrato e la lingua della pagina.

**Cinque pezzi su tredici sono a taglia unica** (una borsa, un cappello, un paio
di ghette e due capi con collare regolabile). Su quelli la taglia non viene
chiesta e **non viene inviata alcuna taglia**.

Dati tecnici trattati dal server per ragioni di sicurezza:

- **L'indirizzo IP** di chi invia. Serve a impedire che qualcuno saturi con
  invii automatici l'unico canale di vendita del brand. Vedi §3.2: è l'unico
  dato che il sito **conserva**, sia pure brevemente.
- Due controlli antispam che **non raccolgono nulla**: un campo invisibile che
  un essere umano non compila mai, e il tempo trascorso tra apertura e invio del
  modulo (chi invia in meno di tre secondi è un programma).

### 1.2 Il carrello e la sua cassa (attivo)

**Esiste un carrello**, alle pagine `/it/cart` e `/en/cart`, aggiunto il
16/08/2026. È la seconda cassa del sito e va descritto con precisione perché
tocca due cose che il legale deve sapere, la memoria del browser e il calcolo del
prezzo.

**Cosa contiene, e dove sta.** Il carrello vive **solo nel browser di chi
visita**, nella memoria locale (`localStorage`), sotto una sola chiave chiamata
`ac-cart`. Contiene esclusivamente **quali capi**, in **quale taglia** e in
**quale quantità**. Non contiene il nome, non contiene l'email, non contiene
niente che identifichi una persona, e **non viene mai inviato al server** finché
la persona non preme il tasto per ordinare.

**Non è un cookie e non viaggia.** La memoria locale non viene allegata alle
richieste come fa un cookie: resta sul dispositivo, è leggibile solo dalle pagine
di questo sito, e si svuota da sola quando l'ordine viene confermato. La persona
può cancellarla in qualunque momento svuotando i dati del sito dal browser.
**Serve solo a far sopravvivere il carrello al passaggio da una pagina all'altra**
e non ha nessun'altra funzione. Non c'è nessuna identificazione, nessun
riconoscimento al ritorno, nessuna misurazione.

**Cosa manda la cassa.** Gli stessi dati personali del modulo singolo, cioè nome,
indirizzo email e nota libera, più la lista dei capi con taglia e quantità.

**Il prezzo NON viene preso dal modulo.** Quando l'ordine arriva, il server
ricalcola ogni prezzo e il totale da un listino generato dal sito stesso, e
ignora qualunque cifra arrivi dal browser. Un capo che non è in quel listino non
si può ordinare, una taglia che il produttore non fa viene scartata, e una
quantità superiore a quella disponibile viene ridotta. Lo diciamo perché
significa che **il totale scritto nell'email d'ordine non è una cifra che il
cliente può avere modificato**.

### 1.3 La newsletter (presente ma spenta)

In fondo alla home c'è un campo per iscriversi. **Oggi non raccoglie niente**:
il server risponde «le iscrizioni non sono ancora aperte» e **scarta
l'indirizzo senza salvarlo e senza inviarlo a nessuno**. È stata spenta
apposta, in attesa di questi documenti. Cosa comporterebbe accenderla: §4.

### 1.4 L'indirizzo email pubblicato

Sulla pagina Contatti c'è un normale link `mailto:` all'indirizzo del brand.
Chi ci scrive lo fa dal proprio programma di posta: il sito non vede né tratta
quel messaggio.

---

## 2. Dove viaggiano i dati, e chi li tratta

Un ordine attraversa quattro soggetti, in quest'ordine, e Cloudflare compare
due volte, prima come hosting e poi come servizio di posta. Sono tutti fornitori di
servizi, nessuno di loro usa i dati per finalità proprie per quanto ci risulta,
e **con nessuno di loro esiste oggi un contratto firmato dal brand**
[DA VERIFICARE: §6].

**1. Cloudflare** — ospita il sito e riceve materialmente l'invio del modulo.
Il codice che elabora l'ordine gira sulla loro rete. Società statunitense con
rete distribuita a livello globale: la richiesta viene eseguita nel nodo più
vicino al visitatore, quindi per un cliente italiano tipicamente in Europa, ma
la sede della società e la titolarità del servizio restano statunitensi.
*[DA VERIFICARE: quale entità Cloudflare è controparte e su quali condizioni.]*

**2. Resend** — spedisce l'email. Il sito le consegna il contenuto completo del
messaggio (nome, email, nota, e i capi ordinati con taglia e quantità) tramite
`api.resend.com`.
Società statunitense. *[DA VERIFICARE: entità, condizioni, quanto conserva le
email inviate nei propri registri.]*

**3. L'inoltro e la casella di posta del brand.** Dal 16/08/2026 il dominio
`aleksandercecco.com` ha un servizio di **inoltro posta di Cloudflare**, già
attivo e provato: `ordini@` e `info@` ricevono e **inoltrano a una casella
Gmail** (`aleksandercecco@gmail.com`). Un ordine attraversa quindi Cloudflare
una seconda volta, come servizio di posta, prima di arrivare a Google.

Questo significa che **il contenuto degli ordini resta archiviato in una casella
Gmail personale**, quindi trattato da Google. Lo segnaliamo esplicitamente perché è il
punto in cui i dati restano più a lungo, ed è anche il più facile da cambiare
(§6, prima domanda pratica).

**4. Il destinatario della risposta** — rispondendo all'email, la risposta parte
verso l'indirizzo del cliente. Nessun altro sistema è coinvolto.

### Un quinto soggetto, per chi si limita a guardare il sito

**Sanity** — è il sistema dove vivono contenuti e fotografie. Le pagine sono
costruite in anticipo, quindi **chi visita il sito non interroga Sanity**, con
un'eccezione importante: **le fotografie vengono servite dalla rete di Sanity**
(`cdn.sanity.io`). Il browser di ogni visitatore si collega quindi a Sanity per
scaricare le immagini, e in quella connessione Sanity riceve inevitabilmente
**indirizzo IP e tipo di browser** del visitatore, come qualunque fornitore di
immagini. Società di origine norvegese con presenza statunitense.
*[DA VERIFICARE: in quale regione è ospitato il dataset del progetto, e quale
entità è controparte.]*

Il codice sorgente del sito è su **GitHub** (gruppo Microsoft), ma **lì non
transita alcun dato di visitatori o clienti**: è solo il progetto.

---

## 3. Cosa viene conservato, dove e per quanto

### 3.1 Il sito non ha un archivio

Non esiste database, non esiste elenco clienti, non esiste storico ordini.
**L'unica copia di un ordine è l'email nella casella del brand.** Se quella
email viene cancellata, di quell'ordine non resta traccia da nessuna parte nel
sito.

Conseguenza pratica: **la durata di conservazione degli ordini coincide con
quanto a lungo il brand tiene le email in casella.** Oggi non c'è una regola.
Serve deciderla (§6).

### 3.2 L'unica cosa che il sito conserva davvero: i contatori antiabuso

Per limitare gli invii, il sistema tiene dei contatori la cui **chiave contiene
l'indirizzo IP** di chi invia. Non è un registro delle richieste: è un numero
per indirizzo, senza nome, email, misure né altro.

- Un contatore orario (max 5 invii) — **si cancella da solo dopo 1 ora**.
- Un contatore giornaliero (max 20 invii) — **si cancella da solo dopo 24 ore**.
- Un contatore complessivo del sito (max 40 invii al giorno), **senza IP**.

**Durata massima di conservazione: 24 ore**, con cancellazione automatica; non
c'è modo di leggerli né interfaccia per consultarli. Sono ospitati da Cloudflare
(nel loro archivio chiave-valore o, in mancanza, nella loro cache).

### 3.3 Registri tecnici dei fornitori

Cloudflare e Resend mantengono propri registri tecnici secondo le loro
politiche, sui quali il brand non ha controllo e che non abbiamo modo di
verificare da qui. *[DA VERIFICARE: §6.]*

---

## 4. Cosa aggiungerebbe la newsletter, se venisse accesa

Oggi non raccoglie nulla. Accendendola si aggiungerebbe un trattamento **diverso**
da quello dell'ordine — non una versione più piccola dello stesso:

- un **elenco di indirizzi email** conservato nel tempo, che oggi non esiste;
- un consenso **separato e non preselezionato**, distinto da quello dell'ordine;
- la **prova** di quando e come ogni consenso è stato dato, da conservare;
- un **link di disiscrizione funzionante** in ogni messaggio, e l'identità e
  l'indirizzo postale di chi invia;
- una **regola di cancellazione** dell'elenco;
- verosimilmente un fornitore in più per la gestione dell'elenco.

Il brand vorrebbe accenderla dopo il lancio. La domanda per il legale è se e
come, e in che rapporto sta col consenso raccolto in fase d'ordine.

---

## 5. Cosa il sito NON fa

Ognuno di questi punti è stato verificato sul sito costruito, non solo nelle
intenzioni:

- **Nessun cookie.** Non ne scrive nessuno, di nessun tipo, né tecnico né altro,
  e non ne legge nessuno.
- **Usa la memoria locale del browser in un punto solo, per il carrello**
  (§1.2), e questa riga fino al 16/08/2026 diceva il contrario. È una sola voce,
  contiene solo capi, taglie e quantità, non contiene niente di personale, non
  viene inviata insieme alle richieste come farebbe un cookie e si svuota da sola
  a ordine confermato.
- **Nessuna statistica, nessun sistema di analisi.** Non è installato alcuno
  strumento di misurazione del traffico, né di Google né di altri, né la
  statistica «senza cookie» del fornitore di hosting.
- **Nessuno script di terze parti.** Nelle pagine non c'è **nessun** file
  JavaScript esterno: zero, verificato su tutto il sito pubblicato.
- **Nessun pixel, nessun tracciamento pubblicitario, nessuna profilazione.**
- **Nessun font esterno.** I due caratteri tipografici sono ospitati sul sito
  stesso: il browser del visitatore **non contatta Google Fonts** né altri.
- **Nessun contenuto incorporato.** Instagram compare solo come **collegamento**
  al profilo e come fotografie caricate a mano nel sito: non c'è alcun riquadro
  incorporato, quindi Instagram non riceve visite dal sito.
- **Nessuna mappa, nessuna chat, nessun pulsante social.** Sul sito ci sono
  **video**, ma sono file caricati dal brand e serviti dalla stessa rete delle
  fotografie (§2): non c'è alcun lettore di terze parti, né YouTube né Vimeo, e
  nessun altro soggetto riceve visite.
- **Nessun account e nessun login.** Il carrello esiste (§1.2) ma non è
  un'area riservata: non c'è registrazione, non c'è profilo, e il sito non
  riconosce chi torna.
- **Nessun pagamento e nessun dato di carta**, mai, in nessun punto. Il sito non
  è collegato ad alcun sistema di incasso.
- **Nessun trasferimento di dati a fini commerciali** verso terzi.

La sola connessione esterna che il browser di un visitatore effettua è quella
alle immagini su `cdn.sanity.io` descritta in §2.

---

## 6. Cosa serve, e cosa chiediamo

### 6.1 Documenti necessari perché il sito possa operare

1. **Informativa privacy** completa, in italiano e in inglese, che copra
   **entrambe le casse** e i dati di §1, e che indichi il **titolare del
   trattamento** con dati identificativi e recapito. La posizione fiscale ora
   esiste.
2. **Condizioni di vendita.** Prodotto artigianale venduto come esistente e
   disponibile, con scelta della taglia, spedizione internazionale e pagamento
   concordato via email, dato che oggi non c'è un incasso automatico. **Il su
   misura non va coperto**, perché non viene più offerto.
3. **Politica di reso e diritto di recesso**, e la sua traduzione in due frasi
   da mettere sul sito.
4. **Eventuale informativa su cookie e memoria del browser**, se ritenuta
   necessaria. Cookie non ce ne sono. C'è **una sola voce di memoria locale, il
   carrello** (§1.2), che contiene capi taglie e quantità e niente di personale.
   Se va dichiarata, e in che termini, lo dica il legale.
5. **Indicazione dei rapporti da formalizzare** con i fornitori di §2 e degli
   eventuali adempimenti per i trasferimenti extra UE.

### 6.2 Domande da porre, in ordine di impatto sul sito

1. **IL DIRITTO DI RECESSO, ED È CAMBIATA LA DOMANDA (2026-08-12).** È la prima
   domanda per impatto, e non è più quella di prima.

   **Attenzione: la premessa di questa domanda è cambiata il 16/08/2026 e la
   versione precedente di questo brief diceva il contrario.**

   **Cosa dice il sito oggi, alla lettera.** Ogni capo porta la riga
   «**Disponibile subito**», chi compra **sceglie una taglia** fra quelle che il
   produttore realizza, e **non c'è più nessuna frase sui tempi di
   realizzazione**. Fino al 16/08/2026 la pagina di ogni capo diceva anche «ogni
   pezzo è fatto dopo l'ordine, massimo due settimane prima della spedizione»:
   quella frase è stata **rimossa da tutti e cinque i punti** in cui compariva,
   perché diceva il contrario della riga sopra e le due non potevano essere vere
   insieme. Il proprietario ha scelto «disponibile subito».

   **Quello che il sito dichiara è quindi un bene già esistente e pronto.**

   **E qui serve una verifica che non possiamo fare noi.** Non sappiamo se
   fisicamente ogni capo sia già cucito e in casa, o se venga tagliato dopo
   l'ordine. Le due cose portano a risposte diverse su questa domanda, e quello
   che il sito **dichiara** al cliente vincola comunque. Va chiesto al
   proprietario prima di scrivere le condizioni di vendita.

   **La domanda, e la poniamo come domanda perché non sappiamo la risposta:** un
   capo realizzato dopo l'ordine nella taglia scelta dal cliente è un bene
   «confezionato su misura o chiaramente personalizzato» ai fini dell'eccezione
   al recesso, oppure è un normale bene di serie prodotto su commessa, per cui
   il recesso si applica in pieno?

   Se il capo è davvero già pronto, come il sito dichiara, la lettura più
   semplice è quella del normale bene di serie, per cui il recesso si applica in
   pieno. Se invece viene cucito dopo l'ordine nella taglia scelta, la situazione
   torna **intermedia**: non c'è personalizzazione sulle misure della singola
   persona, ma non c'è nemmeno un prodotto già fatto e intercambiabile.

   **Cosa cambia in base alla risposta:** il testo dei resi che è **già online
   oggi** sulla pagina di ogni capo e nella pagina spedizioni, e il testo delle
   condizioni di vendita da scrivere. Se il recesso si applica, servono anche i
   quattordici giorni, le istruzioni per esercitarlo e il modulo tipo.

   Resta un caso che il sito tratta diversamente e che va distinto nella
   risposta: il **pezzo unico 1 di 1**, già realizzato e venduto com'è, di cui
   esiste un solo esemplare e la cui quantità ordinabile si ferma a uno.

   **Il su misura non è più un'ipotesi da coprire.** Fino al 16/08/2026 la pagina
   di ogni capo e la pagina Contatti invitavano a scrivere per un capo su misura.
   Quella riga è stata tolta da entrambe: il sito non offre il su misura in
   nessuna forma e non lo nomina.
2. **Le misure del corpo non vengono più raccolte** (vedi §1.1). La domanda che
   stava qui, come qualificarle, **decade**. Dal 16/08/2026 decade anche la
   riserva che stava scritta qui sulle misure che potessero arrivare per email
   dopo una richiesta di su misura, perché il su misura non viene più offerto e
   il sito non lo nomina più da nessuna parte.
3. **Per quanto tempo vanno conservate le email degli ordini**, e cosa va fatto
   scaduto quel termine? Serve una regola applicabile a mano da una persona, non
   automatizzata.
4. **La casella Gmail personale è adeguata** per ricevere e conservare questi
   dati, o va spostata su una casella aziendale con contratto? È la modifica
   tecnica più facile da fare adesso e la più costosa da fare dopo.
5. **Servono contratti con Cloudflare, Resend e Sanity**, e in che forma? Uno di
   questi soggetti tratta dati fuori dall'Unione: quali garanzie servono?
6. **Il titolare del trattamento chi è, e come va scritto?** La posizione
   fiscale ora esiste, quindi la domanda che stava qui, se si potesse pubblicare
   un'informativa a nome di una persona fisica, **decade**. Restano da fissare la
   denominazione esatta, la sede, la partita IVA e il recapito da pubblicare, e
   dove vanno messi sul sito, dove oggi non compaiono.
7. **Serve un'età minima** per inviare il modulo, e va dichiarata?
8. **La newsletter**: si può accendere insieme al lancio o conviene dopo, e con
   quale meccanismo di consenso (§4)?
9. **La dogana fuori dall'UE.** Sul sito **non c'è più nessuna frase**: quella
   che diceva che dazi e imposte sono a carico del destinatario è stata tolta il
   12/08/2026 perché era scritta da noi e non l'aveva confermata nessuno.
   Verificato il 16/08/2026 sulle pagine pubblicate. Se una frase del genere
   serve nelle condizioni di vendita, va scritta da chi può confermarla.
10. **Statistiche in futuro**: se un domani il brand volesse contare le visite
    con uno strumento senza cookie, cosa cambierebbe nell'informativa?

### 6.3 Da accertare, e non lo possiamo fare noi

- L'entità contraente e le condizioni applicabili per **Cloudflare**, **Resend**
  e **Sanity**, e quanto ciascuno conserva nei propri registri.
- La **regione geografica** in cui è ospitato il dataset Sanity del progetto
  (si legge nel pannello di amministrazione del progetto).
- L'intestazione dell'account di posta che riceve gli ordini.
- **Se ogni capo sia fisicamente già pronto**, come il sito dichiara, oppure
  venga cucito dopo l'ordine. Decide la risposta alla prima domanda del §6.2 e
  lo sa solo il proprietario.
- Le condizioni del **servizio di inoltro posta di Cloudflare** ora attivo sul
  dominio, e per quanto tempo trattiene un messaggio in transito.

---

## 7. Riepilogo in una pagina

| Domanda | Risposta |
| --- | --- |
| Quanti moduli raccolgono dati? | Due attivi, il modulo di un capo e la cassa del carrello, e uno spento, la newsletter |
| Quali dati | Nome, email, nota libera, e i capi ordinati con taglia e quantità |
| Misure del corpo | **Nessuna.** Non vengono più chieste dal 12/08/2026 |
| Dove finiscono | Email inviata via Resend, inoltrata da Cloudflare, archiviata in una casella Gmail del brand |
| Il sito li archivia? | No. Nessun database. L'unica copia è l'email |
| Cosa conserva il sito | Solo contatori antiabuso con IP, cancellati entro 24 ore |
| Cookie | Nessuno |
| Memoria del browser | Una sola voce, il carrello, con capi taglie e quantità. Niente di personale |
| Statistiche / tracciamento | Nessuno |
| Script di terze parti | Nessuno |
| Pagamenti | Nessuno, il sito non incassa |
| Posizione fiscale | Esiste, con partita IVA, dal 16/08/2026 |
| Fornitori coinvolti | Cloudflare (hosting e inoltro posta), Resend (invio email), Google/Gmail (casella), Sanity (contenuti, immagini e video) |
| Cosa blocca il lancio | Informativa privacy, condizioni di vendita, recesso e resi |

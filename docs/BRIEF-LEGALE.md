# Brief per il legale — sito Aleksander Cecco

**Cosa è questo documento.** È una descrizione tecnica del sito, scritta da chi
lo ha costruito, per chi dovrà redigere i documenti legali. **Non è un parere
legale e non contiene valutazioni giuridiche.** Dove compare una parola tecnica
del GDPR è usata per farsi capire, non per qualificare un trattamento: quella
qualificazione spetta al legale.

Tutto ciò che segue è verificato leggendo il codice del sito, non ricordato.
Dove un dato non è verificabile da qui — un contratto, una regione di
archiviazione, l'intestazione di un account — è scritto esplicitamente
**[DA VERIFICARE]** e messo in fondo tra le cose da accertare.

**Stato del sito.** È online, in due lingue (italiano e inglese), all'indirizzo
`https://aleksander-cecco.pages.dev`, ma è **deliberatamente escluso dai motori
di ricerca** e non è stato annunciato. Non può essere lanciato finché non
esistono i documenti richiesti qui sotto: l'informativa privacy in particolare
blocca sia il modulo d'ordine sia la newsletter.

**Attività.** Abbigliamento artigianale in pelle, pezzi unici e su misura,
fascia di prezzo indicativa 700–1.500 €, vendita internazionale.
**Non esiste ancora una posizione fiscale** e **il sito non incassa pagamenti**:
oggi l'ordine è una richiesta a cui si risponde via email, e pagamento e consegna
si concordano in quella risposta.

---

## 1. Quali dati raccoglie il sito, e da quale modulo

Il sito è **statico**: le pagine sono file già pronti, non c'è un database e non
c'è un'area riservata. Esiste **un solo punto** in cui un visitatore invia dati,
e uno in cui li invierebbe se venisse attivato.

### 1.1 Il modulo d'ordine (attivo)

Si trova sulla pagina di ogni capo, dietro il tasto «Acquista» («Acquire» in inglese). È
l'**unico** canale di vendita del sito.

Dati inseriti dalla persona:

| Dato | Obbligatorio | Note |
| --- | --- | --- |
| Nome | sì | testo libero, max 120 caratteri |
| Indirizzo email | sì | serve per rispondere |
| Taglia | sì, dove il capo ha più taglie | una scelta fra XS, S, M, L, XL |
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

Dati tecnici trattati dal server per ragioni di sicurezza:

- **L'indirizzo IP** di chi invia. Serve a impedire che qualcuno saturi con
  invii automatici l'unico canale di vendita del brand. Vedi §3.2: è l'unico
  dato che il sito **conserva**, sia pure brevemente.
- Due controlli antispam che **non raccolgono nulla**: un campo invisibile che
  un essere umano non compila mai, e il tempo trascorso tra apertura e invio del
  modulo (chi invia in meno di tre secondi è un programma).

### 1.2 La newsletter (presente ma spenta)

In fondo alla home c'è un campo per iscriversi. **Oggi non raccoglie niente**:
il server risponde «le iscrizioni non sono ancora aperte» e **scarta
l'indirizzo senza salvarlo e senza inviarlo a nessuno**. È stata spenta
apposta, in attesa di questi documenti. Cosa comporterebbe accenderla: §4.

### 1.3 L'indirizzo email pubblicato

Sulla pagina Contatti c'è un normale link `mailto:` all'indirizzo del brand.
Chi ci scrive lo fa dal proprio programma di posta: il sito non vede né tratta
quel messaggio.

---

## 2. Dove viaggiano i dati, e chi li tratta

Un ordine attraversa quattro soggetti, in quest'ordine. Sono tutti fornitori di
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
messaggio (nome, email, misure se presenti, nota) tramite `api.resend.com`.
Società statunitense. *[DA VERIFICARE: entità, condizioni, quanto conserva le
email inviate nei propri registri.]*

**3. La casella di posta del brand** — l'email arriva a un indirizzo
**Gmail** (`aleksandercecco@gmail.com`). Questo significa che **il contenuto
degli ordini, misure del corpo comprese, resta archiviato in una casella Gmail
personale**, quindi trattato da Google. Lo segnaliamo esplicitamente perché è il
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

- **Nessun cookie.** Non ne scrive nessuno, di nessun tipo, né tecnico né altro.
  Il sito non usa nemmeno la memoria locale del browser.
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
- **Nessuna mappa, nessun video esterno, nessuna chat, nessun pulsante social.**
- **Nessun account, nessun login, nessun carrello.**
- **Nessun pagamento e nessun dato di carta**, mai, in nessun punto. Il sito non
  è collegato ad alcun sistema di incasso.
- **Nessun trasferimento di dati a fini commerciali** verso terzi.

La sola connessione esterna che il browser di un visitatore effettua è quella
alle immagini su `cdn.sanity.io` descritta in §2.

---

## 6. Cosa serve, e cosa chiediamo

### 6.1 Documenti necessari perché il sito possa operare

1. **Informativa privacy** completa, in italiano e in inglese, che copra il
   modulo d'ordine e i dati di §1, e che indichi il **titolare del trattamento**
   con dati identificativi e recapito.
2. **Condizioni di vendita**, con particolare attenzione a: prodotto
   artigianale su misura, tempi di realizzazione, spedizione internazionale,
   pagamento concordato via email (oggi non c'è un incasso automatico).
3. **Politica di reso e diritto di recesso**, e la sua traduzione in due frasi
   da mettere sul sito.
4. **Eventuale informativa cookie**, se ritenuta necessaria pur in assenza di
   cookie (§5).
5. **Indicazione dei rapporti da formalizzare** con i fornitori di §2 e degli
   eventuali adempimenti per i trasferimenti extra UE.

### 6.2 Domande da porre, in ordine di impatto sul sito

1. **IL DIRITTO DI RECESSO, ED È CAMBIATA LA DOMANDA (2026-08-12).** È la prima
   domanda per impatto, e non è più quella di prima.

   **Come funziona il negozio da oggi:** ogni capo esiste come modello, chi
   compra **sceglie una taglia** fra quelle che il produttore realizza, e il capo
   **viene confezionato dopo l'ordine, in quella taglia**, con una consegna
   dichiarata di massimo due settimane. Non si prendono misure del corpo. Non
   c'è magazzino: nulla è confezionato prima che qualcuno ordini.

   **La domanda, e la poniamo come domanda perché non sappiamo la risposta:** un
   capo realizzato dopo l'ordine nella taglia scelta dal cliente è un bene
   «confezionato su misura o chiaramente personalizzato» ai fini dell'eccezione
   al recesso, oppure è un normale bene di serie prodotto su commessa, per cui
   il recesso si applica in pieno?

   La situazione ci sembra **intermedia** fra i due casi tipici, e nessuna delle
   due letture ci convince da sole: non c'è personalizzazione sulle misure della
   singola persona, ma non c'è nemmeno un prodotto già fatto e intercambiabile,
   perché quel capo viene tagliato e cucito a mano per quell'ordine.

   **Cosa cambia in base alla risposta:** il testo dei resi che è **già online
   oggi** sulla pagina di ogni capo e nella pagina spedizioni, e il testo delle
   condizioni di vendita da scrivere. Se il recesso si applica, servono anche i
   quattordici giorni, le istruzioni per esercitarlo e il modulo tipo.

   Restano due casi che il sito tratta diversamente e che vanno distinti nella
   risposta: il **pezzo unico 1 di 1** (già realizzato, venduto com'è) e il capo
   **su misura vera**, che oggi non è più un flusso del sito ma resta possibile
   **per email** — sulla pagina di ogni capo c'è una riga che invita a scrivere.
2. **Le misure del corpo non vengono più raccolte** (vedi §1.1). La domanda che
   stava qui — come qualificarle — **decade**, salvo che il legale ritenga
   necessario dire qualcosa sulle misure che dovessero arrivare via email dopo
   una richiesta di su misura, che è un canale diverso e non un modulo del sito.
3. **Per quanto tempo vanno conservate le email degli ordini**, e cosa va fatto
   scaduto quel termine? Serve una regola applicabile a mano da una persona, non
   automatizzata.
4. **La casella Gmail personale è adeguata** per ricevere e conservare questi
   dati, o va spostata su una casella aziendale con contratto? È la modifica
   tecnica più facile da fare adesso e la più costosa da fare dopo.
5. **Servono contratti con Cloudflare, Resend e Sanity**, e in che forma? Uno di
   questi soggetti tratta dati fuori dall'Unione: quali garanzie servono?
6. **Il titolare del trattamento chi è?** Il brand non ha ancora una posizione
   fiscale: si può pubblicare un'informativa a nome di una persona fisica, o
   l'apertura della posizione fiscale viene prima?
7. **Serve un'età minima** per inviare il modulo, e va dichiarata?
8. **La newsletter**: si può accendere insieme al lancio o conviene dopo, e con
   quale meccanismo di consenso (§4)?
9. **La dogana fuori dall'UE**: sul sito c'è oggi una frase che dice che dazi e
   imposte sono a carico del destinatario. È una frase scritta da noi e **non
   ancora confermata da nessuno**: va verificata prima del lancio.
10. **Statistiche in futuro**: se un domani il brand volesse contare le visite
    con uno strumento senza cookie, cosa cambierebbe nell'informativa?

### 6.3 Da accertare, e non lo possiamo fare noi

- L'entità contraente e le condizioni applicabili per **Cloudflare**, **Resend**
  e **Sanity**, e quanto ciascuno conserva nei propri registri.
- La **regione geografica** in cui è ospitato il dataset Sanity del progetto
  (si legge nel pannello di amministrazione del progetto).
- L'intestazione dell'account di posta che riceve gli ordini.

---

## 7. Riepilogo in una pagina

| Domanda | Risposta |
| --- | --- |
| Quanti moduli raccolgono dati? | Uno attivo (ordine), uno spento (newsletter) |
| Quali dati | Nome, email, tre misure del corpo (solo su misura), nota libera |
| Dove finiscono | Email inviata via Resend a una casella Gmail del brand |
| Il sito li archivia? | No. Nessun database. L'unica copia è l'email |
| Cosa conserva il sito | Solo contatori antiabuso con IP, cancellati entro 24 ore |
| Cookie | Nessuno |
| Statistiche / tracciamento | Nessuno |
| Script di terze parti | Nessuno |
| Pagamenti | Nessuno, il sito non incassa |
| Fornitori coinvolti | Cloudflare (hosting), Resend (invio email), Google/Gmail (casella), Sanity (contenuti e immagini) |
| Cosa blocca il lancio | Informativa privacy, condizioni di vendita, recesso e resi |

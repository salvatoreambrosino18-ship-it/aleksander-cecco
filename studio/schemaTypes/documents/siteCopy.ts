import {defineField, defineType} from 'sanity'

/*
  LE PAROLE DEL SITO — every sentence the site speaks, and every title that
  heads a part of a page, put where the owner can rewrite it.

  Until 2026-08-18 all of this lived in src/i18n/ui.ts, which is code: changing
  one word meant a developer, a commit and a deploy. Now the site reads his
  version whenever there is one and falls back to ours whenever there is not.

  EVERY FIELD IS OPTIONAL AND EMPTY IS MEANINGFUL: empty means "leave the
  sentence that is on the site now". That is what an editor expects a blank
  field to do, it is what each description says it does, and it means he can
  change three sentences without being asked to retype forty.

  WHAT IS DELIBERATELY NOT HERE: the label above an input, the word on a state
  chip, the strings a screen reader is given, and the names of the catalogue
  filters, which map onto values in the garment schema. Those are the working
  parts of the interface rather than things the brand says. The test is what an
  empty value would MEAN: an unsaid sentence is an editorial choice, an unnamed
  email box is a broken form. The line is drawn key by key in
  src/i18n/ui.ts under OWNER_EDITABLE.

  THE DESCRIPTIONS ARE WRITTEN FOR HIM, in Italian, and say WHERE the words
  appear and WHAT happens if he changes them. They never quote the current
  wording: that would go stale the first time he edits it, and a description
  that lies is worse than none.
*/

const blank = 'Lascia vuoto per tenere la frase che c\'è adesso.'

export default defineType({
  name: 'siteCopy',
  title: 'Le parole del sito',  type: 'document',
  groups: [
    {name: 'capi', title: 'Sui capi', default: true},
    {name: 'negozio', title: 'Negozio e ordini'},
    {name: 'pagine', title: 'Le pagine'},
    {name: 'titoli', title: 'I titoli delle sezioni'},
    {name: 'nomi', title: 'Come chiami le cose'},
    {name: 'menu', title: 'Il menu e le pagine'},
    {name: 'catalogo', title: 'Il catalogo e i filtri'},
    {name: 'bottoni', title: 'I pulsanti'},
    {name: 'etichette', title: 'Le etichette sotto un capo'},
  ],
  fields: [
    /* ------------------------------------------------------------- sui capi */
    defineField({
      name: 'handcrafted',
      title: 'La riga finale sotto ogni capo',
      type: 'localeString',
      group: 'capi',
      description:
        'Chiude la descrizione breve su OGNI pagina di un capo, dopo il nome e la composizione. ' +
        'È la frase che vale per tutti i capi, quindi cambiandola la cambi ovunque. ' + blank,
    }),
    defineField({
      name: 'availableNow',
      title: 'Come si dice che un capo è disponibile',
      type: 'localeString',
      group: 'capi',
      description:
        'Compare sulla pagina di un capo che hai messo su «Disponibile subito». ' + blank,
    }),
    defineField({
      name: 'unique',
      title: 'Come si dice che un capo è un pezzo unico',
      type: 'localeString',
      group: 'capi',
      description: 'Compare sui capi che hai messo su «1 di 1». ' + blank,
    }),
    defineField({
      name: 'privateOrder',
      title: 'Come si dice che un capo è già di qualcuno',
      type: 'localeString',
      group: 'capi',
      description:
        'Compare sui capi su «Ordine privato». Questi capi restano visibili ma non si possono comprare. ' +
        blank,
    }),
    defineField({
      name: 'notTakingRequests',
      title: 'Come si dice che un capo non si fa in questo momento',
      type: 'localeString',
      group: 'capi',
      description: 'Compare sui capi su «Non in lavorazione». ' + blank,
    }),
    defineField({
      name: 'oneSize',
      title: 'Come si dice che un capo è taglia unica',
      type: 'localeString',
      group: 'capi',
      description:
        'Compare al posto delle taglie quando in un capo hai messo TAGLIA UNICA. ' + blank,
    }),
    defineField({
      name: 'outsideCollections',
      title: 'Come si dice che un capo non appartiene a nessun drop',
      type: 'localeString',
      group: 'capi',
      description:
        'Compare sui capi a cui non hai collegato nessun drop, per far capire che è voluto. ' + blank,
    }),
    defineField({
      name: 'fitGuidance',
      title: 'Il consiglio sotto le misure',
      type: 'localeString',
      group: 'capi',
      description:
        'Compare sotto le misure di un capo, solo se quel capo ha le misure. ' +
        'Serve a chi compra da lontano e non può provare niente. ' + blank,
    }),

    /* -------------------------------------------------------- negozio */
    defineField({
      name: 'shopIntro',
      title: 'La riga in cima al catalogo',
      type: 'localeString',
      group: 'negozio',
      description: 'La prima frase della pagina con tutti i capi. ' + blank,
    }),
    defineField({
      name: 'cartIntro',
      title: 'La riga in cima al carrello',
      type: 'localeString',
      group: 'negozio',
      description:
        'Spiega cosa succede quando si invia l\'ordine. Ricordati che qui NON si paga: se togli quella parte, ' +
        'chi ordina può aspettarsi di pagare subito. ' + blank,
    }),
    defineField({
      name: 'cartEmpty',
      title: 'Cosa dice il carrello quando è vuoto',
      type: 'localeString',
      group: 'negozio',
      description:
        'Chi legge questa frase non ha ancora scelto niente: sotto trova il link a tutte le Creature. ' + blank,
    }),
    defineField({
      name: 'cartNoPayment',
      title: 'La riga che dice che qui non si paga',
      type: 'localeString',
      group: 'negozio',
      description:
        'In fondo al carrello, appena sopra il pulsante. ' +
        'È la frase che evita malintesi sul pagamento: cambiala pure, ma dillo lo stesso. ' + blank,
    }),
    defineField({
      name: 'cartOnePiece',
      title: 'Come si dice, nel carrello, che di un capo ne esiste uno solo',
      type: 'localeString',
      group: 'negozio',
      description:
        'Compare accanto ai capi «1 di 1» nel carrello, dove la quantità si ferma a uno. ' + blank,
    }),
    defineField({
      name: 'newsletterLine',
      title: 'La riga sotto «Le prossime uscite»',
      type: 'localeString',
      group: 'negozio',
      description:
        'In fondo alla home. Attenzione: le iscrizioni NON sono ancora attive e chi si iscrive riceve ' +
        'una risposta che lo dice. Finché non c\'è l\'informativa privacy resta così. ' + blank,
    }),

    /* --------------------------------------------------------- le pagine */
    defineField({
      name: 'contactIntro',
      title: 'La prima riga dei Contatti',
      type: 'localeString',
      group: 'pagine',
      description:
        'Sotto il titolo CONTATTI. Promette un tempo di risposta: se non riesci a rispondere in un giorno, cambiala. ' +
        blank,
    }),
    defineField({
      name: 'contactWhere',
      title: 'Dove siete',
      type: 'localeString',
      group: 'pagine',
      description:
        'Nei Contatti. Dice che lo studio è a Napoli e che la pelle si concia a Solofra. ' +
        'È la cosa che dà più fiducia a chi compra da fuori: è vera e non la trova da nessun\'altra parte. ' +
        blank,
    }),
    defineField({
      name: 'contactBuy',
      title: 'La riga che manda al modulo d\'ordine',
      type: 'localeString',
      group: 'pagine',
      description:
        'Nei Contatti. Dice che per comprare non serve scrivere. Serve a non farti arrivare per email ' +
        'ordini che il sito sa già raccogliere da solo. ' + blank,
    }),
    defineField({
      name: 'wornLine',
      title: 'La riga sopra la fascia dei capi indossati',
      type: 'localeString',
      group: 'pagine',
      description: 'Nella home, sopra la fila di foto che scorre di lato. ' + blank,
    }),
    defineField({
      name: 'nothingYet',
      title: 'Cosa si legge dove non hai ancora messo niente',
      type: 'localeString',
      group: 'pagine',
      description:
        'Compare in una sezione vuota, per esempio un drop senza capi. Se vedi questa frase sul sito, ' +
        'vuol dire che lì manca del contenuto. ' + blank,
    }),
    defineField({
      name: 'notFound',
      title: 'Cosa si legge su una pagina che non esiste',
      type: 'localeString',
      group: 'pagine',
      description:
        'Quando qualcuno arriva su un indirizzo sbagliato. Succede con i vecchi link condivisi. ' + blank,
    }),

    /* --------------------------------------------------- titoli sezioni */
    defineField({
      name: 'theWork',
      title: 'Titolo: la sezione del lavoro nella home',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'theProject',
      title: 'Titolo: THE PROJECT',
      type: 'localeString',
      group: 'titoli',
      description:
        'Nella home. È scritto in inglese in tutte e due le lingue perché è un titolo tuo, non una traduzione. ' +
        blank,
    }),
    defineField({
      name: 'bodyOfLight',
      title: 'Titolo: BODY OF LIGHT',
      type: 'localeString',
      group: 'titoli',
      description: 'Nella home, sopra la fascia dei capi indossati. ' + blank,
    }),
    defineField({
      name: 'worn',
      title: 'Titolo: Addosso',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'theMaking',
      title: 'Titolo: La lavorazione',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'processTitle',
      title: 'Titolo della pagina Processo',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'newsletter',
      title: 'Titolo: Le prossime uscite',
      type: 'localeString',
      group: 'titoli',
      description: 'In fondo alla home. ' + blank,
    }),
    defineField({
      name: 'otherDrops',
      title: 'Titolo: Gli altri drop',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'enterDrop',
      title: 'Il link che entra in un drop',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'allCreatures',
      title: 'Il link che porta a tutti i capi',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'cart',
      title: 'Come si chiama il carrello',
      type: 'localeString',
      group: 'titoli',
      description:
        'Il titolo della pagina del carrello, e la parola che uno screen reader legge sull\'icona in alto. ' + blank,
    }),
    defineField({
      name: 'cartPieces',
      title: 'Titolo: l\'elenco dei capi nel carrello',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'cartYourDetails',
      title: 'Titolo: i dati di chi ordina',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'support',
      title: 'Titolo: Assistenza, in fondo alla pagina',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'footerNav',
      title: 'Titolo: Collegamenti, in fondo alla pagina',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),
    defineField({
      name: 'shippingReturns',
      title: 'Titolo: Spedizioni e resi',
      type: 'localeString',
      group: 'titoli',
      description: 'Nei Contatti, sopra le due righe sulle spedizioni. ' + blank,
    }),
    defineField({
      name: 'worldwideShipping',
      title: 'Titolo: Spedizioni in tutto il mondo',
      type: 'localeString',
      group: 'titoli',
      description: 'In fondo alla pagina. ' + blank,
    }),
    defineField({
      name: 'madeInItaly',
      title: 'La riga sull\'origine, in fondo alla pagina',
      type: 'localeString',
      group: 'titoli',
      description: blank,
    }),

    /* ------------------------------------------------ come chiami le cose */
    defineField({
      name: 'creature',
      title: 'Come chiami UN capo',
      type: 'localeString',
      group: 'nomi',
      description:
        'Singolare. Compare all\'inizio della descrizione breve di ogni capo, così: «Creatura: Rubedo.» ' +
        blank,
    }),
    defineField({
      name: 'creatures',
      title: 'Come chiami PIÙ capi',
      type: 'localeString',
      group: 'nomi',
      description: 'Plurale. Compare nel menu e in fondo alla pagina. ' + blank,
    }),
    defineField({
      name: 'collections',
      title: 'Come chiami le collezioni',
      type: 'localeString',
      group: 'nomi',
      description: 'Adesso è «Drop». Compare in fondo alla pagina e sopra gli elenchi. ' + blank,
    }),
    defineField({
      name: 'newDrop',
      title: 'Come chiami l\'ultimo drop nel menu',
      type: 'localeString',
      group: 'nomi',
      description: 'La prima voce del menu dopo Home. ' + blank,
    }),
    defineField({
      name: 'acquire',
      title: 'Il pulsante per comprare un capo',
      type: 'localeString',
      group: 'nomi',
      description:
        'Sulla pagina di un capo, con il prezzo accanto. Se lo lasci vuoto resta «Acquista»: ' +
        'non può restare senza parola, perché sarebbe un pulsante vuoto. ' + blank,
    }),
    defineField({
      name: 'uniqueAction',
      title: 'Il pulsante per comprare un pezzo unico',
      type: 'localeString',
      group: 'nomi',
      description: 'Come sopra, ma sui capi «1 di 1». ' + blank,
    }),
    defineField({
      name: 'cartAdd',
      title: 'Il pulsante che mette un capo nel carrello',
      type: 'localeString',
      group: 'nomi',
      description:
        'Sotto il pulsante per comprare, sui capi che hanno un prezzo, dopo la scelta della taglia. ' + blank,
    }),
    defineField({
      name: 'menuHome',
      title: 'La voce Home nel menu',
      type: 'localeString',
      group: 'menu',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'gallery',
      title: 'La parola «Galleria»',
      type: 'localeString',
      group: 'menu',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'process',
      title: 'La voce Processo nel menu',
      type: 'localeString',
      group: 'menu',
      description: 'È anche il nome della pagina con le foto del lavoro. Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'about',
      title: 'La voce Chi siamo nel menu',
      type: 'localeString',
      group: 'menu',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'contact',
      title: 'La voce Contatti nel menu',
      type: 'localeString',
      group: 'menu',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'designer',
      title: 'Il titolo sopra il ritratto',
      type: 'localeString',
      group: 'menu',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'creators',
      title: 'Il titolo sopra i vostri due nomi',
      type: 'localeString',
      group: 'menu',
      description: 'Nella pagina Chi siamo, sopra Ciro Cecco e Ferdinando Palmieri. Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'experimentalLineBy',
      title: 'La riga su Ferdressed',
      type: 'localeString',
      group: 'menu',
      description: 'Nella pagina Chi siamo, sotto i vostri nomi. Il nome Ferdressed viene aggiunto dopo, in automatico: scrivi solo la parte prima. Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'filterAll',
      title: 'Il filtro «Tutti» (i drop)',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'filterEveryone',
      title: 'Il filtro «Tutti» (uomo e donna)',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'filterMen',
      title: 'Il filtro Uomo',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'filterWomen',
      title: 'Il filtro Donna',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'movementAvailable',
      title: 'Il filtro dei capi disponibili',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'movementOneOfOne',
      title: 'Il filtro dei pezzi unici',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'movementSold',
      title: 'Il filtro dei capi non disponibili',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'soldOut',
      title: 'Come si dice, nel catalogo, che un capo non si può comprare',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'noneMatch',
      title: 'Cosa si legge quando un filtro non trova niente',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'noneMatchHint',
      title: 'La riga sotto, che spiega come tornare indietro',
      type: 'localeString',
      group: 'catalogo',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'placeOrder',
      title: 'Il pulsante che invia l\'ordine di un capo',
      type: 'localeString',
      group: 'bottoni',
      description: 'Non lasciarlo vuoto per sbaglio: se lo svuoti resta il nostro, perché un pulsante senza parola non si può premere. Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'cartSend',
      title: 'Il pulsante che invia l\'ordine dal carrello',
      type: 'localeString',
      group: 'bottoni',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'backHome',
      title: 'Il link per tornare alla home da una pagina che non esiste',
      type: 'localeString',
      group: 'bottoni',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'newsletterClosed',
      title: 'Cosa risponde il sito a chi prova a iscriversi',
      type: 'localeString',
      group: 'bottoni',
      description: 'Le iscrizioni sono spente finché non c\'è l\'informativa privacy: questa è la frase che legge chi ci prova. Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'composition',
      title: 'L\'etichetta «Composizione», sotto un capo',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'materials',
      title: 'L\'etichetta «Materiali»',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'availability',
      title: 'L\'etichetta sopra la disponibilità',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'price',
      title: 'L\'etichetta «Prezzo»',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'priceFrom',
      title: 'La parola «Da», prima di un prezzo',
      type: 'localeString',
      group: 'etichette',
      description: 'Nel catalogo, quando un capo ha più prezzi. Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'thisPieceMeasurements',
      title: 'L\'etichetta sopra le misure del capo',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'referenceMeasurements',
      title: 'L\'etichetta «Misure di riferimento»',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'collection',
      title: 'L\'etichetta «Collezione», sotto un capo',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
    defineField({
      name: 'details',
      title: 'L\'etichetta «Dettagli tecnici»',
      type: 'localeString',
      group: 'etichette',
      description: 'Lascia vuoto per tenere la parola che c\'è adesso.',
    }),
  ],
  preview: {prepare: () => ({title: 'Le parole del sito'})},
})

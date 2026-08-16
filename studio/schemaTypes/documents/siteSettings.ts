import {defineType, defineField, defineArrayMember} from 'sanity'

// Singleton (a single editable document, enforced by the studio structure).
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Impostazioni',
  type: 'document',
  /*
    L'ORDINE DELLE SCHEDE E' L'ORDINE IN CUI LE TOCCA (2026-08-18, sezione 128).

    Erano quaranta campi in fila, senza un ordine che volesse dire qualcosa, e
    le cose che cambia ogni settimana stavano sotto quelle che ha impostato una
    volta sola. Adesso sono schede, e la prima e' quella che apre.

    Home per prima perche' e' la pagina che cambia quando arrivano fotografie
    nuove. Poi le altre pagine. Poi le condizioni di vendita, che cambiano
    quando cambia il modo di vendere. Instagram, che si aggiorna a mano ogni
    tanto. Chi siamo, che si scrive una volta. Avanzate per ultima: li' dentro
    non c'e' niente che debba toccare in una settimana normale.
  */
  groups: [
    {name: 'home', title: 'La home', default: true},
    {name: 'pagine', title: 'Le pagine'},
    {name: 'negozio', title: 'Spedizioni e ordini'},
    {name: 'instagram', title: 'Instagram'},
    {name: 'chi', title: 'Chi siamo'},
    {name: 'avanzate', title: 'Avanzate'},
  ],
  fields: [
    defineField({
      name: 'instagramUrl',
      group: 'instagram',
      title: 'Instagram',
      type: 'url',
      initialValue: 'https://www.instagram.com/aleksandercecco',
    }),
    defineField({
      name: 'contactEmail',
      group: 'negozio',
      title: 'Email di contatto',
      type: 'string',
      description:
        "L'indirizzo a cui scrivono i visitatori. Mostrato sul sito. / The address visitors write to. Shown on the site.",
      // SUPPLIED by the owner 2026-08-03. The placeholder that stood here for
      // two days is gone; a new project starts empty rather than starting with
      // a fake address that has to be remembered about.
      initialValue: 'aleksandercecco@gmail.com',
      validation: (Rule) => [
        Rule.email(),
        /*
          The example.com guard stays, and it is not dead code: it is what makes
          a placeholder impossible to ship if anyone ever types one in again.
          It cost the top slot on the launch checklist for two days.
        */
        Rule.custom((value) =>
          typeof value === 'string' && /@example\.(com|org|net)$/i.test(value.trim())
            ? 'That is a placeholder address. The site will refuse to link it.'
            : true,
        ).warning(),
      ],
    }),
    /*
      THE HOME SEQUENCE, revised 2026-08-02 (DESIGN-PLAN section 21). The page
      is now a descent with five movements, and these fields are four of them:

        1. openingMedia    the arrival. one photograph, the whole screen.
        2. homeStatement   who the brand is, in three lines.
        3. homeSequence    the pieces on people, scrolled sideways.
        4. makingMedia +
           makingStatement the work behind them.
        5. (the collections and the footer follow, from their own documents)
    */
    defineField({
      name: 'openingMedia',
      group: 'home',
      title: 'Fotografia di apertura',
      type: 'media',
      description:
        "La prima cosa che si vede: una fotografia a tutto schermo, non la firma. Scegliere un'immagine verticale, alta almeno 2000px, con la parte alta uniforme (chiara o scura) perche' la firma e il MENU ci passano sopra. / The first thing seen: one full-screen photograph, not the signature. Choose a vertical frame, at least 2000px tall, with an even top band (either light or dark) because the signature and MENU sit over it.",
    }),
    /*
      HIS OPENING LINES (2026-08-12, section 99). Three short lines over the
      first photograph, approved and verbatim from his own document. They used
      to be borrowed from the current drop's statement, which meant the home
      page's first words changed whenever a drop did and were never written for
      that screen.
    */
    defineField({
      name: 'openingLines',
      group: 'home',
      title: 'Righe di apertura',
      type: 'localeText',
      description:
        "Le tre righe sulla prima fotografia. Vanno a capo come le scrivi.",
    }),
    /*
      THE THREE REASONS (section 99). His replacement for THE MAKING: three
      titled passages, in his order and his words. An array rather than one
      text field because each has a heading he chose — OUR SKINS, REASONS,
      REBORN — and a heading is not punctuation.
    */
    defineField({
      name: 'philosophy',
      group: 'home',
      title: 'Le tre ragioni',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reason',
          fields: [
            defineField({name: 'title', title: 'Titolo', type: 'string'}),
            defineField({name: 'text', title: 'Testo', type: 'localeText'}),
          ],
          preview: {select: {title: 'title', subtitle: 'text.en'}},
        }),
      ],
      description:
        'Titolo e testo, nel suo ordine. Sostituisce il vecchio blocco THE MAKING.',
    }),
    defineField({
      name: 'homeStatement',
      group: 'home',
      title: 'Chi siamo, in breve (home)',
      type: 'localeText',
      description:
        "Due o tre righe brevi, non un paragrafo. Gli a capo contano: ogni riga va a capo sulla pagina.",
    }),
    /*
      THE ORDER OF THE BAND IS THIS LIST, and nothing else (2026-08-10).

      It always was — a Sanity array is dragged into order — but nothing said
      so, and a sequence whose control is invisible gets changed by asking a
      developer. That is the failure being fixed here: the owner resequences his
      own photographs by dragging, and the page follows on the next publish.

      There is deliberately NO separate number field. Two places that both claim
      to hold the order is how they end up disagreeing, and the drag order is
      the one the reader actually sees.
    */
    defineField({
      name: 'homeSequence',
      group: 'home',
      title: 'Addosso: i capi indossati',
      type: 'array',
      of: [{type: 'homeTile'}],
      description:
        "La fascia orizzontale a meta' home. Fotografie di persone che indossano i capi: si scorre di lato, niente frecce e niente puntini. Da quattro a sei. Collegare ogni fotografia al suo capo, dove esiste. L'ORDINE E' QUESTO ELENCO: trascina le fotografie per riordinarle, la prima in alto e' quella piu' a sinistra nella fascia. / The horizontal band halfway down the home page. Photographs of people wearing the pieces: it scrolls sideways, with no arrows and no dots. Four to six. Link each frame to its piece where one exists. THE ORDER IS THIS LIST: drag the photographs to reorder them; the first from the top is the leftmost frame in the band.",
      validation: (Rule) =>
        Rule.max(8).warning('More than eight is a long sideways scroll; four to six reads best.'),
    }),
    defineField({
      name: 'makingMedia',
      group: 'home',
      title: 'Le foto del lavoro, nella home',
      type: 'array',
      of: [{type: 'media'}],
      description:
        "Due o tre fotografie del lavoro: la pelle grezza, il banco, le mani. Non i capi finiti, che si vedono gia' sopra. / Two or three photographs of the work: the raw hide, the bench, the hands. Not finished garments, which are already shown above.",
      validation: (Rule) => Rule.max(4).warning('Two or three frames say it; more turns a claim into a gallery.'),
    }),
    defineField({
      name: 'makingStatement',
      group: 'home',
      title: 'La lavorazione, il testo',
      type: 'localeText',
      description:
        'Una o due righe brevi sul come sono fatti i capi.',
    }),
    /*
      WHICH LANGUAGES CARRY THE OWNER'S OWN VOICE (2026-08-02).

      He wrote the brand text in English. The Italian on the site is our
      translation of it, and Italian is the DEFAULT locale, so most visitors
      read a version he has never approved. That has to be visible.

      Ticking a language here says: the brand copy in this language is his, as
      he wrote it. Untick it and every brand text in that language is marked on
      the site as an unapproved translation. It is not a draft: the brand knows
      what it says, it said it in English, and only the wording is ours.

      This replaced a single homeCopyIsDraft boolean, which could not tell the
      two apart and would have labelled his own English an unapproved draft.
    */
    defineField({
      name: 'approvedLanguages',
      group: 'avanzate',
      title: 'Lingue approvate dal titolare',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Italiano', value: 'it'},
          {title: 'English', value: 'en'},
        ],
        layout: 'grid',
      },
      description:
        "Spuntare una lingua quando i testi del marchio in quella lingua sono parole del titolare. Le lingue non spuntate vengono mostrate sul sito come traduzione non approvata. / Tick a language when the brand texts in it are the owner's own words. Languages left unticked are shown on the site as an unapproved translation.",
      initialValue: ['en'],
    }),
    /*
      Copy WE wrote, in every language, which no approved language can fix. Only
      the two footer lines are ours now; the rest of the brand voice is his.
    */
    defineField({
      name: 'footerCopyIsDraft',
      group: 'avanzate',
      title: 'Righe del fondo pagina non approvate',
      type: 'boolean',
      description:
        "Acceso finche' il titolare non approva le due righe che abbiamo scritto noi in fondo alla pagina (spedizioni, origine). / On until the owner approves the two footer lines we wrote (shipping, origin).",
      initialValue: true,
    }),
    defineField({
      name: 'aboutMedia',
      group: 'pagine',
      title: 'Fotografie di Chi siamo',
      type: 'array',
      of: [{type: 'media'}],
      description:
        'Immagini di processo e materiale, alternate al testo.',
    }),
    /*
      THE DESIGNER. A buyer sending EUR 1,500 to one person they have never met
      needs to see that person (DESIGN-PLAN sections 32 and 41). This is not the
      about page: that is the brand's story, this is who makes it.
    */
    /*
      THE TWO CREATORS (2026-08-04). The brand is two people and he named them
      in his own approved text, so {DESIGNER_BIOGRAPHY} is answered and the
      about page is built around a partnership rather than a single designer.
    */
    defineField({
      name: 'creators',
      group: 'chi',
      title: 'Chi fa i capi',
      type: 'array',
      of: [{type: 'string'}],
      description:
        "I nomi, come li ha scritti lui.",
    }),
    defineField({
      name: 'partnerName',
      group: 'chi',
      title: 'In collaborazione con',
      type: 'string',
    }),
    defineField({
      name: 'partnerUrl',
      group: 'chi',
      title: 'Link del partner',
      type: 'url',
    }),
    defineField({
      name: 'designerPortrait',
      group: 'chi',
      title: 'Il ritratto',
      type: 'media',
      description:
        "Una fotografia di chi fa le Creature, meglio se al lavoro.",
    }),
    defineField({
      name: 'designerText',
      group: 'chi',
      title: 'Chi lo fa: il testo',
      type: 'localeText',
      description:
        "Parole sue. Lasciare vuoto finche' non le ha scritte: la pagina mostra un segnaposto invece di inventare una biografia. / His own words. Leave empty until he has written them: the page shows a placeholder rather than inventing a biography.",
    }),
    defineField({
      name: 'aboutOpeningMedia',
      group: 'pagine',
      title: 'Chi siamo: fotografia di apertura',
      type: 'media',
      description:
        "La prima schermata della pagina, a tutto schermo, con una sola riga sopra.",
    }),
    defineField({
      name: 'contactMedia',
      group: 'pagine',
      title: 'Contatti: la fotografia',
      type: 'media',
      description:
        "Una sola fotografia, accanto ai contatti. Se resta vuota il sito ne sceglie una da solo e la scelta resta segnata come nostra (contactFrame).",
    }),
    defineField({
      name: 'aboutOpeningLine',
      group: 'pagine',
      title: 'Chi siamo: la riga di apertura',
      type: 'localeString',
      description:
        "Una frase sola, sopra la fotografia di apertura. Breve.",
    }),
    defineField({
      name: 'about',
      group: 'chi',
      title: 'La storia del marchio',
      type: 'localeText',
      description:
        "La storia del marchio, per intero. Una riga vuota separa i paragrafi, e ogni paragrafo prende una schermata di testo fra le fotografie. Righe e paragrafi vengono rispettati.",
    }),
    /*
      Turned OFF on 2026-08-02: the story is now the owner's own text, so it is
      no longer a draft in any language. What remains is the translation
      question, which approvedLanguages answers on its own.

      The field stays because the distinction it makes is still real: it means
      "these words are ours, not his". Turn it back on the day anyone writes
      brand story copy on the owner's behalf again.
    */
    defineField({
      name: 'aboutIsDraft',
      group: 'avanzate',
      title: 'La storia e stata scritta da noi',
      type: 'boolean',
      description:
        "Acceso solo se il testo NON e del titolare. Il sito lo marca come bozza in tutte le lingue. Per la sola questione della traduzione usare invece le lingue approvate. / On only when the text is NOT the owner's. The site then marks it as a draft in every language. For the translation question alone, use the approved languages field instead.",
      initialValue: false,
    }),
    /*
      SHIPPING, IN THREE PIECES, because they have three different standings and
      one field could not tell them apart (2026-08-03).

      1. shippingFree     HIS OWN FACT and his own words. Unmarked.
      2. shippingReturns  the returns rule: his facts, our wording. Marked as
                          ours, as it always has been.
      3. (deleted 2026-08-12, section 104: the customs line said who pays
                          duties outside the EU, which is a term of sale nobody
                          has checked since the shop changed twice)
                          than copy.
    */
    defineField({
      name: 'shippingFree',
      group: 'negozio',
      title: 'Spedizione gratuita',
      type: 'localeText',
      description:
        "Parole del titolare. Una riga. / The owner's own words. One line.",
    }),
    defineField({
      name: 'shippingReturns',
      group: 'negozio',
      title: 'Spedizioni e resi',
      type: 'localeText',
    }),
    /*
      THE CUSTOMS LINE WAS DELETED ON 2026-08-12 (section 104), not confirmed.

      It said who normally pays duties outside the EU. That is a CONDITION OF
      SALE, it carried an unconfirmed flag for a fortnight, and the shop changed
      twice in two days underneath it. The site now states only what is
      certainly true — worldwide shipping, free over 500 euro, and a return
      arranged by writing — and says nothing about duties or withdrawal until
      the lawyer answers question 1 of the brief.

      If it comes back it comes back as a NEW fact with a new flag, and it
      belongs in the terms of sale rather than on a contact page.
    */
    defineField({
      name: 'footerShipping',
      group: 'negozio',
      title: 'Fondo pagina: spedizioni',
      type: 'localeText',
      description:
        "Una riga sola. Nessuna promessa di tempi o costi finche' non sono decisi. / One line only. No promise about timing or cost until those are decided.",
    }),
    defineField({
      name: 'footerOrigin',
      group: 'negozio',
      title: 'Fondo pagina: dove nasce',
      type: 'localeText',
      description: 'Una riga sola.',
    }),
    /*
      Ambient sound. The field exists so the file has somewhere to live; the
      player is deliberately not built yet (DESIGN-PLAN section 15).

      It cannot autoplay. Every current browser blocks audio that starts without
      a user gesture, and a site that tried would simply be muted by the
      browser, or worse, would surprise someone scrolling in public. So it is
      opt-in from a small corner control, off by default.
    */
    /*
      Interface and brand copy WE wrote, listed rather than shown. Same rule as
      `inventedFields` on a Creature: invisible to a visitor, and the launch
      check refuses while anything is here (DESIGN-PLAN section 59).
    */
    /*
      SOLVET ET COAGULA, the process (2026-08-03). His own folder, his own name
      for it, and the one part of the site that shows the work being done rather
      than finished. The text is his making lines, already on the site; the
      frames carry no captions, because naming each stage would be our words
      laid over his process.
    */
    /*
      INSTAGRAM, CURATED RATHER THAN LIVE (2026-08-03).

      A live feed needs the Graph API, a Business account, an app and a
      long-lived token that must be refreshed every sixty days: free in money,
      and it empties itself silently the first time nobody refreshes it. Every
      embed widget is a third-party script, which standing rules 4 and 13 rule
      out. So he drops three to six frames here and they link to his profile.
      Nothing expires, nothing scripts, nothing costs.
    */
    defineField({
      name: 'instagramFrames',
      group: 'instagram',
      title: 'Instagram: i riquadri',
      type: 'array',
      of: [{type: 'instagramFrame'}],
      description:
        "Fino a sei. Sul sito diventano QUADRATI: sposta il punto focale (hotspot) sulla fotografia per decidere cosa sopravvive al quadrato. Ogni riquadro puo portare al suo post; vuoto, porta al profilo. Non e un feed automatico: le scegli tu. / Up to six. They render SQUARE on the site: set the photograph's hotspot to decide what survives the square. Each frame can link to its own post; empty, it links to the profile. Not an automatic feed: you choose them.",
      validation: (Rule) => Rule.max(6).warning('More than six stops being a selection.'),
    }),
    /*
      THE PROCESS PAGE HAD NO WORDS (2026-08-11, section 81). It carried the
      formula, his three lines about the making, and then eight photographs.
      A reader was shown the work and never told what they were looking at.

      This is OURS and flagged: it names the stages the photographs actually
      show, in his register, and claims nothing he has not said. When he writes
      his own account of the process it replaces this and the flag comes off.
    */
    defineField({
      name: 'processText',
      group: 'pagine',
      title: 'Il processo, il testo',
      type: 'localeText',
      description:
        "Che cosa succede, per fasi, nell'ordine del lavoro. Poche righe brevi: le fotografie fanno il resto. / What happens, stage by stage, in the order of the work. A few short lines: the photographs do the rest.",
    }),
    defineField({
      name: 'processMedia',
      group: 'pagine',
      title: 'Le foto della pagina Processo',
      type: 'array',
      of: [{type: 'media'}],
      description:
        "Le fotografie del lavoro in corso, nell'ordine del processo: cartamodello, taglio, tintura, asciugatura, montaggio. Senza didascalie. / Photographs of the work in progress, in the order of the process: pattern, cut, dye, dry, build. No captions.",
    }),
    /*
      I CAPI RITAGLIATI SU FONDO CHIARO — la terza specie di immagine, e la
      sola che mancava (2026-08-12, sezione 116).

      Le pagine di racconto dei riferimenti mettono nella stessa riga: un
      paragrafo, UN CAPO RITAGLIATO SU FONDO CHIARO, e una fotografia larga del
      lavoro. Il sito aveva le prime due. Questa e' la terza.

      ATTENZIONE, e vale piu' di ogni altra nota in questo file: un programma
      che toglie lo sfondo RIDISEGNA. Su sei figure provate, tre sono tornate
      cambiate — l'orlo grezzo raddrizzato, la cerniera senza denti, la
      pelliccia rifatta a ciuffi. Ogni ritaglio va confrontato con la
      fotografia da cui viene, ALL'ORLO, prima di entrare qui.
      Vedi docs/SURVEY-MATERIALE-NUOVO.md.

      THE PIECES CUT OUT ON PALE GROUND — the third kind of image, and the only
      one that was missing. A background-removal tool REDRAWS: three of six
      figures came back altered. Compare every cut-out with its source
      photograph AT THE HEM before it goes in here.
    */
    defineField({
      name: 'cutoutMedia',
      group: 'home',
      title: 'Capi ritagliati su fondo chiaro',
      type: 'array',
      of: [{type: 'homeTile'}],
      description:
        'Un capo per fotografia, ritagliato, su fondo chiaro. Collega ogni ritaglio al suo capo, cosi\' chi lo tocca ci arriva. ' +
        'L\'ORDINE DECIDE DOVE VANNO: il PRIMO della lista compare nella home, tutti gli altri nella pagina Processo. ' +
        'Trascina per spostarli. ' +
        'PRIMA DI CARICARE: confronta il ritaglio con la fotografia originale sull\'orlo. Se lo scontorno ha raddrizzato l\'orlo, ' +
        'non caricarlo: sarebbe un capo che non hai mai fatto.',
    }),
    /*
      IL RACCONTO NELLE COLONNE (2026-08-13, sezione 118).

      Righe brevi che stanno DENTRO il mosaico, in colonna, accanto alle
      fotografie — non un blocco di testo prima o dopo. E' cosi' che scrivono i
      riferimenti: il materiale, da dove viene, cosa gli succede, e una cosa che
      non e' ancora risolta. Mai un aggettivo sul marchio.

      SONO NOSTRE. Le sue frasi restano intoccate e restano le prime: queste
      stanno accanto, non al posto loro. Finche' sono segnate in `inventedCopy`
      il sito non puo' aprire. Riscrivile con le tue parole e togli la spunta.

      THE NARRATIVE IN THE COLUMNS. Short lines that live INSIDE the mosaic,
      beside the photographs, in the reference's own manner: the material, where
      it comes from, what happens to it, and one thing not yet solved. Never an
      adjective about the brand. OURS, and flagged as ours; his sentences stay
      untouched and stay first.
    */
    defineField({
      name: 'aboutNotes',
      group: 'pagine',
      title: 'Chi siamo: le righe nel mosaico',
      type: 'array',
      of: [{type: 'mosaicNote'}],
      description:
        "Da due a quattro. Brevi. Vanno in colonna, accanto alle fotografie.",
      validation: (Rule) => Rule.max(5).warning('More than five and the page becomes an essay.'),
    }),
    defineField({
      name: 'processNotes',
      group: 'pagine',
      title: 'Processo: le righe nel mosaico',
      type: 'array',
      of: [{type: 'mosaicNote'}],
      description:
        "Da tre a cinque. Il materiale, la lavorazione, cosa ne esce.",
      validation: (Rule) => Rule.max(6).warning('More than six and the page becomes an essay.'),
    }),
    /*
      QUANTE COSE SI VEDONO, E QUALE FOTOGRAFIA APRE (2026-08-18, sezione 128).

      Erano tre numeri e una scelta scritti nel codice: sei capi nella pagina
      del drop, cinque in un capitolo di collezione, e la fotografia in cima a
      Processo scelta da una regola invece che da lui. Sono decisioni
      editoriali, non di struttura, quindi stanno qui.

      Restano OPZIONALI: vuoto vuol dire "come adesso". Un numero fuori scala
      farebbe una pagina lunghissima, quindi sono limitati piuttosto che liberi.
    */
    defineField({
      name: 'newDropCount',
      title: 'Quanti capi si vedono nella pagina del drop',
      type: 'number',
      group: 'pagine',
      description:
        'La pagina del drop e\' un annuncio, non un secondo negozio: fa vedere qualche capo e poi manda al catalogo. ' +
        'Adesso sono sei. Alzandolo diventa una copia del catalogo; abbassandolo sotto tre non si capisce cos\'e\' il drop. ' +
        'Lascia vuoto per tenere sei.',
      validation: (Rule) => Rule.min(2).max(12).integer(),
    }),
    defineField({
      name: 'chapterCount',
      title: 'Quanti capi si vedono dentro una collezione',
      type: 'number',
      group: 'pagine',
      description:
        'Ogni capo qui occupa uno schermo intero. Adesso sono cinque: cinque si guardano fino in fondo, quindici si scorrono via. ' +
        'Gli altri restano nel catalogo, con il link che dice quanti sono. Lascia vuoto per tenere cinque.',
      validation: (Rule) => Rule.min(2).max(12).integer(),
    }),
    defineField({
      name: 'processPairMedia',
      title: 'La fotografia in cima alla pagina Processo',
      type: 'media',
      group: 'pagine',
      description:
        'Sta accanto al testo, in alto, prima di tutte le altre. Se la lasci vuota il sito ne sceglie una da solo, ' +
        'ma sceglie a caso fra quelle che avanzano: mettila tu se vuoi decidere con cosa si apre.',
    }),
    defineField({
      name: 'inventedCopy',
      group: 'avanzate',
      title: 'Testi scritti da noi, da approvare',
      type: 'array',
      of: [{type: 'string'}],
      /*
        UNA SOLA VOCE QUI NON È UN TESTO NOSTRO: è una MODIFICA al suo.
        Registrata per intero perché possa essere rimessa com'era senza cercare
        altrove. / One entry here is not copy of ours: it is an EDIT to his.
        Recorded in full so it can be put back without hunting for it.
      */
      description:
        '«Su Misura» / «Made to Measure» è stato TOLTO dal testo approvato il 13/08/2026, perché dal 12/08 il negozio non vende più su misura e la frase era falsa. ' +
        'Diceva: «In pelle 100% conciata al vegetale, Su Misura, fatta a mano nel Sud Italia.» e «In 100% vegetable-tanned leather, Made to Measure, handmade in South Italy.» ' +
        'Due parole tolte, nulla aggiunto. Togli la spunta a «aboutMadeToMeasure» quando approvi la frase più corta, o rimettila com\'era. / ' +
        '"Su Misura" / "Made to Measure" was REMOVED from the approved text on 2026-08-13, because the shop stopped selling made to measure on 2026-08-12 and the sentence was false. ' +
        'Two words deleted, nothing added. Untick "aboutMadeToMeasure" when you approve the shorter line, or put it back.',
      options: {
        list: [
          {title: 'Fondo pagina: spedizioni', value: 'footerShipping'},
          {title: 'Fondo pagina: origine', value: 'footerOrigin'},
          {title: 'Spedizioni e resi', value: 'shippingReturns'},
          {title: 'Home: le righe di sezione', value: 'homeLines'},
          {title: 'Richiesta: i testi', value: 'enquiryCopy'},
          {title: 'Disponibilita: la spiegazione', value: 'availabilityCopy'},
          {title: 'Instagram: quali fotografie', value: 'instagramFrames'},
          {title: 'Ordine: il disegno delle misure', value: 'measureDiagram'},
          {title: 'Processo: il testo delle fasi', value: 'processText'},
          {title: 'Shop: la riga di apertura', value: 'shopIntro'},
          {title: 'Drops: la riga di apertura', value: 'dropsIntro'},
          {title: 'Contatti: la riga di apertura', value: 'contactIntro'},
          {title: 'Contatti: quale fotografia', value: 'contactFrame'},
          {
            title: 'Contatti: dove siamo e dove si compra',
            value: 'contactCopy',
          },
          {title: 'Chi siamo: la traduzione delle origini', value: 'aboutOrigin'},
          {title: "Chi siamo: l'ordine dei nomi, modificato dal testo approvato / About: name order, edited from approved text", value: 'aboutNameOrder'},
          {title: "Pagina prodotto: la riga sul su misura", value: 'madeToMeasureLine'},
          {
            title:
              'Chi siamo e Processo: «Su Misura» tolto dal testo approvato / About and Process: "Made to Measure" removed from approved text',
            value: 'aboutMadeToMeasure',
          },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'ambientAudio',
      group: 'avanzate',
      title: 'Suono ambiente',
      type: 'file',
      description:
        "Facoltativo. Un file audio breve, in loop, che il visitatore puo' accendere da un piccolo comando nell'angolo. NON parte da solo: i browser bloccano l'audio automatico, quindi resta spento finche' non lo si accende. Rimane spento per chi ha chiesto di ridurre le animazioni. / Optional. A short looping audio file the visitor can switch on from a small corner control. It does NOT start on its own: browsers block automatic audio, so it stays off until switched on. It stays off for anyone who has asked for reduced motion.",
      options: {accept: 'audio/mpeg,audio/mp4,audio/ogg,audio/wav'},
    }),
    // One file only. The supplied signature SVG paints with currentColor, so it
    // inverts with the page and serves both polarities. See DESIGN-PLAN.md
    // section 3.
    defineField({
      name: 'logo',
      group: 'avanzate',
      title: 'La firma',
      type: 'image',
      description:
        'Un solo file. La firma SVG usa currentColor e si inverte con la pagina, quindi vale sia per il bianco sia per il nero.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Impostazioni'}
    },
  },
})

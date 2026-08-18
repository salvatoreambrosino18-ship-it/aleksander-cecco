/*
  I TESTI LEGALI, VERBATIM. Written by a lawyer for Cecco Trading SRLS, version
  1.0 of 17 August 2026. The source of record is docs/TESTI-LEGALI.md and this
  file is its transcription, word for word.

  NOTHING IN HERE IS OURS AND NOTHING IN HERE IS EDITABLE. Not by us, not from
  the studio. Every other sentence on this site is either the owner's or ours
  and can be rewritten in an afternoon; these four documents are a legal
  instrument, and a shop that quietly reworded its own terms of sale after a
  buyer agreed to them has done something worse than a typo. When they change,
  the lawyer sends a new version, it lands in docs/, it is transcribed here,
  and the version line changes with it.

  WHY NOT SANITY, and this is the second exception after the company line.
  Sanity is where the owner writes. He must not be able to edit these, empty
  these, or half-translate these, and an empty field here would render as a
  placeholder mark on a page whose entire purpose is to be the binding text.

  THE HOUSE RULES YIELD TO THE LAWYER, all of them:

  - NO COLONS AND NO DASHES (section 134) does not apply here. That rule was
    about the brand's voice, and these are not in the brand's voice. The
    colons, semicolons and en dashes below are the lawyer's punctuation and
    they stay.
  - THE DRAFT MARKS do not apply either. Every unapproved sentence on this
    site carries a mark saying we wrote it; these were written by the company's
    own lawyer and signed by its legal representative, so a mark would be a lie
    in the opposite direction.
  - THE TWO LANGUAGES ARE NOT TRANSLATIONS OF EACH OTHER in the usual sense.
    The lawyer wrote both, each as an original, and neither is marked as a
    translation of the other.

  THE SIGNATURE BLOCK IS NOT HERE, and it is the one thing in the source file
  that does not get published. Each document in docs/ ends with «Per Cecco
  Trading SRLS / Il Legale Rappresentante / Nome e cognome: Ciro Cecco / Firma:
  ______ / Data: 17 agosto 2026» and a note that the signature must be applied
  by hand. That is the execution block of the paper original. Rendering it on a
  web page would print a blank signature line in public, which displays the
  document as UNSIGNED — the opposite of what it is for. What the page carries
  instead is the version and the date, which is how a published legal text
  identifies itself. The signed original stays with the company. Raised with
  the client on 2026-08-17 rather than decided quietly.
*/
import type {Locale} from "../lib/locales";

export type LegalSection = {
  /** The lawyer's own numbering, kept so a reader can cite a clause. */
  n?: string;
  title?: string;
  body: string[];
};

export type LegalDoc = {
  title: string;
  version: string;
  sections: LegalSection[];
};

/** The version every published document carries, from the source file. */
export const LEGAL_VERSION = "1.0";
export const LEGAL_DATE = {it: "17 agosto 2026", en: "17 August 2026"} as const;

/* ------------------------------------------------------ privacy notice */

const privacy: Record<Locale, LegalDoc> = {
  it: {
    title: "Informativa sul trattamento dei dati personali",
    version: "Ultimo aggiornamento: 17 agosto 2026",
    sections: [
      {
        n: "1",
        title: "Titolare del trattamento",
        body: [
          "Il titolare del trattamento è Cecco Trading SRLS, con sede legale in Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italia, P. IVA 11133331212, PEC ceccotrading@pec.it.",
        ],
      },
      {
        n: "2",
        title: "Quali dati trattiamo",
        body: [
          "Quando l'utente invia una richiesta di acquisto tramite il sito, possiamo trattare il nome, l'indirizzo e-mail, la taglia selezionata ove prevista, i prodotti richiesti, i relativi codici, le quantità, il prezzo dell'ordine e le informazioni eventualmente inserite nella nota libera.",
          "Il sito non richiede né raccoglie misure corporee. Non esiste un account cliente e il sito non raccoglie numeri di carta, credenziali bancarie o altri dati di pagamento.",
        ],
      },
      {
        n: "3",
        title: "Finalità e basi giuridiche",
        body: [
          "I dati sono trattati per ricevere e gestire richieste e ordini, verificare disponibilità e informazioni dell'ordine, rispondere all'utente, organizzare pagamento e consegna, eseguire il contratto o adottare misure precontrattuali richieste dall'interessato, adempiere agli obblighi di legge e accertare, esercitare o difendere diritti del Titolare.",
          "Per tali finalità, il trattamento si fonda, a seconda del caso, sull'esecuzione di misure precontrattuali o del contratto, sull'adempimento di obblighi legali e sul legittimo interesse del Titolare alla tutela dei propri diritti e alla sicurezza del servizio.",
        ],
      },
      {
        n: "4",
        title: "Natura del conferimento",
        body: [
          "Nome, indirizzo e-mail e le informazioni necessarie alla gestione dell'ordine sono necessari per poter dare seguito alla richiesta. Il mancato conferimento impedisce di gestire l'ordine o di fornire il riscontro richiesto.",
        ],
      },
      {
        n: "5",
        title: "Come vengono trattati i dati",
        body: [
          "Il sito non dispone di un database clienti né di un'area riservata. I dati inviati attraverso i moduli vengono trasmessi ai servizi tecnici necessari alla ricezione e all'inoltro della comunicazione e vengono successivamente gestiti dal Titolare tramite i propri strumenti di posta elettronica.",
        ],
      },
      {
        n: "6",
        title: "Destinatari e responsabili del trattamento",
        body: [
          "I dati possono essere trattati, nei limiti necessari alle rispettive funzioni, dai fornitori tecnologici utilizzati dal sito, tra cui Cloudflare per infrastruttura e servizi di rete, Resend per la trasmissione delle e-mail, Google per il servizio di posta elettronica utilizzato dal Titolare e Sanity per la distribuzione di contenuti multimediali. I rapporti con tali fornitori sono disciplinati secondo quanto richiesto dalla normativa applicabile.",
        ],
      },
      {
        n: "7",
        title: "Trasferimenti internazionali",
        body: [
          "Alcuni fornitori possono trattare dati personali al di fuori dello Spazio Economico Europeo. Quando si verifica un trasferimento verso un Paese terzo, il Titolare utilizza il meccanismo di trasferimento previsto dalla normativa applicabile, quale una decisione di adeguatezza, un'adeguata garanzia ai sensi degli artt. 46 o 47 GDPR o, nei casi ammessi, una delle deroghe previste dall'art. 49 GDPR.",
        ],
      },
      {
        n: "8",
        title: "Periodi di conservazione",
        body: [
          "I dati relativi agli ordini e alla relativa documentazione commerciale sono conservati per il periodo necessario alla gestione del rapporto e, successivamente, per il periodo richiesto dagli obblighi civilistici, fiscali e contabili applicabili, nonché per la tutela dei diritti del Titolare. In assenza di un obbligo di conservazione più lungo, la documentazione contrattuale e commerciale è conservata per un periodo massimo ordinario di 10 anni dalla conclusione o dall'ultima attività relativa al rapporto, fatti salvi contenziosi o ulteriori obblighi di legge.",
          "I dati tecnici utilizzati esclusivamente dai controlli antiabuso basati sull'indirizzo IP sono conservati per il tempo necessario al funzionamento dei controlli e, nell'attuale implementazione, non oltre 24 ore.",
        ],
      },
      {
        n: "9",
        title: "Carrello e memoria locale",
        body: [
          "Il carrello utilizza la memoria locale del browser per conservare sul dispositivo dell'utente esclusivamente prodotti, taglie e quantità. Non contiene nome, e-mail o altri dati direttamente identificativi e non viene trasmesso al server fino all'invio dell'ordine. L'utente può cancellare tale memoria tramite le impostazioni del browser.",
        ],
      },
      {
        n: "10",
        title: "Cookie, analytics e profilazione",
        body: [
          "Nella configurazione attuale il sito non utilizza cookie di analisi o pubblicitari, strumenti di profilazione, pixel pubblicitari, sistemi di analytics o account di accesso. Non viene effettuata profilazione commerciale degli utenti tramite il sito.",
        ],
      },
      {
        n: "11",
        title: "Newsletter",
        body: [
          "La funzione newsletter è attualmente disattivata. L'eventuale indirizzo inserito nel relativo campo non viene memorizzato né trasmesso finché la funzione non sarà attivata. L'eventuale attivazione sarà accompagnata dagli adempimenti informativi e di consenso richiesti dalla normativa.",
        ],
      },
      {
        n: "12",
        title: "Diritti dell'interessato",
        body: [
          "L'interessato può esercitare, nei casi previsti dalla normativa, i diritti di accesso, rettifica, cancellazione, limitazione del trattamento, opposizione, portabilità e gli altri diritti previsti dagli artt. 15-22 GDPR. Le richieste possono essere inviate a ceccotrading@pec.it.",
          "L'interessato ha inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali o all'altra autorità di controllo competente.",
        ],
      },
      {
        n: "13",
        title: "Aggiornamenti",
        body: [
          "La presente informativa può essere modificata in caso di variazione dei trattamenti, dei fornitori, del sito o della normativa applicabile. La versione pubblicata sul sito riporterà la data dell'ultimo aggiornamento.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    version: "Last updated: 17 August 2026",
    sections: [
      {
        n: "1",
        title: "Data Controller",
        body: [
          "The data controller is Cecco Trading SRLS, with registered office at Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italy, VAT No. 11133331212, certified email (PEC): ceccotrading@pec.it.",
        ],
      },
      {
        n: "2",
        title: "Personal Data We Process",
        body: [
          "When a user submits a purchase request through the website, we may process the name, email address, selected size where applicable, requested products, product codes, quantities, order price and any information included in the free-text note.",
          "The website does not request or collect body measurements. There is no customer account and the website does not collect card numbers, banking credentials or other payment details.",
        ],
      },
      {
        n: "3",
        title: "Purposes and Legal Bases",
        body: [
          "Personal data are processed to receive and manage requests and orders, verify availability and order information, respond to users, arrange payment and delivery, perform a contract or take pre-contractual steps requested by the data subject, comply with legal obligations, and establish, exercise or defend the Controller's rights.",
          "Depending on the circumstances, the legal basis is performance of pre-contractual measures or a contract, compliance with a legal obligation, or the Controller's legitimate interest in protecting its rights and securing the service.",
        ],
      },
      {
        n: "4",
        title: "Mandatory Data",
        body: [
          "Name, email address and information necessary to process an order are required to handle the request. Failure to provide such information prevents the Company from processing the order or responding to the request.",
        ],
      },
      {
        n: "5",
        title: "Processing",
        body: [
          "The website does not maintain a customer database or user account. Data submitted through the forms are transmitted through the technical services required to receive and forward the communication and are subsequently handled by the Controller through its email systems.",
        ],
      },
      {
        n: "6",
        title: "Recipients and Processors",
        body: [
          "Data may be processed, to the extent necessary, by technology providers used by the website, including Cloudflare for infrastructure and network services, Resend for email transmission, Google for the email service used by the Controller, and Sanity for delivery of multimedia content. The relationships with these providers are governed in accordance with applicable law.",
        ],
      },
      {
        n: "7",
        title: "International Transfers",
        body: [
          "Some providers may process personal data outside the European Economic Area. Where a transfer to a third country occurs, the Controller relies on the transfer mechanism permitted by applicable law, such as an adequacy decision, an appropriate safeguard under Articles 46 or 47 GDPR or, where permitted, a derogation under Article 49 GDPR.",
        ],
      },
      {
        n: "8",
        title: "Retention",
        body: [
          "Order data and related commercial documentation are retained for as long as necessary to manage the relationship and thereafter for the period required by applicable civil, tax and accounting obligations and to protect the Controller's rights. Where no longer retention period is required by law, contractual and commercial documentation is ordinarily retained for a maximum of 10 years from the conclusion or last relevant activity of the relationship, subject to litigation or other legal obligations.",
          "Technical data used solely for IP-based anti-abuse controls are retained only as necessary for those controls and, under the current implementation, for no longer than 24 hours.",
        ],
      },
      {
        n: "9",
        title: "Cart and Local Storage",
        body: [
          "The cart uses browser local storage to keep only products, sizes and quantities on the user's device. It does not contain the user's name, email address or other directly identifying information and is not transmitted to the server until an order is submitted. Users may delete it through browser settings.",
        ],
      },
      {
        n: "10",
        title: "Cookies, Analytics and Profiling",
        body: [
          "In its current configuration, the website does not use analytics or advertising cookies, profiling tools, advertising pixels, analytics systems or login accounts. No commercial profiling is carried out through the website.",
        ],
      },
      {
        n: "11",
        title: "Newsletter",
        body: [
          "The newsletter function is currently disabled. Any address entered in the newsletter field is not stored or transmitted until the function is activated. If activated, the required information and consent mechanisms will be implemented.",
        ],
      },
      {
        n: "12",
        title: "Data Subject Rights",
        body: [
          "Data subjects may exercise, where applicable, the rights of access, rectification, erasure, restriction, objection, portability and other rights provided by Articles 15-22 GDPR. Requests may be sent to ceccotrading@pec.it.",
          "Data subjects may also lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali) or another competent supervisory authority.",
        ],
      },
      {
        n: "13",
        title: "Updates",
        body: [
          "This Privacy Policy may be amended following changes to processing activities, providers, the website or applicable law. The version published on the website will state the date of the latest update.",
        ],
      },
    ],
  },
};

/* -------------------------------------------------------- terms of sale */

const terms: Record<Locale, LegalDoc> = {
  it: {
    title: "Condizioni generali di vendita",
    version: "Versione 1.0 — 17 agosto 2026",
    sections: [
      {
        n: "1",
        title: "Venditore",
        body: [
          "Le presenti condizioni disciplinano gli acquisti effettuati attraverso aleksandercecco.com. Il venditore è Cecco Trading SRLS, con sede legale in Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italia, P. IVA 11133331212, PEC ceccotrading@pec.it.",
        ],
      },
      {
        n: "2",
        title: "Prodotti e disponibilità",
        body: [
          "Aleksander Cecco è un marchio di abbigliamento e accessori artigianali. Le pagine prodotto indicano caratteristiche, materiali, immagini, prezzo e taglie disponibili. Salvo diversa indicazione espressa nella pagina del prodotto, il cliente sceglie una delle taglie standard rese disponibili.",
          "Il sito non offre un servizio di confezione su misura o di personalizzazione individuale. La scelta di una taglia standard non costituisce, di per sé, una personalizzazione individuale del prodotto.",
        ],
      },
      {
        n: "3",
        title: "Invio dell'ordine",
        body: [
          "Il cliente può inviare una richiesta tramite il modulo del singolo prodotto o tramite il carrello. L'invio costituisce una richiesta di acquisto e non comporta automaticamente l'accettazione dell'ordine né l'incasso del prezzo.",
        ],
      },
      {
        n: "4",
        title: "Conferma e conclusione del contratto",
        body: [
          "Il venditore verifica la richiesta e comunica al cliente, tramite e-mail, disponibilità, prezzo applicabile, costi di spedizione, modalità di pagamento, tempi di consegna e ogni altro elemento necessario. Il contratto si conclude quando il venditore comunica l'accettazione dell'ordine al cliente su un supporto durevole, salvo diverso accordo.",
        ],
      },
      {
        n: "5",
        title: "Prezzi",
        body: [
          "I prezzi dei prodotti sono quelli indicati sul sito al momento dell'ordine, salvo errori manifesti. Prima della conclusione del contratto saranno comunicati eventuali costi di spedizione, tasse o altri oneri applicabili.",
        ],
      },
      {
        n: "6",
        title: "Pagamento",
        body: [
          "Il sito non dispone di un sistema di pagamento integrato. Le modalità e i termini di pagamento sono comunicati nella conferma dell'ordine. Il venditore non raccoglie dati di carte di pagamento attraverso il sito.",
        ],
      },
      {
        n: "7",
        title: "Spedizione e consegna",
        body: [
          "Le spedizioni sono effettuate all'indirizzo indicato dal cliente utilizzando, a seconda della destinazione e della disponibilità del servizio, corrieri internazionali quali DHL o UPS. I tempi di spedizione e consegna applicabili all'ordine sono indicati nella conferma dell'ordine.",
          "Il venditore non risponde dei ritardi imputabili esclusivamente al vettore, alle autorità doganali o a eventi fuori dal ragionevole controllo del venditore, fermo restando ogni diritto inderogabile del consumatore.",
        ],
      },
      {
        n: "8",
        title: "Spedizioni internazionali",
        body: [
          "Per destinazioni al di fuori dell'Unione Europea possono applicarsi dazi, imposte, oneri doganali o altri costi di importazione. La loro eventuale applicazione e la relativa imputazione saranno indicate nella conferma dell'ordine in base alla destinazione e alle condizioni di spedizione.",
        ],
      },
      {
        n: "9",
        title: "Diritto di recesso",
        body: [
          "Quando il cliente agisce in qualità di consumatore e il diritto di recesso è previsto dalla legge, il consumatore può recedere dal contratto a distanza entro 14 giorni dal giorno in cui acquisisce il possesso fisico del prodotto, senza dover indicare una motivazione, fatte salve le eccezioni previste dalla legge.",
        ],
      },
      {
        n: "10",
        title: "Eccezioni al recesso",
        body: [
          "Il diritto di recesso è escluso esclusivamente nei casi previsti dalla legge, tra cui la fornitura di beni realizzati secondo specifiche del consumatore o chiaramente personalizzati. La sola selezione di una taglia standard disponibile sul sito, senza misure individuali o altre modifiche richieste dal cliente, non è qualificata automaticamente come personalizzazione ai fini dell'esclusione del recesso.",
        ],
      },
      {
        n: "11",
        title: "Esercizio del recesso",
        body: [
          "Il consumatore deve comunicare la decisione di recedere prima della scadenza del termine, mediante dichiarazione esplicita inviata a ceccotrading@pec.it o con altro mezzo idoneo a dimostrare la comunicazione. Il consumatore può utilizzare il modulo tipo riportato alla fine del presente documento.",
        ],
      },
      {
        n: "12",
        title: "Restituzione",
        body: [
          "Il prodotto deve essere restituito senza indebito ritardo e comunque entro 14 giorni dalla comunicazione del recesso. Salvo che il venditore abbia accettato di sostenerlo o la legge disponga diversamente, il costo diretto della restituzione è a carico del consumatore.",
        ],
      },
      {
        n: "13",
        title: "Rimborso",
        body: [
          "In caso di recesso valido, il venditore rimborsa i pagamenti ricevuti, compresi i costi della consegna standard eventualmente dovuti, entro i termini previsti dalla legge. Il rimborso può essere trattenuto fino alla ricezione del prodotto o fino a quando il consumatore dimostri di averlo rispedito, se tale momento è anteriore.",
        ],
      },
      {
        n: "14",
        title: "Uso e diminuzione di valore",
        body: [
          "Il consumatore può manipolare e provare il prodotto nella misura necessaria a verificarne natura, caratteristiche e funzionamento, come potrebbe fare in un negozio. Un utilizzo eccedente tale verifica può comportare responsabilità per la diminuzione di valore nei limiti previsti dalla legge.",
        ],
      },
      {
        n: "15",
        title: "Garanzia legale di conformità",
        body: [
          "Restano integralmente applicabili le norme inderogabili sulla garanzia legale di conformità dei beni di consumo e gli altri rimedi previsti dalla legge. La garanzia legale è distinta dal diritto di recesso.",
        ],
      },
      {
        n: "16",
        title: "Proprietà intellettuale",
        body: [
          "Il nome Aleksander Cecco, i marchi, testi, fotografie, video, disegni, elementi grafici e altri contenuti del sito sono protetti dalla normativa applicabile. È vietata la riproduzione o utilizzazione non autorizzata, salvo quanto consentito dalla legge.",
        ],
      },
      {
        n: "17",
        title: "Legge applicabile e tutela del consumatore",
        body: [
          "I contratti con consumatori sono disciplinati dalla legge applicabile, comprese le disposizioni inderogabili a tutela dei consumatori del Paese di residenza del consumatore quando applicabili. Nulla nelle presenti condizioni limita i diritti inderogabili riconosciuti al consumatore dalla legge.",
        ],
      },
      {
        n: "18",
        title: "Contatti",
        body: ["Per ordini, assistenza, recesso e comunicazioni: ceccotrading@pec.it."],
      },
    ],
  },
  en: {
    title: "General Terms and Conditions of Sale",
    version: "Version 1.0 — 17 August 2026",
    sections: [
      {
        n: "1",
        title: "Seller",
        body: [
          "These terms govern purchases made through aleksandercecco.com. The seller is Cecco Trading SRLS, with registered office at Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italy, VAT No. 11133331212, PEC: ceccotrading@pec.it.",
        ],
      },
      {
        n: "2",
        title: "Products and Availability",
        body: [
          "Aleksander Cecco is a brand offering handcrafted clothing and accessories. Product pages describe characteristics, materials, images, price and available sizes. Unless expressly stated otherwise, customers select one of the standard sizes offered for the product.",
          "The website does not offer bespoke or individually customised production. Selecting a standard size does not, by itself, constitute individual personalisation of the product.",
        ],
      },
      {
        n: "3",
        title: "Placing an Order",
        body: [
          "Customers may submit a request through an individual product form or through the cart. Submission constitutes a purchase request and does not automatically constitute acceptance or payment.",
        ],
      },
      {
        n: "4",
        title: "Confirmation and Contract Formation",
        body: [
          "The Seller reviews the request and communicates by email the applicable availability, price, shipping charges, payment method, delivery timing and other information required. The contract is concluded when the Seller communicates acceptance to the customer on a durable medium, unless otherwise agreed.",
        ],
      },
      {
        n: "5",
        title: "Prices",
        body: [
          "Product prices are those displayed on the website at the time of the order, except in cases of manifest error. Any applicable shipping charges, taxes or other charges will be communicated before the contract is concluded.",
        ],
      },
      {
        n: "6",
        title: "Payment",
        body: [
          "The website does not currently provide an integrated payment system. Payment method and timing are communicated in the order confirmation. The Seller does not collect payment-card details through the website.",
        ],
      },
      {
        n: "7",
        title: "Shipping and Delivery",
        body: [
          "Orders are shipped to the address provided by the customer using, depending on destination and service availability, international carriers such as DHL or UPS. Applicable shipping and delivery timing is stated in the order confirmation.",
          "The Seller is not responsible for delays attributable exclusively to the carrier, customs authorities or events beyond the Seller's reasonable control, without prejudice to mandatory consumer rights.",
        ],
      },
      {
        n: "8",
        title: "International Shipping",
        body: [
          "For destinations outside the European Union, customs duties, taxes, import charges or other destination-country costs may apply. Their possible application and allocation will be stated in the order confirmation according to destination and applicable shipping terms.",
        ],
      },
      {
        n: "9",
        title: "Right of Withdrawal",
        body: [
          "Where the customer acts as a consumer and withdrawal is required by law, the consumer may withdraw from a distance contract within 14 days from the day on which the consumer acquires physical possession of the goods, without giving a reason, subject to statutory exceptions.",
        ],
      },
      {
        n: "10",
        title: "Exceptions to Withdrawal",
        body: [
          "Withdrawal is excluded only in cases provided by law, including the supply of goods made to the consumer's specifications or clearly personalised. The mere selection of a standard size available on the website, without individual measurements or other customer-requested modifications, is not automatically treated as personalisation for purposes of excluding withdrawal.",
        ],
      },
      {
        n: "11",
        title: "Exercising Withdrawal",
        body: [
          "The consumer must communicate the decision to withdraw before the deadline by sending an unequivocal statement to ceccotrading@pec.it or by another method capable of evidencing the communication. The statutory model form included at the end of this document may be used.",
        ],
      },
      {
        n: "12",
        title: "Return",
        body: [
          "The goods must be returned without undue delay and in any event within 14 days from the withdrawal notice. Unless the Seller has agreed to bear the cost or applicable law provides otherwise, the direct cost of return is borne by the consumer.",
        ],
      },
      {
        n: "13",
        title: "Refund",
        body: [
          "Where withdrawal is validly exercised, the Seller will reimburse payments received, including any standard delivery charges due, within the period required by law. The Seller may withhold reimbursement until the goods are received or the consumer provides evidence of dispatch, whichever occurs earlier.",
        ],
      },
      {
        n: "14",
        title: "Handling and Diminished Value",
        body: [
          "The consumer may handle and inspect the goods only to the extent necessary to establish their nature, characteristics and functioning, as they could in a shop. Handling beyond that extent may result in liability for diminished value to the extent permitted by law.",
        ],
      },
      {
        n: "15",
        title: "Legal Guarantee of Conformity",
        body: [
          "Mandatory statutory rules on the legal guarantee of conformity for consumer goods and other statutory remedies remain fully applicable. The legal guarantee is separate from the right of withdrawal.",
        ],
      },
      {
        n: "16",
        title: "Intellectual Property",
        body: [
          "The name Aleksander Cecco, trademarks, text, photographs, videos, designs, graphics and other website content are protected by applicable law. Unauthorised reproduction or use is prohibited except as permitted by law.",
        ],
      },
      {
        n: "17",
        title: "Applicable Law and Consumer Protection",
        body: [
          "Consumer contracts are governed by applicable law, including mandatory consumer-protection rules of the consumer's country of residence where applicable. Nothing in these terms limits mandatory consumer rights.",
        ],
      },
      {
        n: "18",
        title: "Contact",
        body: ["For orders, assistance, withdrawal and communications: ceccotrading@pec.it."],
      },
    ],
  },
};

/* ------------------------------------------ returns and withdrawal policy */

const returns: Record<Locale, LegalDoc> = {
  it: {
    title: "Politica di resi e diritto di recesso",
    version: "Versione 1.0 — 17 agosto 2026",
    sections: [
      {
        n: "1",
        title: "Quando si applica",
        body: [
          "La presente politica disciplina i resi relativi agli acquisti a distanza effettuati da consumatori, nei limiti e con le eccezioni previste dalla legge.",
        ],
      },
      {
        n: "2",
        title: "Termine di recesso",
        body: [
          "Il consumatore dispone, in via generale, di 14 giorni dal giorno in cui acquisisce il possesso fisico del prodotto per comunicare il recesso.",
        ],
      },
      {
        n: "3",
        title: "Comunicazione",
        body: [
          "La comunicazione deve essere inviata a Cecco Trading SRLS, PEC ceccotrading@pec.it, entro il termine. È sufficiente una dichiarazione esplicita e inequivocabile della decisione di recedere.",
        ],
      },
      {
        n: "4",
        title: "Restituzione",
        body: [
          "Dopo aver comunicato il recesso, il consumatore deve restituire il prodotto entro 14 giorni dalla comunicazione. Il prodotto deve essere adeguatamente imballato per evitare danni durante il trasporto.",
        ],
      },
      {
        n: "5",
        title: "Costi di restituzione",
        body: [
          "Il costo diretto della restituzione è a carico del consumatore, salvo diversa indicazione del venditore o diversa previsione inderogabile della legge.",
        ],
      },
      {
        n: "6",
        title: "Condizioni del prodotto",
        body: [
          "Il consumatore può provare e manipolare il capo nei limiti necessari per verificarne natura, caratteristiche e funzionamento. Non è consentito utilizzarlo oltre quanto necessario per tale verifica. Eventuali diminuzioni di valore derivanti da manipolazione eccedente possono essere imputate al consumatore nei limiti di legge.",
        ],
      },
      {
        n: "7",
        title: "Rimborso",
        body: [
          "Il rimborso viene effettuato entro i termini previsti dalla legge. Il venditore può attendere la restituzione del prodotto o la prova della spedizione prima di effettuare il rimborso, nei casi consentiti.",
        ],
      },
      {
        n: "8",
        title: "Prodotti personalizzati",
        body: [
          "L'esclusione del recesso opera esclusivamente quando il prodotto rientra in una delle eccezioni previste dalla legge, inclusi i beni realizzati secondo specifiche del consumatore o chiaramente personalizzati. La sola scelta di una taglia standard, senza modifiche individuali, non determina automaticamente l'esclusione.",
        ],
      },
      {
        n: "9",
        title: "Prodotti non conformi",
        body: [
          "La presente politica non limita la garanzia legale di conformità né gli altri diritti del consumatore previsti dalla legge.",
        ],
      },
      {
        n: "10",
        title: "Contatti",
        body: ["Per comunicazioni relative a resi e recesso: ceccotrading@pec.it."],
      },
    ],
  },
  en: {
    title: "Returns and Right of Withdrawal Policy",
    version: "Version 1.0 — 17 August 2026",
    sections: [
      {
        n: "1",
        title: "Scope",
        body: [
          "This policy governs returns relating to distance purchases made by consumers, subject to applicable statutory requirements and exceptions.",
        ],
      },
      {
        n: "2",
        title: "Withdrawal Period",
        body: [
          "As a general rule, consumers have 14 days from the day on which they acquire physical possession of the goods to communicate withdrawal.",
        ],
      },
      {
        n: "3",
        title: "Notice",
        body: [
          "Notice must be sent to Cecco Trading SRLS at ceccotrading@pec.it within the applicable period. An unequivocal statement of the decision to withdraw is sufficient.",
        ],
      },
      {
        n: "4",
        title: "Return",
        body: [
          "After communicating withdrawal, the consumer must return the goods within 14 days from the withdrawal notice. Goods should be adequately packaged to prevent damage during transport.",
        ],
      },
      {
        n: "5",
        title: "Return Costs",
        body: [
          "The direct cost of returning the goods is borne by the consumer unless the Seller states otherwise or mandatory law provides otherwise.",
        ],
      },
      {
        n: "6",
        title: "Condition of Goods",
        body: [
          "Consumers may try on and handle garments only to the extent necessary to establish their nature, characteristics and functioning. They must not use the goods beyond what is necessary for that assessment. Diminished value caused by handling beyond that extent may be charged to the consumer to the extent permitted by law.",
        ],
      },
      {
        n: "7",
        title: "Refund",
        body: [
          "Refunds are made within the period required by law. The Seller may wait until the goods are received or evidence of dispatch is provided before making the refund where permitted.",
        ],
      },
      {
        n: "8",
        title: "Personalised Products",
        body: [
          "Withdrawal is excluded only where the product falls within a statutory exception, including goods made to the consumer's specifications or clearly personalised. Selecting a standard size without individual modifications does not automatically exclude withdrawal.",
        ],
      },
      {
        n: "9",
        title: "Non-Conforming Goods",
        body: [
          "This policy does not limit the consumer's statutory legal guarantee of conformity or any other rights provided by law.",
        ],
      },
      {
        n: "10",
        title: "Contact",
        body: ["For return and withdrawal notices: ceccotrading@pec.it."],
      },
    ],
  },
};

/* ------------------------------------------------ statutory model form */

/*
  THE STATUTORY FORM IS ONE DOCUMENT IN BOTH LANGUAGES in the source, headed
  «ITALIANO / ENGLISH», and it stays that way. A consumer sending this to an
  Italian company may reasonably send the Italian version whatever language
  they were reading in, so each locale's page carries both halves in the order
  the lawyer set them.

  THE BLANKS ARE THE LAWYER'S. They are underscores in the source because the
  form is meant to be copied out and filled in, on paper or in an email. This
  is NOT an interactive form on the site and must not become one: turning it
  into inputs would mean the site receiving a withdrawal notice, which is a
  channel the policy does not name and we would then have to build, log and
  answer. Copy, paste, send. That is what the statute asks for.
*/
const withdrawalForm: Record<Locale, LegalDoc> = {
  it: {
    title: "Modulo tipo di recesso",
    version: "Italiano / English",
    sections: [
      {body: ["Il modulo è utilizzabile quando il diritto di recesso è applicabile."]},
      {
        title: "Italiano",
        body: [
          "A: Cecco Trading SRLS, Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italia — PEC: ceccotrading@pec.it",
          "Con la presente io/noi (*) notifico/notifichiamo (*) il recesso dal mio/nostro (*) contratto di vendita dei seguenti beni (*) / servizi (*):",
          "Beni ordinati il (*) / ricevuti il (*): __________________________________________",
          "Nome del/dei consumatore/i: _________________________________________________",
          "Indirizzo del/dei consumatore/i: ______________________________________________",
          "Firma del/dei consumatore/i (solo se il presente modulo è notificato in versione cartacea): __________________________",
          "Data: __________________________",
          "(*) Cancellare la dicitura non pertinente.",
        ],
      },
      {
        title: "English",
        body: [
          "To: Cecco Trading SRLS, Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italy — PEC: ceccotrading@pec.it",
          "I/We hereby give notice that I/We withdraw from my/our (*) contract of sale of the following goods (*) / services (*):",
          "Goods ordered on (*) / received on (*): _______________________________________",
          "Name of consumer(s): _______________________________________________________",
          "Address of consumer(s): ____________________________________________________",
          "Signature of consumer(s) (only if this form is notified on paper): __________________________",
          "Date: __________________________",
          "(*) Delete as appropriate.",
        ],
      },
    ],
  },
  /*
    THE ENGLISH PAGE CARRIES THE ITALIAN TITLE, deliberately. The source has
    ONE form headed «MODULO TIPO DI RECESSO / ITALIANO / ENGLISH»: the lawyer
    gave it a single Italian name and then set out both language halves under
    it. Writing an English title here — «Statutory Model Withdrawal Form» was
    the first draft of this file — meant inventing a heading for a legal
    instrument, which is exactly what this file exists to prevent. Same for the
    line below it, which has no English counterpart in the source and so stays
    in Italian rather than being translated by us.
  */
  en: {
    title: "Modulo tipo di recesso",
    version: "Italiano / English",
    sections: [
      {body: ["Il modulo è utilizzabile quando il diritto di recesso è applicabile."]},
      {
        title: "Italiano",
        body: [
          "A: Cecco Trading SRLS, Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italia — PEC: ceccotrading@pec.it",
          "Con la presente io/noi (*) notifico/notifichiamo (*) il recesso dal mio/nostro (*) contratto di vendita dei seguenti beni (*) / servizi (*):",
          "Beni ordinati il (*) / ricevuti il (*): __________________________________________",
          "Nome del/dei consumatore/i: _________________________________________________",
          "Indirizzo del/dei consumatore/i: ______________________________________________",
          "Firma del/dei consumatore/i (solo se il presente modulo è notificato in versione cartacea): __________________________",
          "Data: __________________________",
          "(*) Cancellare la dicitura non pertinente.",
        ],
      },
      {
        title: "English",
        body: [
          "To: Cecco Trading SRLS, Via Torretta di Siena 16, 80058 Torre Annunziata (NA), Italy — PEC: ceccotrading@pec.it",
          "I/We hereby give notice that I/We withdraw from my/our (*) contract of sale of the following goods (*) / services (*):",
          "Goods ordered on (*) / received on (*): _______________________________________",
          "Name of consumer(s): _______________________________________________________",
          "Address of consumer(s): ____________________________________________________",
          "Signature of consumer(s) (only if this form is notified on paper): __________________________",
          "Date: __________________________",
          "(*) Delete as appropriate.",
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------ the pages */

/*
  TWO PAGES, FOUR DOCUMENTS (section 6.3 of BRIEF-LEGALE). The privacy notice
  stands alone because it is what the consent line under both checkouts points
  at, and a reader following that link must land on it rather than hunt for it
  inside a longer page. The terms, the returns policy and the statutory form go
  together because they are one transaction described three times, and because
  clause 11 of the terms says the model form is «riportato alla fine del
  presente documento» — which is only true if they share a page.
*/
export const LEGAL_PATHS = {privacy: "privacy", terms: "terms"} as const;

export function privacyDoc(locale: Locale): LegalDoc {
  return privacy[locale];
}

/** The terms page, in the order the lawyer's document runs. */
export function termsDocs(locale: Locale): LegalDoc[] {
  return [terms[locale], returns[locale], withdrawalForm[locale]];
}

import {Box, Button, Card, Flex, Grid, Heading, Inline, Stack, Text} from '@sanity/ui'
import {useRouter} from 'sanity/router'

/*
  LA PRIMA COSA CHE VEDE (2026-08-19, sezione 130).

  Prima, entrando, trovava una colonna stretta con sei voci e tre quarti di
  schermo bianco. Le sei voci erano i tipi di contenuto — cioè il modo in cui
  un programmatore guarda i suoi contenuti, non il modo in cui li guarda lui.
  Nessuna diceva da dove si comincia, e niente diceva quanto ci mette una
  modifica ad apparire, che è la domanda che si farà ogni volta.

  Questo è registrato come TOOL e messo per PRIMO, perché il primo tool è
  quello su cui si apre lo studio. Non è un documento da cercare: è la
  schermata iniziale.

  Le scorciatoie usano i percorsi veri del desk, verificati aprendo lo studio e
  leggendo l'indirizzo, non indovinati: /structure/orderable-garment e simili.
  Se un giorno la struttura cambia, cambiano anche questi.
*/

const VOCI: Array<{titolo: string; testo: string; dove: string; azione: string}> = [
  {
    titolo: 'Cambiare un prezzo, o le taglie',
    testo:
      'Apri il capo, cambia il numero, premi Publish. Il prezzo e le taglie stanno in cima al modulo.',
    dove: '/structure/orderable-garment',
    azione: 'Vai ai capi',
  },
  {
    titolo: 'Aggiungere o riordinare le fotografie',
    testo:
      'Stanno in cima al capo. La PRIMA della lista apre la pagina ed è quella che si vede nel catalogo e nei link condivisi.',
    dove: '/structure/orderable-garment',
    azione: 'Vai ai capi',
  },
  {
    /*
      CORRETTA 16/08/2026 (sezione 130). Diceva «servono almeno una fotografia e
      il nome; il resto si può aggiungere dopo», e sono TRE cose: l'indirizzo
      della pagina è obbligatorio e sta dentro un gruppo CHIUSO, quindi un capo
      nuovo si rifiuta di pubblicare per un campo che lui non ha mai visto. È
      esattamente il punto in cui uno smette e chiede aiuto.
    */
    titolo: 'Mettere un capo nuovo',
    testo:
      'Il pulsante + in alto nella lista dei capi. Servono tre cose: una fotografia, il nome, e poi apri «Impostazioni del capo» in fondo e premi GENERATE per l’indirizzo della pagina. Senza quello non si pubblica.',
    dove: '/structure/orderable-garment',
    azione: 'Vai ai capi',
  },
  {
    titolo: 'Cambiare la home',
    testo:
      'La fotografia di apertura, le tue righe sopra, la fila di foto che scorre di lato.',
    dove: '/structure/siteSettings',
    azione: 'Vai alla home',
  },
  {
    titolo: 'Cambiare una frase del sito',
    testo:
      'Tutte le frasi che il sito dice. I campi sono vuoti apposta. Vuoto vuol dire «lascia quella che c’è adesso».',
    dove: '/structure/siteCopy',
    azione: 'Vai alle parole',
  },
]

export default function Inizio() {
  const router = useRouter()
  const vai = (path: string) => router.navigateUrl({path})

  return (
    <Box padding={5} style={{maxWidth: 900, margin: '0 auto'}}>
      <Stack space={5}>
        <Stack space={3}>
          <Heading size={4}>Il tuo sito</Heading>
          <Text size={2} muted>
            Da qui cambi tutto quello che il sito dice e mostra: fotografie, prezzi, taglie, testi.
            Non serve avvisare nessuno.
          </Text>
        </Stack>

        {/*
          LA REGOLA CHE SI DIMENTICA SEMPRE, in alto e da sola. Il motivo per cui
          smetterà di usare lo studio non è la complessità: è cambiare una cosa,
          non vederla, e concludere che è rotto.
        */}
        <Card padding={4} radius={2} tone="primary" border>
          <Stack space={3}>
            <Text weight="semibold">Come funziona, in due righe</Text>
            <Text size={1}>
              1. Cambi quello che vuoi e premi <strong>Publish</strong> in basso a destra. Finché non
              lo premi, la modifica esiste solo per te.
            </Text>
            <Text size={1}>
              2. Il sito si rifà da solo. Ci mette <strong>qualche minuto</strong>, non è immediato.
              Se non lo vedi subito non rifarlo: aspetta cinque minuti e ricarica la pagina.
            </Text>
          </Stack>
        </Card>

        <Stack space={4}>
          <Text weight="semibold" size={1} muted style={{textTransform: 'uppercase', letterSpacing: '0.08em'}}>
            Le cose che farai più spesso
          </Text>
          <Grid columns={[1, 1, 2]} gap={3}>
            {VOCI.map((v) => (
              <Card key={v.titolo} padding={4} radius={2} border>
                <Stack space={3}>
                  <Text weight="semibold">{v.titolo}</Text>
                  <Text size={1} muted>
                    {v.testo}
                  </Text>
                  <Box>
                    <Button
                      text={v.azione}
                      mode="ghost"
                      onClick={() => vai(v.dove)}
                      fontSize={1}
                    />
                  </Box>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>

        <Card padding={4} radius={2} tone="caution" border>
          <Stack space={3}>
            <Text weight="semibold">Due cose da non toccare</Text>
            <Text size={1}>
              <strong>L&rsquo;indirizzo della pagina</strong> di un capo già online: i link che hai
              già mandato in giro smetterebbero di funzionare.
            </Text>
            <Text size={1}>
              In alto a destra c&rsquo;è un menu che dice <strong>Drafts</strong>, e accanto qualche
              icona. Sono cose di Sanity, non del tuo sito. Non ti servono e non rompono niente:
              lasciale dove sono.
            </Text>
          </Stack>
        </Card>

        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Text size={1} muted>
            La guida completa è nel file <code>GUIDA-STUDIO.md</code>, ma non ti serve per cominciare.
          </Text>
          <Inline space={2}>
            <Button
              as="a"
              href="https://aleksander-cecco.pages.dev"
              target="_blank"
              rel="noopener"
              text="Apri il sito"
              mode="ghost"
              fontSize={1}
            />
          </Inline>
        </Flex>
      </Stack>
    </Box>
  )
}

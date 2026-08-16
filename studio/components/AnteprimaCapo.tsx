import {Box, Card, Flex, Stack, Text} from '@sanity/ui'

/*
  ANTEPRIMA — cosa sta scrivendo, mentre lo scrive (2026-08-19, sezione 130).

  IL PROBLEMA CHE RISOLVE, e non è un problema estetico: cambiare un prezzo e
  aspettare cinque minuti per sapere se ha funzionato è il motivo per cui
  smetterà di usare lo studio. Ha bisogno di una risposta immediata alla
  domanda «ho fatto la cosa giusta?».

  PERCHÉ NON È UN IFRAME DEL SITO VERO. Il sito è statico: viene ricostruito da
  un webhook dopo ogni Publish, e finché non ha finito mostra ancora la
  versione di prima. Un iframe della pagina vera risponderebbe alla domanda
  sbagliata — «cos'era il sito cinque minuti fa» invece di «cosa sto
  scrivendo». Quindi questa anteprima è disegnata QUI, dai valori che ha in
  mano in questo momento, compresi quelli non ancora pubblicati.

  E PER LO STESSO MOTIVO È DICHIARATAMENTE UN'APPROSSIMAZIONE. Dice cosa
  comparirà — quale fotografia apre, che prezzo si legge, quali taglie si
  possono scegliere, se il capo si può comprare — e non prova a imitare i
  caratteri e le spaziature del sito. Un'anteprima che finge di essere la
  pagina vera è peggio di nessuna anteprima: lo farebbe fidare di un dettaglio
  che qui non è vero.

  Gli indirizzi delle immagini si costruiscono a mano dal riferimento
  dell'asset (image-<hash>-<larghezza>x<altezza>-<estensione>) invece di
  aggiungere una dipendenza allo studio per fare una sola stringa.
*/

const PROJECT = process.env.SANITY_STUDIO_PROJECT_ID as string
const DATASET = (process.env.SANITY_STUDIO_DATASET as string) || 'production'

function imageUrl(ref: string | undefined, width = 600): string | null {
  if (!ref) return null
  const m = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref)
  if (!m) return null
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${m[1]}-${m[2]}.${m[3]}?w=${width}&q=75&auto=format`
}

type Doc = {
  name?: string
  price?: number
  currency?: string
  sizes?: string[]
  availability?: string
  materials?: {it?: string; en?: string}
  description?: {it?: string; en?: string}
  measurements?: string
  media?: Array<{_key?: string; poster?: {asset?: {_ref?: string}}; video?: {asset?: {_ref?: string}}}>
}

const DISPONIBILITA: Record<string, string> = {
  readyNow: 'Disponibile subito.',
  unique: 'Commissione privata. 1 di 1, fatta una volta sola.',
  privateOrder: 'Ordine privato.',
  notOffered: 'Non in lavorazione ora.',
}

export default function AnteprimaCapo(props: {document?: {displayed?: Doc}}) {
  const doc = props?.document?.displayed ?? {}
  const media = Array.isArray(doc.media) ? doc.media : []
  const prima = media[0]
  const copertina = imageUrl(prima?.poster?.asset?._ref, 900)
  const altre = media.slice(1, 7)

  const prezzo =
    typeof doc.price === 'number'
      ? new Intl.NumberFormat('it-IT', {
          style: 'currency',
          currency: doc.currency || 'EUR',
          maximumFractionDigits: 0,
        }).format(doc.price)
      : null

  const compra = doc.availability === 'readyNow' || doc.availability === 'unique'
  const taglie = (doc.sizes ?? []).filter(Boolean)

  return (
    <Box padding={4} style={{background: '#FAFAF8', minHeight: '100%'}}>
      <Stack space={4} style={{maxWidth: 620, margin: '0 auto'}}>
        <Card padding={3} radius={2} tone="transparent" border>
          <Text size={1} muted>
            Questo è quello che stai scrivendo adesso, anche prima di Publish. Non è la pagina vera:
            serve a controllare che ci sia tutto, non a vedere com&rsquo;è fatta.
          </Text>
        </Card>

        {/* LA PRIMA FOTOGRAFIA È LA PAGINA. Farglielo vedere è metà del lavoro. */}
        {copertina ? (
          <Box>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '9 / 14',
                overflow: 'hidden',
                background: '#0A0A0A',
              }}
            >
              <img
                src={copertina}
                alt=""
                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  bottom: 20,
                  color: '#FAFAF8',
                  font: '600 22px/1.1 system-ui, sans-serif',
                  textShadow: '0 1px 12px rgba(0,0,0,.45)',
                }}
              >
                {doc.name || 'senza nome'}
              </div>
            </div>
            <Box marginTop={2}>
              <Text size={0} muted>
                La prima fotografia: apre la pagina, e si vede nel catalogo e nei link condivisi.
                {prima?.video?.asset?._ref ? ' Su questa c’è anche un video.' : ''}
              </Text>
            </Box>
          </Box>
        ) : (
          <Card padding={4} radius={2} tone="critical" border>
            <Text size={1}>
              Nessuna fotografia. Senza almeno una, questo capo non compare da nessuna parte sul
              sito.
            </Text>
          </Card>
        )}

        {altre.length > 0 && (
          <Flex gap={2} wrap="wrap">
            {altre.map((m, i) => {
              const u = imageUrl(m?.poster?.asset?._ref, 200)
              return u ? (
                <img
                  key={m?._key ?? i}
                  src={u}
                  alt=""
                  style={{width: 68, height: 96, objectFit: 'cover', display: 'block'}}
                />
              ) : null
            })}
          </Flex>
        )}

        <Card padding={4} radius={2} border>
          <Stack space={3}>
            <Text size={3} weight="semibold">
              {doc.name || 'senza nome'}
            </Text>

            {doc.materials?.it && (
              <Text size={1} muted>
                Composizione: {doc.materials.it}
              </Text>
            )}

            <Text size={1} muted>
              {DISPONIBILITA[doc.availability ?? 'readyNow'] ?? DISPONIBILITA.readyNow}
            </Text>

            {/* IL PREZZO, esattamente come lo vedrà chi compra. */}
            {compra ? (
              prezzo ? (
                <Text size={2} weight="semibold">
                  Acquista — {prezzo}
                </Text>
              ) : (
                <Card padding={3} radius={2} tone="caution">
                  <Text size={1}>
                    Nessun prezzo. Il capo si vede e si può chiedere, ma sparisce dalla pagina
                    «Ordina più pezzi».
                  </Text>
                </Card>
              )
            ) : (
              <Text size={1} muted>
                Nessun pulsante per comprare: hai messo che non è in vendita.
              </Text>
            )}

            {compra && (
              <Card padding={3} radius={2} tone={taglie.length ? 'transparent' : 'caution'}>
                <Text size={1}>
                  {taglie.length === 0
                    ? 'Nessuna taglia scelta: chi compra non può selezionare niente e nel modulo d’ordine la domanda sulla taglia non compare.'
                    : taglie.includes('ONE')
                      ? 'Taglia unica.'
                      : `Taglie che potrà scegliere: ${taglie.join('  ·  ')}`}
                </Text>
              </Card>
            )}

            {doc.description?.it && (
              <Text size={1} style={{whiteSpace: 'pre-line'}}>
                {doc.description.it}
              </Text>
            )}

            {doc.measurements && (
              <Text size={1} muted style={{whiteSpace: 'pre-line'}}>
                {doc.measurements}
              </Text>
            )}

            {/*
              LE DUE LINGUE, dove fa male. Un testo scritto solo in italiano non
              compare affatto sulla versione inglese: è la cosa che scoprirebbe
              per caso, mesi dopo, guardando il sito in inglese.
            */}
            {(doc.description?.it && !doc.description?.en) ||
            (doc.materials?.it && !doc.materials?.en) ? (
              <Card padding={3} radius={2} tone="caution">
                <Text size={1}>
                  Hai scritto in italiano ma non in inglese. Sulla versione inglese del sito quella
                  parte non comparirà per niente.
                </Text>
              </Card>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}

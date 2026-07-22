/**
 * Copy e fases da VSL — espelha SCAN_PHASES / H0 / MESSAGES da referência.
 * Progresso 0–100 mapeia rangeStart/rangeEnd de cada fase.
 */

export interface ScanPhase {
  rangeStart: number
  rangeEnd: number
  color: string
  messages: string[]
}

/** Fases de scan da referência (rt.SCAN_PHASES) */
export const scanPhases: ScanPhase[] = [
  {
    rangeStart: 0,
    rangeEnd: 12,
    color: 'text-violet-400',
    messages: [
      'Conectando aos servidores criptografados...',
      'Estabelecendo túnel seguro com o dispositivo...',
      'Verificando integridade da conexão...',
      'Autenticando chave de acesso...',
    ],
  },
  {
    rangeStart: 12,
    rangeEnd: 25,
    color: 'text-blue-400',
    messages: [
      'Contornando camada de segurança do Instagram...',
      'Validando credenciais do alvo...',
      'Injetando módulo de monitoramento...',
      'Inicializando sessão de espionagem...',
    ],
  },
  {
    rangeStart: 25,
    rangeEnd: 40,
    color: 'text-cyan-400',
    messages: [
      'Processando metadados do perfil...',
      'Mapeando rede social do alvo...',
      'Baixando histórico público de atividades...',
      'Identificando padrões de comportamento...',
    ],
  },
  {
    rangeStart: 40,
    rangeEnd: 50,
    color: 'text-fuchsia-400',
    messages: [
      'Localizando arquivos de conversa privadas...',
      'Acessando banco de dados de mensagens...',
      'Preparando descriptografia de DMs...',
      'Indexando histórico de chats...',
    ],
  },
  {
    rangeStart: 50,
    rangeEnd: 65,
    color: 'text-red-400',
    messages: [
      'Escaneando conversas privadas...',
      'Decifrando mensagens apagadas...',
      'Conversa oculta detectada — extraindo conteúdo...',
      'Recuperando DMs deletadas dos últimos 90 dias...',
      'Identificando palavras-chave suspeitas...',
      'Cruzando contatos da lista privada...',
    ],
  },
  {
    rangeStart: 65,
    rangeEnd: 72,
    color: 'text-orange-400',
    messages: [
      'Acessando galeria de mídia oculta...',
      'Buscando por imagens não publicadas...',
      'Verificando arquivos de mídia compartilhados...',
      'Escaneando pasta de fotos privadas...',
    ],
  },
  {
    rangeStart: 72,
    rangeEnd: 80,
    color: 'text-pink-400',
    messages: [
      'Analisando fotos e vídeos compartilhados...',
      'Aplicando IA para detectar conteúdo adulto...',
      'Imagem suspeita identificada — extraindo metadados...',
      'Recuperando imagens enviadas em modo temporário...',
      'Desbloqueando conteúdo bloqueado...',
    ],
  },
  {
    rangeStart: 80,
    rangeEnd: 92,
    color: 'text-yellow-400',
    messages: [
      'Capturando coordenadas GPS recentes...',
      'Triangulando última localização ativa...',
      'Cruzando histórico de check-ins...',
      'Identificando locais frequentados à noite...',
      'Verificando rota de deslocamento...',
      'Detectando paradas em locais suspeitos...',
    ],
  },
  {
    rangeStart: 92,
    rangeEnd: 100,
    color: 'text-emerald-400',
    messages: [
      'Compilando relatório final...',
      'Criptografando dados extraídos...',
      'Preparando painel de visualização...',
      'Análise quase concluída...',
    ],
  },
]

/** Lista plana de todas as mensagens com progresso alvo (para UI linear) */
export interface FlatScanMessage {
  id: string
  label: string
  /** Progresso 0–100 em que esta mensagem fica ativa */
  atProgress: number
  color: string
}

export const flatScanMessages: FlatScanMessage[] = (() => {
  const out: FlatScanMessage[] = []
  let n = 0
  for (const phase of scanPhases) {
    const span = phase.rangeEnd - phase.rangeStart
    const step = span / phase.messages.length
    phase.messages.forEach((label, i) => {
      out.push({
        id: `scan-${n++}`,
        label,
        atProgress: phase.rangeStart + step * i,
        color: phase.color,
      })
    })
  }
  return out
})()

/** Duração total da fase 1 da VSL na referência: ~362s de vídeo, mas mock usa progresso acelerado */
export const VSL_PROGRESS_DURATION_MS = 55_000

export type SuspectCardStatus = 'waiting' | 'analyzing' | 'found'

export interface SuspectCard {
  id: 'messages' | 'images' | 'locations'
  icon: 'chat' | 'image' | 'pin'
  title: string
  /** Progresso em que sai de "Aguardando análise..." */
  startAt: number
  /** Progresso em que marca como encontrado */
  foundAt: number
  analyzingText: string
  foundText: string
}

export const suspectCards: SuspectCard[] = [
  {
    id: 'messages',
    icon: 'chat',
    title: 'Mensagens suspeitas',
    startAt: 50,
    foundAt: 62,
    analyzingText: 'Descriptografando DMs apagadas...',
    foundText: '148 mensagens suspeitas identificadas',
  },
  {
    id: 'images',
    icon: 'image',
    title: 'Imagens suspeitas',
    startAt: 65,
    foundAt: 76,
    analyzingText: 'Analisando fotos temporárias...',
    foundText: '35 mídias suspeitas identificadas',
  },
  {
    id: 'locations',
    icon: 'pin',
    title: 'Localizações suspeitas',
    startAt: 80,
    foundAt: 90,
    analyzingText: 'Triangulando GPS...',
    foundText: '2 localizações suspeitas identificadas',
  },
]

/** Toast popup de imagem suspeita (H0 da referência) */
export const imageFoundToast = {
  title: 'Imagem suspeita encontrada',
  bodyHomem: 'Uma foto íntima trocada às 23:47 foi identificada nas mensagens ocultas.',
  bodyMulher: 'Uma foto íntima enviada às 01:12 foi identificada nas mensagens ocultas.',
  appearAt: 72,
}

/** Mensagens fake que “aparecem” no meio do scan (MESSAGES da referência) */
export const dmSnippets = {
  homem: [
    { appearAt: 55, user: '@_carol.s', text: 'gostosa me chama' },
    { appearAt: 58, user: '@bianca.m', text: 'te esperando para brincar...' },
    { appearAt: 62, user: '@ju.secreta', text: 'vc me deixa louca, amor' },
  ],
  mulher: [
    { appearAt: 55, user: '@k_misterioso', text: 'gostoso tô pensando em vc' },
    { appearAt: 58, user: '@leo.treino', text: 'te esperando aqui, lindinha' },
    { appearAt: 62, user: '@coach.m', text: 'vc me deixa louco, saudade' },
  ],
}

/** Compat: BackVSL ainda importa analysisPhases */
export interface AnalysisPhase {
  id: string
  label: string
  category: 'messages' | 'media' | 'location'
}

export const analysisPhases: AnalysisPhase[] = flatScanMessages.map((m, i) => ({
  id: m.id,
  label: m.label,
  category: i < 14 ? 'messages' : i < 28 ? 'media' : 'location',
}))

export const phaseDurationMs = Math.round(VSL_PROGRESS_DURATION_MS / Math.max(1, analysisPhases.length))

export const liveNotifications = [
  {
    id: 'live-1',
    type: 'chat' as const,
    title: 'Detectamos mensagens do Direct',
    description: 'Mensagens do Direct excluídas recentemente foram encontradas.',
    delayMs: 8_000,
  },
  {
    id: 'live-2',
    type: 'image' as const,
    title: 'Imagem suspeita encontrada',
    description: 'Uma foto íntima trocada às 23:47 foi identificada nas mensagens ocultas.',
    delayMs: 22_000,
  },
  {
    id: 'live-3',
    type: 'chat' as const,
    title: 'Análise detectou 5 novas mensagens',
    description: 'Palavras-chave suspeitas foram identificadas nas conversas.',
    delayMs: 32_000,
  },
  {
    id: 'live-4',
    type: 'location' as const,
    title: 'Nova localização suspeita',
    description: 'Encontrada nos registros de localização do dispositivo.',
    delayMs: 42_000,
  },
]

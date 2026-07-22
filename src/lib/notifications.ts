export interface NotificationItem {
  id: string
  type: 'image' | 'chat' | 'location' | 'audio'
  title: string
  description: string
  delayMs: number
}

export const defaultNotifications: NotificationItem[] = [
  {
    id: 'notify-image-1',
    type: 'image',
    title: 'Imagem suspeita encontrada',
    description: 'Detectamos uma foto que pode conter evidências importantes no perfil monitorado.',
    delayMs: 1_500,
  },
  {
    id: 'notify-chat-1',
    type: 'chat',
    title: 'Mensagem apagada recuperada',
    description: 'Uma conversa excluída foi restaurada e está disponível para análise imediata.',
    delayMs: 4_500,
  },
  {
    id: 'notify-location-1',
    type: 'location',
    title: 'Nova localização suspeita',
    description: 'O usuário foi localizado em um ponto fora da rotina habitual nas últimas horas.',
    delayMs: 7_500,
  },
  {
    id: 'notify-audio-1',
    type: 'audio',
    title: 'Áudio recuperado',
    description: 'Recuperamos um arquivo de áudio que havia sido deletado do dispositivo alvo.',
    delayMs: 10_500,
  },
  {
    id: 'notify-chat-2',
    type: 'chat',
    title: 'Contato privado identificado',
    description: 'Identificamos uma conversa frequentemente oculta com um contato desconhecido.',
    delayMs: 13_500,
  },
  {
    id: 'notify-image-2',
    type: 'image',
    title: 'Story excluído encontrado',
    description: 'Um story apagado foi resgatado do cache e salvo na galeria de evidências.',
    delayMs: 16_500,
  },
]

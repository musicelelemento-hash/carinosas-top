/**
 * Datos de demostración para Chats + Agenda (Fase 6 del rediseño).
 * No hay persistencia real: mensajes y reservas viven en estado local de React
 * mientras el usuario navega. El brief de diseño deja "por definir" la
 * persistencia real de reservas y la autenticación — esto es intencional.
 */

export interface MockChatContact {
  id: string;
  name: string;
  age: number;
  sector: string;
  avatar: string;
  online: boolean;
  unread: number;
  lastMessage: string;
}

export const MOCK_CHATS: MockChatContact[] = [
  {
    id: "sofia",
    name: "Sofía",
    age: 23,
    sector: "Chipipe, Salinas",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    online: true,
    unread: 2,
    lastMessage: "Perfecto, te espero entonces 🌙",
  },
  {
    id: "camila",
    name: "Camila",
    age: 22,
    sector: "Samborondón",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200",
    online: true,
    unread: 1,
    lastMessage: "¿A qué hora te viene mejor?",
  },
  {
    id: "valentina",
    name: "Valentina",
    age: 24,
    sector: "Quito Norte",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    online: false,
    unread: 0,
    lastMessage: "Reserva confirmada ✓",
  },
];

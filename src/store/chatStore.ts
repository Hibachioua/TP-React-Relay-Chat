import { create } from "zustand";

export type PublicUser = {
  user_id: string;
  username: string;
  email?: string;
  external_id?: string;
  last_login?: string;
};

export type Target =
  | { kind: "user"; id: string }
  | { kind: "room"; id: string };

type ChatMessage = {
  id: string;
  from: string;
  to: Target;
  text: string;
  at: string;
};

type ChatState = {
  sessionToken?: string;
  users: PublicUser[];
  rooms: { id: string; name: string }[];
  selected?: Target;
  messages: ChatMessage[];

  setSessionToken: (t?: string) => void;
  setUsers: (u: PublicUser[]) => void;
  setRooms: (r: { id: string; name: string }[]) => void;
  select: (t?: Target) => void;
  setMessagesFor: (t: Target, msgs: ChatMessage[]) => void;
  addMessage: (m: ChatMessage) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  sessionToken: undefined,
  users: [],
  rooms: [],
  selected: undefined,
  messages: [],

  setSessionToken: (t?: string) => set({ sessionToken: t }),
  setUsers: (u: PublicUser[]) => set({ users: u }),
  setRooms: (r: { id: string; name: string }[]) => set({ rooms: r }),
  select: (t?: Target) => set({ selected: t }),

  setMessagesFor: (t: Target, msgs: ChatMessage[]) => {
    const keep = get().messages.filter(
      (m: ChatMessage) => !(m.to.kind === t.kind && m.to.id === t.id)
    );
    set({ messages: [...keep, ...msgs] });
  },

  addMessage: (m: ChatMessage) =>
    set({ messages: [...get().messages, m] }),
}));

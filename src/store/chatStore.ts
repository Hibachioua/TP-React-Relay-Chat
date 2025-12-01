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

// src/store/chatStore.ts
export type ChatState = {
  sessionToken?: string;
  meId?: string;
  meName?: string;                       
  users: PublicUser[];
  rooms: { id: string; name: string }[];
  selected?: Target;
  messages: ChatMessage[];

  setSessionToken: (t?: string) => void;
  setMeId: (id?: string) => void;
  setMeName: (name?: string) => void;     
  setUsers: (u: PublicUser[]) => void;
  setRooms: (r: { id: string; name: string }[]) => void;
  select: (t?: Target) => void;
  setMessagesFor: (t: Target, msgs: ChatMessage[]) => void;
  addMessage: (m: ChatMessage) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  sessionToken: undefined,
  meId: undefined,
  meName: undefined,                   
  users: [],
  rooms: [],
  selected: undefined,
  messages: [],

  setSessionToken: (t?: string) => set({ sessionToken: t }),
  setMeId: (id?: string) => set({ meId: id }),
  setMeName: (name) => set({ meName: name }),  
  setUsers: (u) => set({ users: u }),
  setRooms: (r) => set({ rooms: r }),
  select: (t) => set({ selected: t }),
  setMessagesFor: (t, msgs) => {
    const keep = get().messages.filter(
      (m) => !(m.to.kind === t.kind && m.to.id === t.id)
    );
    set({ messages: [...keep, ...msgs] });
  },
  addMessage: (m) => set({ messages: [...get().messages, m] }),
}));

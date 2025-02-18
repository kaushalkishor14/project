import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Memory, MemoryType } from "../types/memory";

const initialMemories = [
  {
    id: "1",
    title: "Camera man ",
    description: `The day I met you,
When I saw you for the first time, my mind went, "Wow!"
And you thought, "This is the cameraman."`,
    date: new Date("2023-01-15"),
    type: "romantic" as MemoryType,
    location: {
      lat: 26.4492,
      lng: 86.4117,
      name: "Home , Bathnaha,Bihar,india",
    },
    imageUrl: "./uploads/image1.jpg",
  },
  {
    id: "2",
    title: "Gateway of India Visit",
    description: "Exploring the iconic Gateway of India in Mumbai.",
    date: new Date("2023-03-20"),
    type: "milestone" as MemoryType,
    location: {
      lat: 18.922,
      lng: 72.8347,
      name: "Gateway of India, Mumbai",
    },
    imageUrl: "./uploads/image2.jpg",
  },
  {
    id: "3",
    title: "Golden Temple Prayer",
    description: "Spiritual visit to the Golden Temple in Amritsar.",
    date: new Date("2023-06-10"),
    type: "adventure" as MemoryType,
    location: {
      lat: 31.62,
      lng: 74.8765,
      name: "Golden Temple, Amritsar",
    },
    imageUrl: "./uploads/image3.jpg",
  },
];

interface MemoryState {
  memories: Memory[];
  selectedMemory: Memory | null;
  selectedType: MemoryType | null;
  addMemory: (memory: Omit<Memory, "id">) => void;
  deleteMemory: (id: string) => void;
  selectMemory: (id: string | null) => void;
  setSelectedType: (type: MemoryType | null) => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      memories: initialMemories, // Initialize with sample memories
      selectedMemory: null,
      selectedType: null,
      addMemory: (memory) =>
        set((state) => ({
          memories: [...state.memories, { ...memory, id: crypto.randomUUID() }],
        })),
      deleteMemory: (id) =>
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
          selectedMemory:
            state.selectedMemory?.id === id ? null : state.selectedMemory,
        })),
      selectMemory: (id) =>
        set((state) => ({
          selectedMemory: id
            ? state.memories.find((m) => m.id === id) || null
            : null,
        })),
      setSelectedType: (type) => set({ selectedType: type }),
    }),
    {
      name: "memory-storage", // unique name for localStorage key
      partialize: (state) => ({ memories: state.memories }), // only persist memories
    }
  )
);

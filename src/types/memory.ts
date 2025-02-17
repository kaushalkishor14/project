export type MemoryType = 'milestone' | 'romantic' | 'adventure' | 'celebration' | 'travel';

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: MemoryType;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  imageUrl: string; // Can be either a URL or base64 string
}

export interface CreateMemoryInput {
  title: string;
  description: string;
  date: Date;
  type: MemoryType;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  imageUrl: string;
}
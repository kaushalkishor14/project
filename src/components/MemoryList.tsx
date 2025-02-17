import { format } from 'date-fns';
import { useMemoryStore } from '../store/useMemoryStore';
import { Memory } from '../types/memory';
import { MapPin, Calendar, Trash2 } from 'lucide-react';

interface MemoryListProps {
  memories: Memory[];
}

export function MemoryList({ memories }: MemoryListProps) {
  const selectMemory = useMemoryStore((state) => state.selectMemory);
  const deleteMemory = useMemoryStore((state) => state.deleteMemory);

  if (memories.length === 0) { 
    return (
      <div className="text-center p-8 bg-white/50 rounded-xl border-2 border-pink-100">
        <p className="text-gray-500">No memories found</p>
      </div>
    );
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent memory selection when deleting
    if (window.confirm('Are you sure you want to delete this memory?')) {
      deleteMemory(id);
    }
  };

  return (
    <div className="grid gap-2">
      {memories.map((memory) => (
        <button
          key={memory.id}
          onClick={() => selectMemory(memory.id)}
          className="text-left p-2 sm:p-3 bg-white rounded-lg border-2 border-pink-100 hover:border-pink-300 transition-all group w-full relative flex gap-2"
        >
          <button
            onClick={(e) => handleDelete(e, memory.id)}
            className="flex-shrink-0 self-start p-1 sm:p-1.5 rounded-lg hover:bg-red-50 transition-all"
            aria-label="Delete memory"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </button>
          <img
            src={memory.imageUrl}
            alt={memory.title} 
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="font-medium text-sm text-gray-900 group-hover:text-pink-600 transition-colors truncate">
              {memory.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{format(memory.date, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{memory.location.name}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, MapPin } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { cn } from '../lib/utils';

const memoryTypeColors = {
  milestone: 'bg-red-100 text-red-800 border-red-200',
  adventure: 'bg-blue-100 text-blue-800 border-blue-200',
  romantic: 'bg-pink-100 text-pink-800 border-pink-200',
  celebration: 'bg-purple-100 text-purple-800 border-purple-200',
  travel: 'bg-green-100 text-green-800 border-green-200'  
} as const;

export function MemoryCard() {
  const selectedMemory = useMemoryStore((state) => state.selectedMemory);
  const selectMemory = useMemoryStore((state) => state.selectMemory);

  if (!selectedMemory) return null;
 
  return (
    <Dialog.Root open={!!selectedMemory} onOpenChange={() => selectMemory(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-[9999]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[calc(100%-2rem)] max-w-md animate-slide-up z-[10000] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <Dialog.Title className="sr-only">
            {selectedMemory.title}
          </Dialog.Title>
          
          <div>
            <div className="relative h-48 sm:h-56">
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Dialog.Close className="absolute right-3 top-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-lg transition-colors">
                <X className="h-5 w-5 text-white" />
              </Dialog.Close>
            </div>
            
            <div className="p-4 sm:p-6">
              <span className={cn(
                'inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 border',
                memoryTypeColors[selectedMemory.type]
              )}>
                {selectedMemory.type.charAt(0).toUpperCase() + selectedMemory.type.slice(1)}
              </span>
              
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{selectedMemory.title}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{format(selectedMemory.date, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedMemory.location.name}</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{selectedMemory.description}</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
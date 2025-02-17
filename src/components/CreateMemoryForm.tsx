import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { MemoryType } from '../types/memory';
import { cn } from '../lib/utils';

interface CreateMemoryFormProps {
  location: { lat: number; lng: number };
  locationName: string;
  onClose: () => void; 
}

export function CreateMemoryForm({ location, locationName, onClose }: CreateMemoryFormProps) {
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<MemoryType>('milestone');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const addMemory = useMemoryStore((state) => state.addMemory);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for immediate display
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use a default image if no image was uploaded
    const finalImageUrl = imageUrl || '/default-memory.jpg';

    addMemory({
      title,
      description,
      date: new Date(date),
      type,
      location: {
        lat: location.lat,
        lng: location.lng,
        name: locationName,
      },
      imageUrl: finalImageUrl,
    });
    onClose();
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-[9999]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[calc(100%-2rem)] max-w-md animate-slide-up z-[10000] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <Dialog.Title className="text-lg sm:text-xl font-semibold p-4 sm:p-6 border-b">
            Create New Memory
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter memory title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                rows={3}
                placeholder="Describe your memory"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as MemoryType)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="milestone">Milestone</option>
                  <option value="adventure">Adventure</option>
                  <option value="romantic">Romantic</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Memory Image
              </label>
              <div className="flex flex-col gap-4">
                {/* Image Preview */}
                {previewUrl && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setImageUrl('');
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* Upload Button */}
                <label className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer",
                  "text-sm font-medium hover:border-blue-500 hover:bg-blue-50 transition-colors",
                  previewUrl ? "border-gray-200" : "border-blue-200"
                )}>
                  <ImageIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {previewUrl ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{locationName}</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              >
                Create Memory
              </button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
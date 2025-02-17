import React, { useState, useMemo } from 'react';
import { Map } from './components/Map';
import { MemoryCard } from './components/MemoryCard';
import { Legend } from './components/Legend';
import { useMemoryStore } from './store/useMemoryStore';
import { MapPin, Search, Heart, X } from 'lucide-react';
import { MemoryList } from './components/MemoryList';
import { MemoryType } from './types/memory';

function App() {
  const memories = useMemoryStore((state) => state.memories);
  const [selectedType, setSelectedType] = useState<MemoryType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const memoryTypes = [
    { type: 'milestone', label: 'Milestone 🌟', color: 'bg-red-400' },
    { type: 'romantic', label: 'Romantic 💕', color: 'bg-pink-400' },
    { type: 'adventure', label: 'Adventure 🌄', color: 'bg-blue-400' },
  ];

  // Filter memories based on search query and selected type
  const filteredMemories = useMemo(() => {
    return memories.filter((memory) => {
      const matchesType = selectedType ? memory.type === selectedType : true;
      const matchesSearch = searchQuery.trim() === '' ? true : (
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesType && matchesSearch;
    });
  }, [memories, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg border-2 border-pink-200 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-pink-400 p-2 sm:p-3 rounded-xl">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
                Our Memory Map
              </h1>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search memories..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full text-sm border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-pink-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Memory Types - Mobile View */}
          <div className="md:hidden">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border-2 border-pink-200 mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {memoryTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(selectedType === type.type ? null : type.type as MemoryType)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === type.type
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Left Sidebar - Desktop View */}
          <div className="hidden md:flex flex-col gap-6 w-80">
            {/* Memory Types */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-pink-200">
              <h2 className="text-lg font-semibold mb-4">Memory Types</h2>
              <div className="flex flex-col gap-2">
                {memoryTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(selectedType === type.type ? null : type.type as MemoryType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === type.type
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <Legend />
            
            {/* Memory Card will render here when a memory is selected */}
            <MemoryCard />
          </div>

          {/* Main Content - Map and Memory List */}
          <div className="flex-1 bg-white border-2 border-pink-200 rounded-xl p-3 sm:p-4 shadow-lg h-[calc(100vh-8rem)] sm:h-[80vh] flex flex-col">
            {/* Map */}
            <div className="h-[60%] md:h-[70%] mb-3 sm:mb-4">
              <Map memories={filteredMemories} />
            </div>
            
            {/* Memory List */}
            <div className="h-[40%] md:h-[30%] overflow-y-auto bg-white/90 backdrop-blur-sm rounded-xl p-2 sm:p-3">
              <h2 className="text-base font-semibold text-pink-600 mb-2 sticky top-0 bg-white/90 backdrop-blur-sm py-2 flex items-center justify-between">
                <span>
                  {selectedType 
                    ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Memories` 
                    : 'All Memories'}
                </span>
                {filteredMemories.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
                  </span>
                )}
              </h2>
              <MemoryList memories={filteredMemories} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Memory Card */}
      <div className="md:hidden">
        <MemoryCard />
      </div>
    </div>
  );
}

export default App;
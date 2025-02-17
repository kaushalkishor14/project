export function Legend() {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-pink-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Map Legend</h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-red-500 shadow-sm shadow-red-500/50" /> 
          <span className="text-sm text-gray-600 font-medium">Milestone</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
          <span className="text-sm text-gray-600 font-medium">Romantic</span>
        </li>
        <li className="flex items-center gap-3"> 
          <span className="w-4 h-4 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
          <span className="text-sm text-gray-600 font-medium">Adventure</span>
        </li>
      </ul>
    </div>
  );
}
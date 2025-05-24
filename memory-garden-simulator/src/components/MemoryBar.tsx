
import MemoryBlock from "./MemoryBlock";
import type { MemoryBlock as MemoryBlockType, Task } from "./MemorySimulator";

interface MemoryBarProps {
  blocks: MemoryBlockType[];
  tasks: Task[];
  onFreeBlock: (blockId: string) => void;
  staticRegionSize: number;
  memorySize: number;
}

const MemoryBar = ({ blocks, tasks, onFreeBlock, staticRegionSize, memorySize }: MemoryBarProps) => {
  const getTaskInfo = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          🧠 Memory Visualization (Linux Kernel Style)
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-static-memory rounded"></div>
            <span>Static</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dynamic-memory rounded"></div>
            <span>Dynamic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-free-memory border border-gray-300 rounded"></div>
            <span>Free</span>
          </div>
        </div>
      </div>

      {/* Memory Bar Container */}
      <div className="relative">
        <div className="w-full h-16 bg-free-memory border-2 border-gray-300 rounded-lg relative overflow-hidden">
          {/* Static/Dynamic region separator */}
          <div 
            className="absolute top-0 h-full w-px bg-red-500 z-10"
            style={{ left: `${(staticRegionSize / memorySize) * 100}%` }}
          >
            <div className="absolute -top-6 left-0 transform -translate-x-1/2 text-xs text-red-600 font-semibold">
              Static | Dynamic
            </div>
          </div>

          {/* Memory size indicators */}
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-full bg-gray-300"
                style={{ left: `${(i + 1) * 10}%` }}
              />
            ))}
          </div>

          {/* Static region background */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-50 opacity-30"
            style={{ width: `${(staticRegionSize / memorySize) * 100}%` }}
          />

          {/* Dynamic region background */}
          <div 
            className="absolute top-0 h-full bg-green-50 opacity-30"
            style={{ 
              left: `${(staticRegionSize / memorySize) * 100}%`,
              width: `${((memorySize - staticRegionSize) / memorySize) * 100}%`
            }}
          />

          {/* Memory blocks */}
          {blocks.map((block, index) => {
            const task = getTaskInfo(block.taskId);
            return (
              <MemoryBlock
                key={block.id}
                block={block}
                task={task}
                memorySize={memorySize}
                onFree={() => onFreeBlock(block.id)}
                animationDelay={index * 0.1}
              />
            );
          })}
        </div>

        {/* Memory scale */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200 units</span>
        </div>
        
        {/* Region labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span className="text-blue-600 font-semibold">Static Region (0-{staticRegionSize})</span>
          <span className="text-green-600 font-semibold">Dynamic Region ({staticRegionSize}-{memorySize})</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">
            {blocks.reduce((sum, block) => sum + block.size, 0)}
          </div>
          <div className="text-sm text-gray-600">Used Memory</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">
            {memorySize - blocks.reduce((sum, block) => sum + block.size, 0)}
          </div>
          <div className="text-sm text-gray-600">Free Memory</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-blue-800">
            {blocks.filter(b => b.type === 'static').length}
          </div>
          <div className="text-sm text-blue-600">Static Blocks</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-green-800">
            {blocks.filter(b => b.type === 'dynamic').length}
          </div>
          <div className="text-sm text-green-600">Dynamic Blocks</div>
        </div>
      </div>
    </div>
  );
};

export default MemoryBar;

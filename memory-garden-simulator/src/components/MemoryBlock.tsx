
import { useState } from "react";
import type { MemoryBlock as MemoryBlockType, Task } from "./MemorySimulator";
import { Button } from "@/components/ui/button";

interface MemoryBlockProps {
  block: MemoryBlockType;
  task?: Task;
  memorySize: number;
  onFree: () => void;
  animationDelay: number;
}

const MemoryBlock = ({ block, task, memorySize, onFree, animationDelay }: MemoryBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const widthPercentage = (block.size / memorySize) * 100;
  const leftPercentage = (block.position / memorySize) * 100;

  const blockColor = block.type === 'static' ? 'bg-static-memory' : 'bg-dynamic-memory';
  const hoverColor = block.type === 'static' ? 'hover:bg-blue-600' : 'hover:bg-green-600';

  return (
    <div
      className={`absolute top-0 h-full ${blockColor} ${hoverColor} transition-all duration-300 cursor-pointer animate-block-grow border-r border-white`}
      style={{
        left: `${leftPercentage}%`,
        width: `${widthPercentage}%`,
        transformOrigin: 'left center',
        animationDelay: `${animationDelay}s`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task icon and info */}
      <div className="h-full flex items-center justify-center relative">
        {task && (
          <span className="text-white font-bold text-xs">
            {task.icon}
          </span>
        )}

        {/* Hover tooltip */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10 animate-bounce-in">
            <div className="font-semibold">{task?.name || 'Unknown'}</div>
            <div>Size: {block.size} units</div>
            <div>Type: {block.type}</div>
            <div>Position: {block.position}</div>
            {block.type === 'dynamic' && (
              <Button
                size="sm"
                variant="destructive"
                className="mt-1 h-6 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onFree();
                }}
              >
                Free
              </Button>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryBlock;

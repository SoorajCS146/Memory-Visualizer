import { useState } from "react";
import TaskPanel from "./TaskPanel";
import MemoryBar from "./MemoryBar";
import ControlPanel from "./ControlPanel";
import { Badge } from "@/components/ui/badge";

export interface Task {
  id: string;
  name: string;
  size: number;
  icon: string;
  color: string;
  type: 'static' | 'dynamic';
}

export interface MemoryBlock {
  id: string;
  taskId: string;
  type: 'static' | 'dynamic';
  size: number;
  position: number;
  allocated: boolean;
}

const initialTasks: Task[] = [
  { id: 'A', name: 'Task A', size: 20, icon: '🚀', color: 'bg-blue-100', type: 'static' },
  { id: 'B', name: 'Task B', size: 30, icon: '⚡', color: 'bg-green-100', type: 'dynamic' },
  { id: 'C', name: 'Task C', size: 25, icon: '🎯', color: 'bg-purple-100', type: 'static' }
];

const MemorySimulator = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [nextTaskId, setNextTaskId] = useState('D');
  const [memorySize, setMemorySize] = useState(200);

  const STATIC_REGION_SIZE = Math.floor(memorySize / 2); // Half of memory for static allocation

  // Predefined positions for static blocks based on task ID
  const getStaticPosition = (taskId: string): number => {
    const staticPositions: { [key: string]: number } = {
      'A': 0,
      'B': 30,
      'C': 60,
      'D': 20,
      'E': 40,
      'F': 80,
      'G': 10,
      'H': 50,
      'I': 70,
      'J': 90
    };
    return staticPositions[taskId] || 0;
  };

  // Best-fit algorithm for dynamic allocation
  const findBestFitPosition = (size: number): number | null => {
    const dynamicRegionStart = STATIC_REGION_SIZE;
    const dynamicBlocks = memoryBlocks
      .filter(block => block.type === 'dynamic')
      .sort((a, b) => a.position - b.position);

    // Check if we can fit at the beginning of dynamic region
    if (dynamicBlocks.length === 0) {
      return dynamicRegionStart;
    }

    // Check gap before first dynamic block
    if (dynamicBlocks[0].position - dynamicRegionStart >= size) {
      return dynamicRegionStart;
    }

    // Check gaps between dynamic blocks
    let bestPosition: number | null = null;
    let bestFitSize = Infinity;

    for (let i = 0; i < dynamicBlocks.length - 1; i++) {
      const currentEnd = dynamicBlocks[i].position + dynamicBlocks[i].size;
      const nextStart = dynamicBlocks[i + 1].position;
      const gapSize = nextStart - currentEnd;

      if (gapSize >= size && gapSize < bestFitSize) {
        bestPosition = currentEnd;
        bestFitSize = gapSize;
      }
    }

    // Check gap after last dynamic block
    const lastBlock = dynamicBlocks[dynamicBlocks.length - 1];
    const lastEnd = lastBlock.position + lastBlock.size;
    const remainingSpace = memorySize - lastEnd;

    if (remainingSpace >= size && remainingSpace < bestFitSize) {
      bestPosition = lastEnd;
    }

    return bestPosition;
  };

  const createTask = (type: 'static' | 'dynamic') => {
    const taskIcons = ['🎮', '💻', '📱', '⚙️', '🔧', '📊', '🎨', '🎵'];
    const taskColors = ['bg-red-100', 'bg-yellow-100', 'bg-indigo-100', 'bg-pink-100'];
    
    const newTask: Task = {
      id: nextTaskId,
      name: `Task ${nextTaskId}`,
      size: Math.floor(Math.random() * 30) + 15, // 15-45 units
      icon: taskIcons[Math.floor(Math.random() * taskIcons.length)],
      color: taskColors[Math.floor(Math.random() * taskColors.length)],
      type
    };

    setTasks(prev => [...prev, newTask]);
    setNextTaskId(String.fromCharCode(nextTaskId.charCodeAt(0) + 1));
  };

  const deleteTask = (taskId: string) => {
    // Remove task from tasks list
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Remove any allocated memory blocks for this task
    setMemoryBlocks(prev => prev.filter(block => block.taskId !== taskId));
    
    // Clear selection if deleted task was selected
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const handleMemorySizeChange = (newSize: number) => {
    // Clear all memory blocks when memory size changes
    setMemoryBlocks([]);
    setMemorySize(newSize);
  };

  const handleAllocate = () => {
    if (!selectedTask) return;

    // Check if task is already allocated
    const existingBlock = memoryBlocks.find(block => block.taskId === selectedTask.id);
    if (existingBlock) {
      console.log('Task is already allocated');
      return;
    }

    if (selectedTask.type === 'static') {
      const staticPosition = getStaticPosition(selectedTask.id);
      
      // Check if static position is available and within static region
      if (staticPosition + selectedTask.size > STATIC_REGION_SIZE) {
        console.log('Static block exceeds static region');
        return;
      }

      // Check for conflicts with other static blocks - more precise conflict detection
      const hasConflict = memoryBlocks.some(block => 
        block.type === 'static' && (
          (staticPosition < block.position + block.size && staticPosition + selectedTask.size > block.position)
        )
      );

      if (hasConflict) {
        console.log('Static position conflicts with existing block');
        return;
      }

      const newBlock: MemoryBlock = {
        id: `static-${Date.now()}`,
        taskId: selectedTask.id,
        type: 'static',
        size: selectedTask.size,
        position: staticPosition,
        allocated: true
      };
      setMemoryBlocks(prev => [...prev, newBlock]);
    } else {
      // Dynamic allocation using best-fit
      const position = findBestFitPosition(selectedTask.size);
      
      if (position === null) {
        console.log('No suitable position found for dynamic allocation');
        return;
      }

      const newBlock: MemoryBlock = {
        id: `dynamic-${Date.now()}`,
        taskId: selectedTask.id,
        type: 'dynamic',
        size: selectedTask.size,
        position,
        allocated: true
      };
      setMemoryBlocks(prev => [...prev, newBlock]);
    }
  };

  const handleFree = () => {
    if (!selectedTask) return;
    
    setMemoryBlocks(prev => 
      prev.filter(block => block.taskId !== selectedTask.id)
    );
  };

  const handleFreeBlock = (blockId: string) => {
    setMemoryBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-slide-in">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-100">
            Static Blocks: {memoryBlocks.filter(b => b.type === 'static').length}
          </Badge>
          <Badge variant="outline" className="bg-green-100">
            Dynamic Blocks: {memoryBlocks.filter(b => b.type === 'dynamic').length}
          </Badge>
          <Badge variant="outline" className="bg-purple-100">
            Static Region: 0-{STATIC_REGION_SIZE}
          </Badge>
          <Badge variant="outline" className="bg-orange-100">
            Dynamic Region: {STATIC_REGION_SIZE}-{memorySize}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Selected: {selectedTask ? `${selectedTask.icon} ${selectedTask.name} (${selectedTask.type})` : 'None'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Task Panel */}
        <div className="lg:col-span-1">
          <TaskPanel
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            onCreateTask={createTask}
            onDeleteTask={deleteTask}
          />
        </div>

        {/* Memory Visualization and Controls */}
        <div className="lg:col-span-3 space-y-6">
          <MemoryBar
            blocks={memoryBlocks}
            tasks={tasks}
            onFreeBlock={handleFreeBlock}
            staticRegionSize={STATIC_REGION_SIZE}
            memorySize={memorySize}
          />
          
          <ControlPanel
            selectedTask={selectedTask}
            onAllocate={handleAllocate}
            onFree={handleFree}
            memorySize={memorySize}
            onMemorySizeChange={handleMemorySizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MemorySimulator;

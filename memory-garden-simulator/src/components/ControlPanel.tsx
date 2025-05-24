
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Task } from "./MemorySimulator";

interface ControlPanelProps {
  selectedTask: Task | null;
  onAllocate: () => void;
  onFree: () => void;
  memorySize: number;
  onMemorySizeChange: (size: number) => void;
}

const ControlPanel = ({
  selectedTask,
  onAllocate,
  onFree,
  memorySize,
  onMemorySizeChange
}: ControlPanelProps) => {
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">🎛️ Memory Controls</h3>
      
      {/* Memory Size Control */}
      <div className="space-y-2">
        <Label htmlFor="memory-size" className="text-sm font-medium">
          Total Memory Size
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="memory-size"
            type="number"
            min="100"
            max="500"
            step="50"
            value={memorySize}
            onChange={(e) => onMemorySizeChange(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600">units</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={onAllocate}
          disabled={!selectedTask}
          className={`h-16 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:scale-100 ${
            selectedTask?.type === 'static' 
              ? 'bg-static-memory hover:bg-blue-600' 
              : 'bg-dynamic-memory hover:bg-green-600'
          }`}
          size="lg"
        >
          <div className="text-center">
            <div className="text-lg font-semibold">
              Allocate {selectedTask?.type === 'static' ? 'Static' : 'Dynamic'}
            </div>
            <div className="text-xs opacity-90">
              {selectedTask?.type === 'static' ? 'Fixed position' : 'Best fit'}
            </div>
          </div>
        </Button>

        <Button
          onClick={onFree}
          disabled={!selectedTask}
          variant="destructive"
          className="h-16 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:scale-100"
          size="lg"
        >
          <div className="text-center">
            <div className="text-lg font-semibold">Free Memory</div>
            <div className="text-xs opacity-90">Release memory</div>
          </div>
        </Button>
      </div>

      {!selectedTask && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-sm text-yellow-800">
          💡 Select a task from the task list to begin allocation
        </div>
      )}

      {selectedTask && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm text-blue-800">
          Ready to allocate <strong>{selectedTask.icon} {selectedTask.name}</strong> ({selectedTask.size} units, {selectedTask.type})
        </div>
      )}
    </Card>
  );
};

export default ControlPanel;

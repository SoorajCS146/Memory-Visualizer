
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Task } from "./MemorySimulator";

interface TaskPanelProps {
  tasks: Task[];
  selectedTask: Task | null;
  onSelectTask: (task: Task) => void;
  onCreateTask: (type: 'static' | 'dynamic') => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskPanel = ({ tasks, selectedTask, onSelectTask, onCreateTask, onDeleteTask }: TaskPanelProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Task List</h3>
      
      {/* Create Task Buttons */}
      <div className="space-y-2 mb-4">
        <Button
          onClick={() => onCreateTask('static')}
          className="w-full bg-static-memory hover:bg-blue-600"
          size="sm"
        >
          + Create Static Task
        </Button>
        <Button
          onClick={() => onCreateTask('dynamic')}
          className="w-full bg-dynamic-memory hover:bg-green-600"
          size="sm"
        >
          + Create Dynamic Task
        </Button>
      </div>

      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
            selectedTask?.id === task.id
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectTask(task)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${task.color} flex items-center justify-center text-xl animate-bounce-in`}>
                {task.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{task.name}</h4>
                <p className="text-sm text-gray-600">Size: {task.size} units</p>
                <p className="text-xs text-gray-500">Type: {task.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${task.type === 'static' ? 'bg-blue-100' : 'bg-green-100'}`}
              >
                {task.id}
              </Badge>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskPanel;


import MemorySimulator from "@/components/MemorySimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Memory Allocation Simulator
          </h1>
          <p className="text-lg text-gray-600">
            Explore how static and dynamic memory allocation works
          </p>
        </div>
        <MemorySimulator />
      </div>
    </div>
  );
};

export default Index;

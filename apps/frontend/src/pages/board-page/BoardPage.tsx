import { Board } from "../../widgets/board";

export const BoardPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <div className="p-10 bg-white rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind CSS is Working 🚀
        </h1>
        <p className="text-gray-700">
          If you see this styled properly, Tailwind is installed correctly.
        </p>
        <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Test Button
        </button>
      </div>
    </div>
  );
} 
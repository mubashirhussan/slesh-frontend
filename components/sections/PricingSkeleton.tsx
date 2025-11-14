// components/PricingSkeleton.tsx
export default function PricingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
      <p className="text-lg font-medium text-gray-900">Loading pricing...</p>
    </div>
  );
}

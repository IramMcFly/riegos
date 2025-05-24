import SensorStatus from "@/components/SensorStatus";

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-center">
        <SensorStatus />
      </div>
    </div>
  );
}

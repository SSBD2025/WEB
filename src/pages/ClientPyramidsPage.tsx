import { useClientPyramids } from "@/hooks/useClientPyramids.ts";
import { ClientFoodPyramidsList } from "@/components/clientFoodPyramidList.tsx";

export default function ClientPyramidsPage() {
  const { data } = useClientPyramids();

  return (
    <main className="flex-grow">
      <ClientFoodPyramidsList pyramids={data || []} mode="client" />
    </main>
  );
}

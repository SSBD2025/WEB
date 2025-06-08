import { ClientFoodPyramidsList } from "@/components/clientFoodPyramidList";
import { useParams } from "react-router";
import { useGetClientPyramidsByDietician } from "@/hooks/useGetClientPyramidsByDietician.ts";

export default function DieticianClientPyramidsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: pyramids } = useGetClientPyramidsByDietician(clientId!);

  return (
    <main className="flex-grow">
      <ClientFoodPyramidsList pyramids={pyramids || []} mode="dietician" />
    </main>
  );
};

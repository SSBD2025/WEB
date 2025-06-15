import MedicalChartsComponent from "@/components/medical-charts";

const ClientMedicalChartsPage = () => {
  return (
    <div className="flex-grow p-4">
      <MedicalChartsComponent userRole={"client"} />
    </div>
  );
};

export default ClientMedicalChartsPage;

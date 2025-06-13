import MedicalChartsComponent from "@/components/medical-charts";

const DieticianMedicalChartsPage = () => {
    return (
        <div className="flex-grow p-4">
            <MedicalChartsComponent userRole={"dietician"} />
        </div>
    );
};

export default DieticianMedicalChartsPage;
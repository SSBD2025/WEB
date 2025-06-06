import BloodTestReports from "@/components/blood-test-reports"

export default function Page() {
    return (
        <div className="flex-grow p-4">
            <BloodTestReports userRole={"dietician"}/>
        </div>
    )
}

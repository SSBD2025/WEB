import { RegistrationForm } from "@/components/registration-form"

export default function DieticianRegister() {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <RegistrationForm userType="dietician" />
        </div>
    )
}
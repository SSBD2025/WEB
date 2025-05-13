import { RegistrationForm } from "@/components/registration-form"

export default function ClientRegister() {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <RegistrationForm userType="client" />
        </div>
    )
}
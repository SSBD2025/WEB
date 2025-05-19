import { RegistrationForm } from "@/components/registration-form"

export default function AdminRegister() {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
        <RegistrationForm userType="admin" />
            </div>
    )
}
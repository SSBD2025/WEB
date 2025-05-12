import { FormLabel } from "@/components/ui/form"

interface RequiredLabelProps {
    children: React.ReactNode
}

export function RequiredFormLabel({ children }: RequiredLabelProps) {
    return (
        <FormLabel>
            {children} <span className="text-red-500">*</span>
        </FormLabel>
    )
}

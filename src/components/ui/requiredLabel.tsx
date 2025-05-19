import { FormLabel } from "@/components/ui/form"

interface RequiredLabelProps {
    children: React.ReactNode
    htmlFor?: string
}

export function RequiredFormLabel({ children, htmlFor }: RequiredLabelProps) {
    return (
        <FormLabel htmlFor={htmlFor}>
            {children} <span className="text-red-500">*</span>
        </FormLabel>
    )
}

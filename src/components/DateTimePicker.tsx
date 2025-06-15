import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DateTimeValue = {
    date: Date | undefined
}

type DateTimePickerProps = {
    label: string
    value: DateTimeValue
    onChange: (val: DateTimeValue) => void
}

const formatEUDateTime = (date?: Date) => {
    if (!date) return "Select date and time"
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export const DateTimePicker = ({ label, value, onChange }: DateTimePickerProps) => {
    const [open, setOpen] = React.useState(false)
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(value.date)

    React.useEffect(() => {
        setInternalDate(value.date)
    }, [value.date])

    const handleDateSelect = (selectedDate?: Date) => {
        if (!selectedDate) return
        const existing = internalDate || new Date()
        const updated = new Date(selectedDate)
        updated.setHours(existing.getHours(), existing.getMinutes(), existing.getSeconds())
        setInternalDate(updated)
        onChange({ date: updated })
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [h, m, s] = e.target.value.split(":")
        const baseDate = internalDate || new Date()
        baseDate.setHours(Number(h), Number(m), Number(s ?? 0))
        setInternalDate(baseDate)
        onChange({ date: new Date(baseDate) })
    }

    const formattedTime = () => {
        if (!internalDate) return "00:00:00"
        const h = internalDate.getHours().toString().padStart(2, "0")
        const m = internalDate.getMinutes().toString().padStart(2, "0")
        const s = internalDate.getSeconds().toString().padStart(2, "0")
        return `${h}:${m}:${s}`
    }

    return (
        <div className="flex flex-col gap-3">
            <Label className="px-1">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-64 justify-between font-normal">
                        {formatEUDateTime(internalDate)}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                    <Input
                        type="time"
                        step="1"
                        value={formattedTime()}
                        onChange={handleTimeChange}
                    />
                    <Calendar
                        mode="single"
                        selected={internalDate}
                        captionLayout="dropdown"
                        onSelect={handleDateSelect}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}


export const DateTimeRangePicker = ({
                                        onApply,
                                        hasResults,
                                    }: {
    onApply: (since: string | undefined, before: string | undefined) => void
    hasResults: boolean
}) => {
    const [since, setSince] = React.useState<DateTimeValue>({ date: undefined })
    const [before, setBefore] = React.useState<DateTimeValue>({ date: undefined })
    const formatToISO = (val: DateTimeValue): string | undefined =>
        val.date?.toISOString()

    const isValidRange = (): boolean => {
        if (!since.date || !before.date) return true
        return since.date <= before.date
    }

    const handleClear = () => {
        setSince({ date: undefined })
        setBefore({ date: undefined })
        onApply(undefined, undefined)
    }

    return (
        <>
        {hasResults && (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex gap-6 items-end">
                <DateTimePicker label="From" value={since} onChange={setSince} />
                <DateTimePicker label="To" value={before} onChange={setBefore} />
                <Button
                    className="self-end"
                    onClick={() => onApply(formatToISO(since), formatToISO(before))}
                    disabled={!isValidRange()}
                >
                    Apply FiltersTODO
                </Button>
                <Button variant="ghost" className="self-end" onClick={handleClear}>
                    Clear FiltersTODO
                </Button>
            </div>
        </div>
        )}
        {!hasResults && (
            <div className="border rounded-lg p-4 text-center text-sm text-muted-foreground">
                No results found for the selected range.TODO
                <Button variant="link" className="ml-2" onClick={handleClear}>
                    Clear filtersTODO
                </Button>
            </div>
        )}
        </>
    )
}

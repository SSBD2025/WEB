import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import type { AccountWithRoles } from "@/types/user"

interface AccountSearchAutocompleteProps {
  accounts: AccountWithRoles[] | undefined
  onSearch: (value: string) => void
  searchPhrase: string
  isLoading: boolean
}

export function AccountSearchAutocomplete({
  accounts,
  onSearch,
  searchPhrase,
  isLoading,
}: AccountSearchAutocompleteProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(searchPhrase)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // TODO: Można dodać funkcję generującą sugestie
  const suggestions: string[] = [] // <- do uzupełnienia

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    // TODO: obsługa otwierania/zamykania podpowiedzi
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    onSearch(suggestion)
    setOpen(false)
    // TODO: Ustaw focus z powrotem na input
  }

  const handleClear = () => {
    setInputValue("")
    onSearch("")
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue)
      setOpen(false)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setInputValue(searchPhrase)
  }, [searchPhrase])

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder={t("accountsTable.search.placeholder")}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          disabled={isLoading}
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted"
            onClick={handleClear}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("accountsTable.search.clear")}</span>
          </Button>
        )}
      </div>

      {/* TODO: Podpowiedzi do uzupełnienia */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md">
          <Command>
            <CommandList>
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    onSelect={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty>{t("accountsTable.search.noSuggestions")}</CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}

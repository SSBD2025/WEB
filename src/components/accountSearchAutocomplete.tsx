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
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)

  const generateSuggestions = () => {
    if (!accounts) return []

    const suggestions = new Set<string>()

    accounts.forEach((account) => {
      const firstName = account.accountDTO.firstName
      const lastName = account.accountDTO.lastName

      if (firstName) {
        suggestions.add(firstName)
      }

      if (lastName) {
        suggestions.add(lastName)
      }
    })

    return Array.from(suggestions)
        .filter((suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()))
        .sort()
        .slice(0, 5)
  }

  const suggestions = generateSuggestions()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setCursorPosition(e.target.selectionStart)

    if (value.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
      onSearch("")
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    onSearch(suggestion)
    setOpen(false)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleClear = () => {
    setInputValue("")
    onSearch("")
    setOpen(false)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue)
      setOpen(false)
    } else if (e.key === "Escape") {
      setOpen(false)
    } else if (e.key === "ArrowDown" && open) {
      e.preventDefault()
    }
    setCursorPosition(e.currentTarget.selectionStart)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchPhrase !== inputValue && !inputRef.current?.matches(":focus")) {
      setInputValue(searchPhrase)
    }
  }, [searchPhrase, inputValue])

  useEffect(() => {
    if (cursorPosition !== null && inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [cursorPosition, isLoading])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchPhrase) {
        onSearch(inputValue)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue, onSearch, searchPhrase])

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
              onFocus={() => inputValue.length > 0 && setOpen(true)}
              onClick={(e) => setCursorPosition(e.currentTarget.selectionStart)}
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls={open ? "search-suggestions" : undefined}
          />
          {inputValue && (
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted transition-colors"
                  onClick={handleClear}
                  disabled={isLoading}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={t("accountsTable.search.clear")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t("accountsTable.search.clear")}</span>
              </Button>
          )}
        </div>

        {open && suggestions.length > 0 && (
            <div
                className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md"
                role="listbox"
                id="search-suggestions"
                aria-label={t("accountsTable.search.suggestionsList")}
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {suggestions.map((suggestion) => (
                        <CommandItem
                            key={suggestion}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            onMouseDown={(e) => e.preventDefault()}
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            role="option"
                            aria-selected="false"
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


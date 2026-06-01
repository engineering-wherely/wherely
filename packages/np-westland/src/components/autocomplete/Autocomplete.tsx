import * as React from "react"
import { ChevronsUpDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type AutocompleteOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

type AutocompleteProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  options: AutocompleteOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  name?: string
  inputClassName?: string
  contentClassName?: string
}

function Autocomplete({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  name,
  className,
  inputClassName,
  contentClassName,
  ...props
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const selectedValue = isControlled ? value : internalValue
  const selectedOption = options.find((option) => option.value === selectedValue)

  function setSelectedValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  function selectOption(nextValue: string) {
    setSelectedValue(nextValue === selectedValue ? "" : nextValue)
    setOpen(false)
  }

  return (
    <div
      data-slot="autocomplete"
      className={cn("w-full", className)}
      {...props}
    >
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedValue ?? ""}
        />
      ) : null}

      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <div className="relative">
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className="h-9 w-full justify-between pr-16 text-left font-normal"
            >
              <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
                {selectedOption?.label ?? placeholder}
              </span>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          {selectedValue ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Clear selection"
              disabled={disabled}
              onClick={() => setSelectedValue("")}
              className="absolute top-1/2 right-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </Button>
          ) : null}
        </div>

        <PopoverContent
          align="start"
          className={cn("w-(--radix-popover-trigger-width) p-0", contentClassName)}
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className={inputClassName}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={[option.value, option.description ?? ""]}
                    disabled={option.disabled}
                    data-checked={option.value === selectedValue}
                    onSelect={() => selectOption(option.value)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.description ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Autocomplete }
export type { AutocompleteOption, AutocompleteProps }

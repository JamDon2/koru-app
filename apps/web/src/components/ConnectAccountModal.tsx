"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Check,
  ChevronsUpDown,
  X,
  Loader2,
  Plus,
  Building2,
} from "lucide-react";
import {
  createGocardlessConnectionMutation,
  getAvailableInstitutionsOptions,
} from "api-client/react-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import countries from "@/data/countries.json";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectAccountModal({
  isOpen,
  onClose,
}: ConnectAccountModalProps) {
  const [institutionId, setInstitutionId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryComboOpen, setCountryComboOpen] = useState(false);
  const [bankComboOpen, setBankComboOpen] = useState(false);

  const createConnectionMutation = useMutation(
    createGocardlessConnectionMutation()
  );

  // Fetch institutions from the API
  const { data: institutions = [], isLoading: institutionsLoading } = useQuery(
    getAvailableInstitutionsOptions({
      query: { country: selectedCountry || undefined },
    })
  );

  const handleConnect = async () => {
    if (!institutionId.trim()) return;

    setIsConnecting(true);
    try {
      const result = await createConnectionMutation.mutateAsync({
        body: { institution_id: institutionId.trim() },
      });

      // Redirect to GoCardless authorization
      if (result.link) {
        window.location.href = result.link;
      }
    } catch (error) {
      console.error("Failed to create connection:", error);
      // You might want to show an error toast here
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBankSelect = (bankId: string) => {
    setInstitutionId(bankId);
  };

  const selectedCountryData = countries.find(
    (country) => country.code === selectedCountry
  );
  const selectedBank = institutions.find(
    (institution) => institution.id === institutionId
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card/95 border-border/50 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Connect Bank Account
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-background/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Country Selection */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Select Country
            </label>
            <Popover open={countryComboOpen} onOpenChange={setCountryComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryComboOpen}
                  className="bg-background/50 border-border/50 w-full justify-between"
                >
                  {selectedCountryData
                    ? `${selectedCountryData.emoji} ${selectedCountryData.name}`
                    : "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search country..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value=""
                        onSelect={() => {
                          setSelectedCountry("");
                          setCountryComboOpen(false);
                        }}
                      >
                        🌍 All Countries
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedCountry === "" ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => {
                            setSelectedCountry(
                              country.code === selectedCountry
                                ? ""
                                : country.code
                            );
                            setCountryComboOpen(false);
                          }}
                        >
                          {country.emoji} {country.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedCountry === country.code
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Banks Section */}
          <div className="space-y-3">
            <label className="text-muted-foreground text-sm font-medium">
              Select Your Bank
            </label>
            {institutionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                <span className="text-muted-foreground ml-2">
                  Loading banks...
                </span>
              </div>
            ) : (
              <Popover open={bankComboOpen} onOpenChange={setBankComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={bankComboOpen}
                    className="bg-background/50 border-border/50 w-full justify-between"
                    disabled={institutions.length === 0}
                  >
                    <div className="flex items-center space-x-2">
                      {selectedBank ? (
                        <>
                          {selectedBank.logo && (
                            <img
                              src={selectedBank.logo}
                              alt={selectedBank.name}
                              className="h-4 w-4 rounded object-contain"
                            />
                          )}
                          <span>{selectedBank.name}</span>
                        </>
                      ) : (
                        <span>
                          {institutions.length > 0
                            ? "Select bank..."
                            : "No banks found for selected country"}
                        </span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search bank..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No bank found.</CommandEmpty>
                      <CommandGroup>
                        {institutions.map((institution) => (
                          <CommandItem
                            key={institution.id}
                            value={institution.name}
                            onSelect={() => {
                              handleBankSelect(
                                institution.id === institutionId
                                  ? ""
                                  : institution.id
                              );
                              setBankComboOpen(false);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              {institution.logo && (
                                <img
                                  src={institution.logo}
                                  alt={institution.name}
                                  className="h-4 w-4 rounded object-contain"
                                />
                              )}
                              <span>{institution.name}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                institutionId === institution.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">
                GoCardless Integration
              </span>
            </div>
            <p className="mt-1 text-xs text-blue-300/80">
              Your account will be connected securely through GoCardless, a
              trusted financial data provider.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-background/50 border-border/50 hover:bg-card/80 flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!institutionId.trim() || isConnecting}
              className="flex-1"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

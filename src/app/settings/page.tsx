"use client";

import { AppSidebar } from "@/components/app-sidebar";
// app/inventory/page.tsx

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, CircleDollarSign, Banknote, Coins, Receipt, FileText } from "lucide-react"
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CurrencyEntity, Settings } from "@/types/pos";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";



export default function ChefManagementPage() {
    const [settings, setSettings] = useState<Settings>({
        currency: "USD",
        currencySymbol: "$",
        currencyPosition: "before",
        decimalPlaces: 2,
        thousandSeparator: ",",
        decimalSeparator: ".",
        autoUpdateRates: true,
        exchangeRateApiKey: "",
        taxRate: 0,
        taxName: "Tax",
        taxInclusive: false,
        showTaxSeparately: true,
        taxNumber: "",
        showTaxNumberOnReceipts: false
    })
    const [currencies, setCurrencies] = useState<CurrencyEntity[]>([])

    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchUser().then(() => {
            if (!useAuthStore.getState().user) {
                router.push('/');
            }
        });
    }, [fetchUser, router]);
    const initSetting = async () => {
        let settingData = await window.electronAPI.getSetting();
        if (!settingData) {
            await window.electronAPI.createSetting(settings)
            settingData = await window.electronAPI.getSetting();
        }

        setSettings(settingData);

        const currencyData = await window.electronAPI.getAllCurrency()
        setCurrencies(currencyData);
        currencyData.forEach((item: CurrencyEntity) => {
            if (item.is_main) {
                setSettings(prev => ({
                    ...prev,
                    currency: item.code,
                    currencySymbol: item.symbol,
                }));
            }
        })
    }

    useEffect(() => {


        initSetting();

    }, [])

    const handleCurrencyChange = (value: string) => {
        const selectedCurrency = currencies.find(c => c.code === value)
        setSettings({
            ...settings,
            currency: value,
            currencySymbol: selectedCurrency?.symbol ?? ""
        })
    }



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.electronAPI.editSetting(settings)
        toast.success("Your currency preferences have been updated.");
    }

    return (
        <div>
            <SidebarProvider
                style={{
                    // @ts-ignore
                    "--sidebar-width": "10rem",
                    "--sidebar-width-mobile": "20rem",
                }}
            >
                <AppSidebar />
                <div className="w-full">
                    <div className="h-screen  bg-gray-100 flex flex-col">
                        <Header user={user}></Header>
                        <div className="space-y-6 p-2">
                            <div>
                                <h3 className="text-lg font-medium">Currency & Tax Settings</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure currency display and tax settings for your application
                                </p>
                            </div>

                            <Separator />

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Primary Currency Selection */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CircleDollarSign className="h-5 w-5" />
                                                Primary Currency
                                            </CardTitle>
                                            <CardDescription>
                                                Set your default display currency
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currency">Currency</Label>
                                                    <Select
                                                        value={settings.currency}
                                                        onValueChange={handleCurrencyChange}
                                                    >
                                                        <SelectTrigger className="my-2">
                                                            <SelectValue placeholder="Select currency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {currencies.map((currency) => (
                                                                <SelectItem key={currency.code} value={currency.code}>
                                                                    {currency.currency_name} ({currency.symbol})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="symbol">Currency Symbol</Label>
                                                    <Input
                                                        id="symbol"
                                                        value={settings.currencySymbol}
                                                        className="my-2"
                                                        onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tax Settings */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Receipt className="h-5 w-5" />
                                                Tax Settings
                                            </CardTitle>
                                            <CardDescription>
                                                Configure tax rates and behavior
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                                                    <Input
                                                        id="taxRate"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        className="my-2"
                                                        value={settings.taxRate}
                                                        onChange={(e) => setSettings({
                                                            ...settings,
                                                            taxRate: parseFloat(e.target.value) || 0
                                                        })}
                                                        placeholder="0.00"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="taxName">Tax Name</Label>
                                                    <Input
                                                        id="taxName"
                                                        className="my-2"
                                                        value={settings.taxName}
                                                        onChange={(e) => setSettings({ ...settings, taxName: e.target.value })}
                                                        placeholder="e.g., VAT, GST, Sales Tax"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="taxInclusive" className="flex-1">
                                                        Prices include tax
                                                    </Label>
                                                    <Switch
                                                        id="taxInclusive"
                                                        checked={settings.taxInclusive}
                                                        onCheckedChange={(checked) => setSettings({ ...settings, taxInclusive: checked })}
                                                    />
                                                </div>

                                                {!settings.taxInclusive && (
                                                    <div className="flex items-center justify-between space-x-2">
                                                        <Label htmlFor="showTaxSeparately" className="flex-1">
                                                            Show tax separately on receipts
                                                        </Label>
                                                        <Switch
                                                            id="showTaxSeparately"
                                                            checked={settings.showTaxSeparately}
                                                            onCheckedChange={(checked) => setSettings({ ...settings, showTaxSeparately: checked })}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Display Format */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Banknote className="h-5 w-5" />
                                                Display Format
                                            </CardTitle>
                                            <CardDescription>
                                                Configure how currency values appear
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Symbol Position</Label>
                                                    <Select
                                                        value={settings.currencyPosition}
                                                        onValueChange={(value) => setSettings({ ...settings, currencyPosition: value })}
                                                    >
                                                        <SelectTrigger className="my-2">
                                                            <SelectValue placeholder="Select position" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="before">Before amount ($100)</SelectItem>
                                                            <SelectItem value="after">After amount (100$)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="decimalPlaces">Decimal Places</Label>
                                                    <Input
                                                        id="decimalPlaces"
                                                        type="number"
                                                        min="0"
                                                        max="4"
                                                        className="my-2"
                                                        value={settings.decimalPlaces}
                                                        onChange={(e) => setSettings({ ...settings, decimalPlaces: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Separators */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Coins className="h-5 w-5" />
                                                Number Formatting
                                            </CardTitle>
                                            <CardDescription>
                                                Configure thousand and decimal separators
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="thousandSeparator">Thousand Separator</Label>
                                                    <Input
                                                        id="thousandSeparator"
                                                        className="my-2"
                                                        maxLength={1}
                                                        value={settings.thousandSeparator}
                                                        onChange={(e) => setSettings({ ...settings, thousandSeparator: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="decimalSeparator">Decimal Separator</Label>
                                                    <Input
                                                        id="decimalSeparator"
                                                        maxLength={1}
                                                        className="my-2"
                                                        value={settings.decimalSeparator}
                                                        onChange={(e) => setSettings({ ...settings, decimalSeparator: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Exchange Rates */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Exchange Rates</CardTitle>
                                            <CardDescription>
                                                Configure automatic exchange rate updates
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="autoUpdateRates">Auto-update exchange rates</Label>
                                                    <Switch
                                                        id="autoUpdateRates"
                                                        className="my-2"
                                                        checked={settings.autoUpdateRates}
                                                        onCheckedChange={(checked) => setSettings({ ...settings, autoUpdateRates: checked })}
                                                    />
                                                </div>

                                                {settings.autoUpdateRates && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor="exchangeRateApiKey">API Key</Label>
                                                        <Input
                                                            id="exchangeRateApiKey"
                                                            className="my-2"
                                                            type="password"
                                                            value={settings.exchangeRateApiKey}
                                                            onChange={(e) => setSettings({ ...settings, exchangeRateApiKey: e.target.value })}
                                                            placeholder="Enter your exchange rate API key"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tax Number/ID */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Tax Registration
                                            </CardTitle>
                                            <CardDescription>
                                                Business tax information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="taxNumber">Tax Identification Number</Label>
                                                    <Input
                                                        id="taxNumber"
                                                        className="my-2"
                                                        value={settings.taxNumber}
                                                        onChange={(e) => setSettings({ ...settings, taxNumber: e.target.value })}
                                                        placeholder="e.g., VAT Number, GSTIN"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="showTaxNumberOnReceipts" className="flex-1">
                                                        Show tax number on receipts
                                                    </Label>
                                                    <Switch
                                                        id="showTaxNumberOnReceipts"
                                                        checked={settings.showTaxNumberOnReceipts}
                                                        onCheckedChange={(checked) => setSettings({ ...settings, showTaxNumberOnReceipts: checked })}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button type="submit" className="gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
}

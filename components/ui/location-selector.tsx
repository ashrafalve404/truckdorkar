"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { RiMapPinFill, RiCheckboxCircleFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { getDivisions, getDistricts, getThanas, buildAddress, parseAddress } from "@/lib/bd-locations";
import { useLanguage } from "@/context/language-context";

interface LocationSelectorProps {
    label: string;
    labelBn: string;
    value: string;
    onChange: (address: string) => void;
    iconColor?: string;
    required?: boolean;
    /** compact mode for the widget (single-row, smaller) */
    compact?: boolean;
}

interface NativeSelectProps {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
    disabled?: boolean;
    compact?: boolean;
    isDivisionSelect?: boolean;
}

function NativeSelect({ value, onChange, options, placeholder, disabled, compact, isDivisionSelect }: NativeSelectProps) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(o => !o)}
                className={cn(
                    "w-full flex items-center justify-between gap-2 font-medium text-left transition-all border rounded-lg focus:outline-none",
                    compact
                        ? "h-9 px-3 text-xs bg-white border-slate-300 text-slate-900"
                        : "h-11 px-4 text-sm bg-white border-slate-300 text-slate-900",
                    disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-primary/50 focus:ring-2 focus:ring-primary/20",
                    !value ? "text-slate-800" : "text-slate-950 font-semibold",
                    open && "border-primary ring-2 ring-primary/20"
                )}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown className={cn("w-4 h-4 shrink-0 text-slate-700 transition-transform duration-200", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-y-auto max-h-52 scrollbar-hide min-w-[170px]">
                    {options.map(opt => {
                        const isOptionDisabled = false;
                        return (
                            <button
                                key={opt}
                                type="button"
                                disabled={isOptionDisabled}
                                onClick={() => {
                                    if (!isOptionDisabled) {
                                        onChange(opt);
                                        setOpen(false);
                                    }
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2",
                                    isOptionDisabled
                                        ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 select-none"
                                        : opt === value
                                            ? "bg-primary/10 text-primary font-bold"
                                            : "hover:bg-slate-50 text-slate-700"
                                )}
                            >
                                <span className="truncate">{opt}</span>
                                {isOptionDisabled ? (
                                    <span className="text-[9px] font-black text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded shrink-0">
                                        {t("Soon", "শিগগিরই")}
                                    </span>
                                ) : (
                                    opt === value && <RiCheckboxCircleFill className="w-4 h-4 text-primary shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function LocationSelector({
    label,
    labelBn,
    value,
    onChange,
    iconColor = "text-primary",
    required = false,
    compact = false,
}: LocationSelectorProps) {
    const { t } = useLanguage();

    const [division, setDivision] = useState("");
    const [district, setDistrict] = useState("");
    const [thana, setThana] = useState("");
    const [area, setArea] = useState("");

    const [suggestions, setSuggestions] = useState<{ display_name: string }[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const areaRef = useRef<HTMLDivElement>(null);

    // Sync internal state from value string
    useEffect(() => {
        if (value) {
            const parsed = parseAddress(value);
            // Only update if DIFFERENT to avoid infinite loops
            if (parsed.division !== division) setDivision(parsed.division);
            if (parsed.district !== district) setDistrict(parsed.district);
            if (parsed.thana !== thana) setThana(parsed.thana);
            if (parsed.area !== area) setArea(parsed.area);
        }
    }, [value]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Free OpenStreetMap Nominatim Auto-suggestions
    useEffect(() => {
        if (!area || area.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoadingSuggestions(true);
            try {
                const queryParts = [area, thana, district, division, "Bangladesh"].filter(Boolean);
                const query = queryParts.join(", ");
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=bd&limit=5`
                );
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data || []);
                }
            } catch (err) {
                console.error("Free address suggestion error", err);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [area, thana, district, division]);

    const handleDivisionChange = (val: string) => {
        setDivision(val);
        setDistrict("");
        setThana("");
        setArea("");
        onChange("");
    };

    const handleDistrictChange = (val: string) => {
        setDistrict(val);
        setThana("");
        setArea("");
        onChange("");
    };

    const handleThanaChange = (val: string) => {
        setThana(val);
        // Immediately build partial address without area
        onChange(buildAddress(division, district, val, area));
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setArea(val);
        onChange(buildAddress(division, district, thana, val));
    };

    const handleSelectSuggestion = (displayName: string) => {
        const parts = displayName.split(",");
        const shortName = parts.length > 1 ? `${parts[0].trim()}, ${parts[1].trim()}` : parts[0].trim();
        setArea(shortName);
        onChange(buildAddress(division, district, thana, shortName));
        setShowSuggestions(false);
    };

    const divisions = getDivisions();
    const districts = division ? getDistricts(division) : [];
    const thanas = district ? getThanas(division, district) : [];

    if (compact) {
        return (
            <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                    <RiMapPinFill className={cn("w-3.5 h-3.5 shrink-0", iconColor)} />
                    {t(label, labelBn)}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                    <NativeSelect
                        value={division}
                        onChange={handleDivisionChange}
                        options={divisions}
                        placeholder={t("Division", "বিভাগ")}
                        isDivisionSelect
                        compact
                    />
                    <NativeSelect
                        value={district}
                        onChange={handleDistrictChange}
                        options={districts}
                        placeholder={t("District", "জেলা")}
                        disabled={!division}
                        compact
                    />
                    <NativeSelect
                        value={thana}
                        onChange={handleThanaChange}
                        options={thanas}
                        placeholder={t("Thana", "থানা")}
                        disabled={!district}
                        compact
                    />
                    <div ref={areaRef} className="relative">
                        <input
                            type="text"
                            value={area}
                            onChange={(e) => {
                                handleAreaChange(e);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            disabled={!thana}
                            placeholder={t("Area / Village", "এলাকা / গ্রাম")}
                            className="w-full h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg font-normal text-slate-900 placeholder:font-normal placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                                {loadingSuggestions && (
                                    <div className="px-3 py-2 text-xs text-slate-500 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                        <span>{t("Searching...", "খোঁজা হচ্ছে...")}</span>
                                    </div>
                                )}
                                {!loadingSuggestions && suggestions.map((item, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelectSuggestion(item.display_name)}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-primary/5 hover:text-primary transition-all flex items-start gap-1.5 border-b border-slate-50 last:border-0 text-slate-800"
                                    >
                                        <RiMapPinFill className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{item.display_name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {value && (
                    <p className="text-[10px] text-primary font-medium flex items-center gap-1 mt-0.5">
                        <RiMapPinFill className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{value}</span>
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <RiMapPinFill className={cn("w-4 h-4 shrink-0", iconColor)} />
                {t(label, labelBn)}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {/* Step indicators */}
            <div className="flex items-center flex-wrap gap-1 mb-2">
                {[
                    { step: 1, label: t("Division", "বিভাগ"), done: !!division },
                    { step: 2, label: t("District", "জেলা"), done: !!district },
                    { step: 3, label: t("Thana", "থানা"), done: !!thana },
                    { step: 4, label: t("Area", "এলাকা"), done: !!area },
                ].map((s, i) => (
                    <React.Fragment key={s.step}>
                        <div className={cn(
                            "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all",
                            s.done
                                ? "bg-primary/10 text-primary"
                                : "bg-slate-200 text-slate-900"
                        )}>
                            <span className={cn(
                                "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-medium shrink-0",
                                s.done ? "bg-primary text-white" : "bg-slate-700 text-white"
                            )}>{s.step}</span>
                            {s.label}
                        </div>
                        {i < 3 && <div className="w-2 h-px bg-slate-300 flex-shrink-0" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-1 min-[413px]:grid-cols-2 sm:grid-cols-3 gap-3">
                <NativeSelect
                    value={division}
                    onChange={handleDivisionChange}
                    options={divisions}
                    placeholder={t("Select Division", "বিভাগ বেছে নিন")}
                    isDivisionSelect
                />
                <NativeSelect
                    value={district}
                    onChange={handleDistrictChange}
                    options={districts}
                    placeholder={t("Select District", "জেলা বেছে নিন")}
                    disabled={!division}
                />
                <NativeSelect
                    value={thana}
                    onChange={handleThanaChange}
                    options={thanas}
                    placeholder={t("Select Thana", "থানা বেছে নিন")}
                    disabled={!district}
                />
            </div>
            <div ref={areaRef} className="relative">
                <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                        handleAreaChange(e);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={!thana}
                    placeholder={t("Area / Village / Road", "এলাকা / গ্রাম / রাস্তা")}
                    className="w-full h-12 px-4 bg-white border border-slate-300 rounded-xl text-sm font-normal text-slate-900 placeholder:font-normal placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                        {loadingSuggestions && (
                            <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span>{t("Searching locations...", "ঠিকানা খোঁজা হচ্ছে...")}</span>
                            </div>
                        )}
                        {!loadingSuggestions && suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectSuggestion(item.display_name)}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-all flex items-start gap-2 border-b border-slate-50 last:border-0 text-slate-800 font-medium"
                            >
                                <RiMapPinFill className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{item.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {value && (
                <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
                    <RiMapPinFill className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary font-black leading-relaxed">{value}</p>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
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
}

function NativeSelect({ value, onChange, options, placeholder, disabled, compact }: NativeSelectProps) {
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
                    "w-full flex items-center justify-between gap-2 font-semibold text-left transition-all border rounded-lg focus:outline-none",
                    compact
                        ? "h-9 px-3 text-xs bg-white border-slate-300 text-slate-800"
                        : "h-11 px-4 text-sm bg-white border-slate-300 text-slate-900",
                    disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-primary/50 focus:ring-2 focus:ring-primary/20",
                    !value && "text-slate-500",
                    open && "border-primary ring-2 ring-primary/20"
                )}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown className={cn("w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-y-auto max-h-52 scrollbar-hide">
                    {options.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 text-sm font-semibold transition-all flex items-center justify-between",
                                opt === value
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-slate-50 text-slate-700"
                            )}
                        >
                            {opt}
                            {opt === value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                    ))}
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

    const divisions = getDivisions();
    const districts = division ? getDistricts(division) : [];
    const thanas = district ? getThanas(division, district) : [];

    if (compact) {
        return (
            <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className={cn("w-3 h-3", iconColor)} />
                    {t(label, labelBn)}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                    <NativeSelect
                        value={division}
                        onChange={handleDivisionChange}
                        options={divisions}
                        placeholder={t("Division", "বিভাগ")}
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
                    <input
                        type="text"
                        value={area}
                        onChange={handleAreaChange}
                        disabled={!thana}
                        placeholder={t("Area / Village", "এলাকা / গ্রাম")}
                        className="h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 placeholder:text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                {value && (
                    <p className="text-[10px] text-primary font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{value}</span>
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <MapPin className={cn("w-4 h-4", iconColor)} />
                {t(label, labelBn)}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {/* Step indicators */}
            <div className="flex items-center gap-1 mb-2">
                {[
                    { step: 1, label: t("Division", "বিভাগ"), done: !!division },
                    { step: 2, label: t("District", "জেলা"), done: !!district },
                    { step: 3, label: t("Thana", "থানা"), done: !!thana },
                    { step: 4, label: t("Area", "এলাকা"), done: !!area },
                ].map((s, i) => (
                    <React.Fragment key={s.step}>
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black transition-all",
                            s.done
                                ? "bg-primary/10 text-primary"
                                : "bg-slate-100 text-slate-400"
                        )}>
                            <span className={cn(
                                "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black",
                                s.done ? "bg-primary text-white" : "bg-slate-300 text-white"
                            )}>{s.step}</span>
                            {s.label}
                        </div>
                        {i < 3 && <div className="w-2 h-px bg-slate-200 flex-shrink-0" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <NativeSelect
                    value={division}
                    onChange={handleDivisionChange}
                    options={divisions}
                    placeholder={t("Select Division", "বিভাগ বেছে নিন")}
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
            <input
                type="text"
                value={area}
                onChange={handleAreaChange}
                disabled={!thana}
                placeholder={t("Area / Village / Road (optional)", "এলাকা / গ্রাম / রাস্তা (ঐচ্ছিক)")}
                className="w-full h-12 px-4 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {value && (
                <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary font-black leading-relaxed">{value}</p>
                </div>
            )}
        </div>
    );
}

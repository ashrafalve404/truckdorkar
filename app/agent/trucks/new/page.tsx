"use client";

import React, { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck,
    Upload,
    FileText,
    BookOpen,
    CreditCard,
    Hash,
    CheckCircle,
    Loader2,
    ArrowLeft,
    Eye,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TRUCK_CATEGORIES_FALLBACK = [
    { value: "T1_OPEN_7FT", label: "1 Ton Open 7 Ft", bn: "১ টন খোলা ৭ ফুট", capacity: 1, length: 7 },
    { value: "T1_COVER_7FT", label: "1 Ton Cover 7 Ft", bn: "১ টন কাভার ৭ ফুট", capacity: 1, length: 7 },
    { value: "T1_OPEN_9FT", label: "1 Ton Open 9 Ft", bn: "১ টন খোলা ৯ ফুট", capacity: 1, length: 9 },
    { value: "T1_COVER_9FT", label: "1 Ton Cover 9 Ft", bn: "১ টন কাভার ৯ ফুট", capacity: 1, length: 9 },
    { value: "T1_5_OPEN_12FT", label: "1.5 Ton Open 12 Ft", bn: "১.৫ টন খোলা ১২ ফুট", capacity: 1.5, length: 12 },
    { value: "T1_5_COVER_12FT", label: "1.5 Ton Cover 12 Ft", bn: "১.৫ টন কাভার ১২ ফুট", capacity: 1.5, length: 12 },
];

interface DocUploadProps {
    label: string;
    labelBn: string;
    icon: React.ReactNode;
    file: File | null;
    onFileChange: (file: File | null) => void;
    required?: boolean;
}

function DocUploader({ label, labelBn, icon, file, onFileChange, required }: DocUploadProps) {
    const { t } = useLanguage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (f: File) => {
        onFileChange(f);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {icon}
                {t(label, labelBn)}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-slate-50",
                    file ? "border-green-400 bg-green-50" : "border-slate-300 hover:border-primary"
                )}
            >
                {preview ? (
                    <div className="relative">
                        <img src={preview} alt="preview" className="max-h-32 mx-auto rounded-lg object-contain" />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onFileChange(null); setPreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-slate-400" />
                        <p className="text-xs font-bold text-slate-600">
                            {t("Click or drag to upload", "ছবি আপলোড করুন")}
                        </p>
                        <p className="text-[10px] text-slate-400">{t("JPG, PNG, PDF supported", "JPG, PNG, PDF সাপোর্টেড")}</p>
                    </div>
                )}
                {file && !preview && (
                    <p className="text-xs font-bold text-green-600 mt-2">{file.name}</p>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
        </div>
    );
}

export default function AgentAddTruckPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    React.useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await api.get("/cms/content/SYSTEM_SETTINGS");
                const meta = response.data?.data?.metaJson || {};
                const list = meta.truckFares;
                if (Array.isArray(list) && list.length > 0) {
                    const active = list.filter((tc: any) => tc.isActive !== false);
                    setCategories(active.map((tc: any) => ({
                        value: tc.id,
                        label: tc.nameEn,
                        bn: tc.nameBn,
                        capacity: tc.capacityTon || 1,
                        length: tc.lengthFt || 9
                    })));
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };
        loadCategories();
    }, []);

    const displayCategories = categories.length > 0 ? categories : TRUCK_CATEGORIES_FALLBACK;

    const [form, setForm] = useState({
        name: "",
        registrationNo: "",
        numberPlateText: "",
        category: "",
        capacityTon: "",
        lengthFt: "",
        make: "",
        model: "",
        year: "",
        color: "",
        description: "",
        driverPhone: "",
    });

    const [files, setFiles] = useState<{
        taxTokenFile: File | null;
        blueBookFile: File | null;
        numberPlateFile: File | null;
        roadPermitFile: File | null;
        drivingLicenseFile: File | null;
    }>({
        taxTokenFile: null,
        blueBookFile: null,
        numberPlateFile: null,
        roadPermitFile: null,
        drivingLicenseFile: null,
    });

    const handleCategoryChange = (val: string) => {
        const cat = displayCategories.find(c => c.value === val);
        if (cat) {
            setForm({
                ...form,
                category: val,
                capacityTon: cat.capacity.toString(),
                lengthFt: cat.length.toString()
            });
        } else {
            setForm({ ...form, category: val });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.registrationNo || !form.numberPlateText || !form.category || !form.capacityTon || !form.lengthFt || !form.driverPhone) {
            toast.error(t("Please fill all required fields", "সব প্রয়োজনীয় তথ্য পূরণ করুন"));
            return;
        }
        if (!files.taxTokenFile || !files.blueBookFile || !files.numberPlateFile || !files.roadPermitFile || !files.drivingLicenseFile) {
            toast.error(t("Please upload all vehicle documents", "সব প্রয়োজনীয় ভেহিকল ডকুমেন্ট আপলোড করুন"));
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
            formData.append("taxTokenFile", files.taxTokenFile);
            formData.append("blueBookFile", files.blueBookFile);
            formData.append("numberPlateFile", files.numberPlateFile);
            formData.append("roadPermitFile", files.roadPermitFile);
            if (files.drivingLicenseFile) formData.append("drivingLicenseFile", files.drivingLicenseFile);

            const res = await api.post("/agents/trucks", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.info) {
                toast(res.data.info, { icon: "⚠️" });
            }

            toast.success(t("Truck submitted for admin review!", "ট্রাক অ্যাডমিনের পর্যালোচনার জন্য জমা দেওয়া হয়েছে!"));
            router.push("/agent/trucks");
        } catch (error: any) {
            const msg = error?.response?.data?.message;
            toast.error(typeof msg === "string" ? msg : t("Failed to submit truck", "ট্রাক জমা দিতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

    return (
        <DashboardLayout requiredRole="AGENT">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <Link href="/agent/trucks" className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">
                            {t("Register New Truck", "নতুন ট্রাক নিবন্ধন করুন")}
                        </h1>
                        <p className="text-slate-600 font-bold text-sm">
                            {t("Fill in all details and upload required documents for admin approval.", "অ্যাডমিনের অনুমোদনের জন্য সব তথ্য ও ডকুমেন্ট দিন।")}
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="font-black text-slate-900">{t("Truck Basic Information", "ট্রাকের মূল তথ্য")}</h2>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Truck Name / Model", "ট্রাকের নাম / মডেল")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder={t("e.g. Tata 407 Pickup", "যেমন: টাটা ৪০৭ পিকআপ")}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Registration No", "রেজিস্ট্রেশন নং")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.registrationNo}
                                    onChange={e => setForm({ ...form, registrationNo: e.target.value })}
                                    placeholder="e.g. DHA-TA-12-1234"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Number Plate (Text)", "নাম্বার প্লেট (টেক্সট)")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.numberPlateText}
                                    onChange={e => setForm({ ...form, numberPlateText: e.target.value })}
                                    placeholder="e.g. ঢাকা মেট্রো চ ১২-১২৩৪"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Driver Phone Number", "ড্রাইভার ফোন নম্বর")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.driverPhone}
                                    onChange={e => setForm({ ...form, driverPhone: e.target.value })}
                                    placeholder="01XXXXXXXXX"
                                />
                                <p className="text-[10px] text-amber-600 font-bold">
                                    {t("Important: Driver must already be registered with this phone number.", "গুরুত্বপূর্ণ: ড্রাইভার অবশ্যই এই ফোন নম্বরটি দিয়ে আগে থেকেই নিবন্ধিত থাকতে হবে।")}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Truck Type / Category", "ট্রাকের ধরণ / ক্যাটাগরি")} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className={inputClass}
                                    value={form.category}
                                    onChange={e => handleCategoryChange(e.target.value)}
                                >
                                    <option value="">{t("Select type", "ধরণ বেছে নিন")}</option>
                                    {displayCategories.map((c: any) => (
                                        <option key={c.value} value={c.value}>{t(c.label, c.bn)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 opacity-60 pointer-events-none">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Capacity (Ton)", "ধারণক্ষমতা (টন)")}
                                </label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={form.capacityTon}
                                    readOnly
                                    placeholder="e.g. 5"
                                />
                            </div>

                            <div className="space-y-2 opacity-60 pointer-events-none">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Length (Feet)", "দৈর্ঘ্য (ফুট)")}
                                </label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={form.lengthFt}
                                    readOnly
                                    placeholder="e.g. 14"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Manufacturer (Make)", "প্রস্তুতকারক")}
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.make}
                                    onChange={e => setForm({ ...form, make: e.target.value })}
                                    placeholder="e.g. Tata, Isuzu"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Year", "বছর")}
                                </label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: e.target.value })}
                                    placeholder="e.g. 2020"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Color", "রঙ")}
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.color}
                                    onChange={e => setForm({ ...form, color: e.target.value })}
                                    placeholder={t("e.g. White", "যেমন: সাদা")}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {t("Description / Notes", "বিবরণ / মন্তব্য")}
                                </label>
                                <textarea
                                    className={cn(inputClass, "h-24 pt-3 resize-none")}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder={t("Any additional details about the truck...", "ট্রাক সম্পর্কে অতিরিক্ত তথ্য...")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document Upload Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 bg-amber-50/50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900">{t("Required Documents", "প্রয়োজনীয় ডকুমেন্টস")}</h2>
                                <p className="text-xs text-amber-700 font-bold">{t("All 4 documents are mandatory", "সব ৪টি ডকুমেন্ট আবশ্যক")}</p>
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DocUploader
                                label="Road Permit"
                                labelBn="রোড পারমিট"
                                icon={<FileText className="w-4 h-4 text-slate-500" />}
                                file={files.roadPermitFile}
                                onFileChange={f => setFiles({ ...files, roadPermitFile: f })}
                                required
                            />
                            <DocUploader
                                label="Tax Token"
                                labelBn="ট্যাক্স টোকেন"
                                icon={<CreditCard className="w-4 h-4 text-slate-500" />}
                                file={files.taxTokenFile}
                                onFileChange={f => setFiles({ ...files, taxTokenFile: f })}
                                required
                            />
                            <DocUploader
                                label="Blue Book (Registration Certificate)"
                                labelBn="বুলু বুক (রেজিস্ট্রেশন সার্টিফিকেট)"
                                icon={<BookOpen className="w-4 h-4 text-slate-500" />}
                                file={files.blueBookFile}
                                onFileChange={f => setFiles({ ...files, blueBookFile: f })}
                                required
                            />
                            <DocUploader
                                label="Number Plate Photo"
                                labelBn="নাম্বার প্লেটের ছবি"
                                icon={<Hash className="w-4 h-4 text-slate-500" />}
                                file={files.numberPlateFile}
                                onFileChange={f => setFiles({ ...files, numberPlateFile: f })}
                                required
                            />
                            <DocUploader
                                label="Driving License"
                                labelBn="ড্রাইভিং লাইসেন্স"
                                icon={<CreditCard className="w-4 h-4 text-slate-500" />}
                                file={files.drivingLicenseFile}
                                onFileChange={f => setFiles({ ...files, drivingLicenseFile: f })}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4 pb-10">
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="h-14 px-12 rounded-xl font-black text-base gap-3 shadow-xl shadow-primary/20 text-white"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            {t("Submit for Admin Approval", "অ্যাডমিনের অনুমোদনের জন্য জমা দিন")}
                        </Button>
                        <Link href="/agent/trucks" className="text-slate-600 font-bold text-sm hover:underline">
                            {t("Cancel", "বাতিল")}
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

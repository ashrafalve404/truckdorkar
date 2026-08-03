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

const TRUCK_CATEGORIES = [
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

    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {icon}
                {t(label, labelBn)}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div
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
                        <p className="text-xs font-bold text-slate-600">{t("Click to upload", "ছবি আপলোড করুন")}</p>
                    </div>
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

export default function DriverAddTruckPage() {
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
                    const activeTrucks = list.filter((truck: any) => truck.isActive !== false);
                    setCategories(activeTrucks.map((tc: any) => ({
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

    const fallbacks = [
        { value: "T1_OPEN_7_9FT", label: "1 Ton Open 7/9 Ft", bn: "১ টন খোলা ৭/৯ ফুট", capacity: 1, length: 9 },
        { value: "T1_COVER_7_9FT", label: "1 Ton Cover 7/9 Ft", bn: "১ টন কাভার ৭/৯ ফুট", capacity: 1, length: 9 },
        { value: "T1_5_OPEN_10_12FT", label: "1.5 Ton Open 10/12 Ft", bn: "১.৫ টন খোলা ১০/১২ ফুট", capacity: 1.5, length: 12 },
        { value: "T1_5_COVER_10_12FT", label: "1.5 Ton Cover 10/12 Ft", bn: "১.৫ টন কাভার ১০/১২ ফুট", capacity: 1.5, length: 12 },
        { value: "T3_OPEN_16_14FT", label: "3 Ton Open 14/16 Ft", bn: "৩ টন খোলা ১৪/১৬ ফুট", capacity: 3, length: 16 },
        { value: "T3_COVER_16_14FT", label: "3 Ton Cover 14/16 Ft", bn: "৩ টন কাভার ১৪/১৬ ফুট", capacity: 3, length: 16 },
    ];

    const displayCategories = categories.length > 0 ? categories : fallbacks;

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.registrationNo || !form.category || !form.capacityTon || !form.lengthFt) {
            toast.error(t("Please fill all required fields", "সব প্রয়োজনীয় তথ্য পূরণ করুন"));
            return;
        }

        if (!files.roadPermitFile || !files.taxTokenFile || !files.blueBookFile || !files.numberPlateFile || !files.drivingLicenseFile) {
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
            formData.append("drivingLicenseFile", files.drivingLicenseFile);

            await api.post("/trucks", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(t("Truck submitted for review!", "ট্রাক পর্যালোচনার জন্য জমা দেওয়া হয়েছে!"));
            router.push("/driver/trucks");
        } catch (error: any) {
            toast.error(t("Failed to add truck", "ট্রাক যোগ করতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-950 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

    return (
        <DashboardLayout requiredRole="DRIVER">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <Link href="/driver/trucks" className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">{t("Add My Truck", "আমার ট্রাক যোগ করুন")}</h1>
                        <p className="text-slate-600 font-bold text-sm">{t("Register your vehicle to start receiving bookings.", "বুকিং পেতে আপনার বাহন নিবন্ধন করুন।")}</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">{t("Truck Name", "ট্রাকের নাম")} *</label>
                                <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tata ACE, etc." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">{t("Registration No", "রেজিস্ট্রেশন নং")} *</label>
                                <input className={inputClass} value={form.registrationNo} onChange={e => setForm({ ...form, registrationNo: e.target.value })} placeholder="DHA-MA-11-2222" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">{t("Truck Type / Category", "ট্রাকের ধরণ / ক্যাটাগরি")} *</label>
                                <select className={inputClass} value={form.category} onChange={e => handleCategoryChange(e.target.value)}>
                                    <option value="">{t("Select Type", "ধরণ বেছে নিন")}</option>
                                    {displayCategories.map(c => <option key={c.value} value={c.value}>{t(c.label, c.bn)}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 opacity-60 pointer-events-none">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">{t("Capacity (Ton)", "ধারণক্ষমতা (টন)")}</label>
                                <input type="number" className={inputClass} value={form.capacityTon} readOnly placeholder="1, 1.5, etc." />
                            </div>
                            <div className="space-y-2 opacity-60 pointer-events-none">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">{t("Length (Feet)", "দৈর্ঘ্য (ফুট)")}</label>
                                <input type="number" className={inputClass} value={form.lengthFt} readOnly placeholder="7, 9, etc." />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="font-black text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                {t("Vehicle Documents", "গাড়ির ডকুমেন্টস")}
                            </h2>
                            <p className="text-xs text-amber-700 font-bold">{t("All 5 documents are mandatory", "সব ৫টি ডকুমেন্টই আবশ্যক")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DocUploader label="Road Permit" labelBn="রোড পারমিট" icon={<FileText className="w-4 h-4 text-slate-400" />} file={files.roadPermitFile} onFileChange={f => setFiles({ ...files, roadPermitFile: f })} required />
                            <DocUploader label="Tax Token" labelBn="ট্যাক্স টোকেন" icon={<CreditCard className="w-4 h-4 text-slate-400" />} file={files.taxTokenFile} onFileChange={f => setFiles({ ...files, taxTokenFile: f })} required />
                            <DocUploader label="Blue Book (Registration Certificate)" labelBn="বুলু বুক (রেজিস্ট্রেশন সার্টিফিকেট)" icon={<BookOpen className="w-4 h-4 text-slate-400" />} file={files.blueBookFile} onFileChange={f => setFiles({ ...files, blueBookFile: f })} required />
                            <DocUploader label="Number Plate Photo" labelBn="নাম্বার প্লেটের ছবি" icon={<Hash className="w-4 h-4 text-slate-400" />} file={files.numberPlateFile} onFileChange={f => setFiles({ ...files, numberPlateFile: f })} required />
                            <DocUploader label="Driving License" labelBn="ড্রাইভিং লাইসেন্স" icon={<CreditCard className="w-4 h-4 text-slate-400" />} file={files.drivingLicenseFile} onFileChange={f => setFiles({ ...files, drivingLicenseFile: f })} required />
                        </div>
                    </div>

                    <div className="pb-10">
                        <Button disabled={submitting} className="h-14 px-12 rounded-xl font-black text-white shadow-xl shadow-primary/20">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                            {t("Register Truck for Review", "রিভিউর জন্য জমা দিন")}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

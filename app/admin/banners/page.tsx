"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Trash2,
    ImageIcon,
    Loader2,
    Check,
    X,
    Upload,
    ExternalLink,
    MoveUp,
    MoveDown,
    Eye,
    EyeOff
} from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Banner {
    id: string;
    titleEn: string;
    titleBn?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
}

export default function AdminBannersPage() {
    const { t } = useLanguage();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    const [form, setForm] = useState({
        titleEn: "",
        titleBn: "",
        imageUrl: "",
        linkUrl: "",
        sortOrder: 0,
        isActive: true,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const fetchBanners = async () => {
        try {
            const res = await api.get("/cms/banners/admin").catch(() => api.get("/cms/banners/all")).catch(() => api.get("/cms/banners"));
            setBanners(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch banners", error);
            toast.error(t("Failed to load banners", "ব্যানার লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalImageUrl = form.imageUrl;

            if (selectedFile) {
                setUploadingFile(true);
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await api.post("/cms/banners/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                finalImageUrl = uploadRes.data?.url || uploadRes.data?.data?.url;
            }

            if (!finalImageUrl) {
                toast.error(t("Please upload an image or provide an Image URL", "দয়া করে একটি ব্যানার ছবি আপলোড করুন"));
                setSubmitting(false);
                return;
            }

            await api.post("/cms/banners", {
                titleEn: form.titleEn || "Sliding Banner",
                titleBn: form.titleBn || "স্লাইডিং ব্যানার",
                imageUrl: finalImageUrl,
                linkUrl: form.linkUrl || undefined,
                sortOrder: Number(form.sortOrder) || 0,
                isActive: form.isActive,
            });

            toast.success(t("Banner created successfully!", "ব্যানার সফলভাবে তৈরি করা হয়েছে!"));
            setShowModal(false);
            setForm({ titleEn: "", titleBn: "", imageUrl: "", linkUrl: "", sortOrder: 0, isActive: true });
            setSelectedFile(null);
            setPreviewUrl("");
            fetchBanners();
        } catch (error: any) {
            console.error("Failed to create banner", error);
            toast.error(error.response?.data?.message || t("Failed to save banner", "ব্যানার সেভ করতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmitting(false);
            setUploadingFile(false);
        }
    };

    const handleToggleActive = async (banner: Banner) => {
        try {
            await api.patch(`/cms/banners/${banner.id}`, { isActive: !banner.isActive });
            toast.success(banner.isActive ? t("Banner deactivated", "ব্যানার ডি-অ্যাক্টিভ করা হয়েছে") : t("Banner activated", "ব্যানার অ্যাক্টিভ করা হয়েছে"));
            fetchBanners();
        } catch (error) {
            toast.error(t("Failed to update status", "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে"));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("Are you sure you want to delete this banner?", "আপনি কি নিশ্চিতভাবে এই ব্যানারটি মুছে ফেলতে চান?"))) return;
        try {
            await api.delete(`/cms/banners/${id}`);
            toast.success(t("Banner deleted successfully", "ব্যানার মুছে ফেলা হয়েছে"));
            fetchBanners();
        } catch (error) {
            toast.error(t("Failed to delete banner", "ব্যানার মুছতে ব্যর্থ হয়েছে"));
        }
    };

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                        <ImageIcon className="w-8 h-8 text-primary" />
                        {t("Home Page Sliding Banners", "হোম পেজ স্লাইডার ব্যানার")}
                    </h1>
                    <p className="text-slate-600 font-medium text-sm">
                        {t("Upload and manage custom sliding banners (Recommended: 1400 × 650 pixels).", "হোম পেজ ও মোবাইল অ্যাপের জন্য স্লাইডিং ব্যানার আপলোড করুন (সুপারিশকৃত সাইজ: ১৪০০ × ৬৫০ পিক্সেল)।")}
                    </p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-6 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    {t("Add New Banner", "নতুন ব্যানার যোগ করুন")}
                </Button>
            </header>

            {loading ? (
                <div className="bg-white rounded-2xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-slate-600 font-bold text-sm">{t("Loading banners...", "ব্যানার লোড হচ্ছে...")}</p>
                </div>
            ) : banners.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center shadow-sm space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{t("No Custom Banners Uploaded Yet", "কোনো নতুন ব্যানার আপলোড করা হয়নি")}</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        {t("Currently showing default built-in banners. Upload a new banner to override fallback banners.", "বর্তমানে ডিফল্ট বিল্ট-ইন ব্যানারসমূহ দেখানো হচ্ছে। কাস্টম ব্যানার দেখাতে নতুন ব্যানার যোগ করুন।")}
                    </p>
                    <Button onClick={() => setShowModal(true)} className="bg-primary text-white font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("Upload First Banner", "প্রথম ব্যানার আপলোড করুন")}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((b) => (
                        <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                            <div>
                                <div className="relative w-full h-44 bg-slate-900">
                                    <Image
                                        src={getFileUrl(b.imageUrl)}
                                        alt={b.titleEn}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute top-3 right-3 flex items-center gap-2">
                                        <span className={`text-xs font-black px-3 py-1 rounded-full shadow-md backdrop-blur-md ${b.isActive ? "bg-emerald-500/90 text-white" : "bg-slate-700/90 text-slate-200"}`}>
                                            {b.isActive ? t("Active", "অ্যাক্টিভ") : t("Disabled", "নিষ্ক্রিয়")}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-black px-2.5 py-1 rounded-md backdrop-blur-md">
                                        Order: {b.sortOrder}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-black text-slate-900 text-base">{b.titleEn}</h3>
                                    {b.titleBn && <p className="text-slate-500 text-xs font-bold mt-0.5">{b.titleBn}</p>}
                                    {b.linkUrl && (
                                        <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold flex items-center gap-1 mt-2 hover:underline">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            {b.linkUrl}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActive(b)}
                                    className={b.isActive ? "text-slate-600 border-slate-200" : "text-emerald-600 border-emerald-200 bg-emerald-50"}
                                >
                                    {b.isActive ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
                                    {b.isActive ? t("Hide", "লুকান") : t("Show", "দেখান")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(b.id)}
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    {t("Delete", "মুছুন")}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{t("Upload New Banner", "নতুন ব্যানার আপলোড করুন")}</h2>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                {t("Fill in the details below to add a sliding banner to the home page.", "হোম পেজের জন্য নতুন স্লাইডিং ব্যানার যোগ করুন।")}
                            </p>
                        </div>

                        {/* Size Recommendation Highlight Box */}
                        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-xs">
                                📐
                            </div>
                            <div className="text-xs space-y-1">
                                <p className="font-black text-amber-950 uppercase tracking-wider">
                                    {t("Recommended Banner Size", "সুপারিশকৃত ব্যানার সাইজ")}
                                </p>
                                <p className="font-bold text-amber-900 leading-relaxed">
                                    {t("Dimensions: 1400 × 650 Pixels (Aspect Ratio 2.15:1)", "সাইজ: ১৪০০ × ৬৫০ পিক্সেল (অনুপাত ২.১৫:১)")}
                                </p>
                                <p className="text-amber-700 font-medium text-[11px]">
                                    {t("Format: WEBP, PNG, JPG | Max size: 5MB", "ফরম্যাট: WEBP, PNG, JPG | সর্বোচ্চ ফাইল সাইজ: ৫MB")}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* File Upload Box */}
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
                                    {t("Banner Image File", "ব্যানার ছবি")}
                                </label>
                                <div className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {previewUrl ? (
                                        <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-sm">
                                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 py-2">
                                            <Upload className="w-8 h-8 text-primary" />
                                            <p className="text-sm font-bold text-slate-700">{t("Click or drag image file here to upload", "ছবি বেছে নিতে এখানে ক্লিক করুন")}</p>
                                            <p className="text-xs font-bold text-primary">
                                                {t("Ideal Size: 1400 x 650 px", "আইডিয়াল সাইজ: ১৪০০ x ৬৫০ পিক্সেল")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                                        {t("Title (English)", "টাইটেল (ইংরেজি)")}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.titleEn}
                                        onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                                        placeholder="e.g. Special Discount Banner"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                                        {t("Title (Bangla)", "টাইটেল (বাংলা)")}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.titleBn}
                                        onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                                        placeholder="উদা: স্পেশাল অফার"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                                    {t("Redirect Link (Optional)", "লিংক (ঐচ্ছিক)")}
                                </label>
                                <input
                                    type="text"
                                    value={form.linkUrl}
                                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                                    placeholder="https://truckdorkar.com/offers"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                                        {t("Sort Order", "প্রদর্শন ক্রম")}
                                    </label>
                                    <input
                                        type="number"
                                        value={form.sortOrder}
                                        onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                                        {t("Status", "স্ট্যাটাস")}
                                    </label>
                                    <select
                                        value={form.isActive ? "true" : "false"}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="true">{t("Active", "অ্যাক্টিভ")}</option>
                                        <option value="false">{t("Inactive", "নিষ্ক্রিয়")}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    {t("Cancel", "বাতিল")}
                                </Button>
                                <Button type="submit" disabled={submitting} className="bg-primary text-white font-bold px-6">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {t("Save Banner", "ব্যানার সেভ করুন")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getAvatarUrl(avatar?: string | null): string | null {
    if (!avatar) return null;
    if (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("data:")) {
        return avatar;
    }
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL ||
        (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v\d+\/?$/, "") : "http://localhost:5000");
    const cleanOrigin = backendBase.replace(/\/$/, "");
    return `${cleanOrigin}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
}

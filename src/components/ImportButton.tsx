"use client"

import {IconUpload} from "@tabler/icons-react";
import {useUserPreferencesStore} from "@/store/userPreferencesStore";
import {z} from "zod";
import {useRouter} from "next/navigation";

export const PreferenceSchema = z.object({
    favourites: z.array(z.string()),
    colors: z.object({
        red: z.string(),
        yellow: z.string(),
        green: z.string(),
    })
});

export default function ImportButton() {
    const {importPreferences} = useUserPreferencesStore()
    const router = useRouter()

    const readPreferences = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    const preferences = PreferenceSchema.parse(json.state);
                    importPreferences(preferences)
                    resolve(true);
                } catch (err) {
                    alert("Invalid File Format")
                    resolve(false);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const success = await readPreferences(file);
            if (success)
                router.refresh()
        }
    };

    return (
        <label className="flex justify-center gap-x-1 w-full hover:text-yellow-400 items-center">
            <div className="w-6 flex justify-center flex-shrink-0">
                <IconUpload size={20}/>
            </div>
            <div className="text-sm font-medium">import</div>
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden"/>
        </label>
    );
}
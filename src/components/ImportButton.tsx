import { IconUpload } from "@tabler/icons-react";
import { readPreferences } from "@/app/lib/utils";

export default function ImportButton({ onImportSuccess }: { onImportSuccess: () => void }) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const success = await readPreferences(file);
            if (success) onImportSuccess();
        }
    };

    return (
        <label className="flex gap-x-3 w-full p-1 hover:bg-darkmode-soft-white dark:hover:bg-gray-700 rounded-md transition-colors items-center cursor-pointer">
            <div className="w-6 flex justify-center flex-shrink-0">
                <IconUpload size={20} className="text-yellow-500" />
            </div>
            <div className="text-sm font-medium">import</div>
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </label>
    );
}
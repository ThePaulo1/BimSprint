import { IconDownload } from "@tabler/icons-react";
import { savePreferences } from "@/app/lib/utils";

export default function ExportButton() {
    return (
        <button
            onClick={savePreferences}
            className="flex gap-x-3 w-full p-1 hover:bg-darkmode-soft-white dark:hover:bg-gray-700 rounded-md transition-colors items-center"
        >
            <div className="w-6 flex justify-center flex-shrink-0">
                <IconDownload size={20} className="text-blue-500" />
            </div>
            <div className="text-sm font-medium">export</div>
        </button>
    );
}
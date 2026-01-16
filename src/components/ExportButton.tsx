import { IconDownload } from "@tabler/icons-react";
import { savePreferences } from "@/app/lib/utils";

export default function ExportButton() {
    return (
        <button
            onClick={savePreferences}
            className="flex gap-x-1 w-full hover:text-yellow-400 items-center"
        >
            <div className="w-6 flex justify-center flex-shrink-0">
                <IconDownload size={20} />
            </div>
            <div className="text-sm font-medium">export</div>
        </button>
    );
}
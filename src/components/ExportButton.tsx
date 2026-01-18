"use client"

import {IconDownload} from "@tabler/icons-react";

export default function ExportButton() {
    const exportPreferences = () => {
        const data = localStorage.getItem('preferences');

        if (!data) return;
        const blob = new Blob([data], {type: "application/json"});

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);

        link.download = "bimsprint-preferences.json";
        link.click();
    }

    return (
        <button
            onClick={exportPreferences}
            className="flex gap-x-1 w-full hover:text-yellow-400 items-center justify-center"
        >
            <div className="w-6 flex justify-center flex-shrink-0">
                <IconDownload size={20}/>
            </div>
            <div className="text-sm font-medium">export</div>
        </button>
    );
}
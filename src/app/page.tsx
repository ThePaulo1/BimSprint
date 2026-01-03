import Link from "next/link";
import { IconMapPin, IconChevronRight } from "@tabler/icons-react";

const stops = [
    "Stephansplatz", "Börse", "Lassallestraße", "Hauptbahnhof S U",
    "Julius-Raab-Platz", "Stubentor U, Dr.-Karl-Lueger-Platz",
    "Weihburggasse", "Schwarzenbergplatz", "Oper, Karlsplatz U", "Burgring"
];

export default function Stops() {
    return (
        <main className="h-screen flex flex-col bg-white dark:bg-[#121212] text-slate-900 dark:text-slate-100 overflow-hidden">
            <header className="p-6 pb-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Stationen</h1>
                <p className="text-slate-500 dark:text-slate-400">Wähle eine Haltestelle</p>
            </header>

            {/* Scrollbarer Bereich */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {stops.map((stop) => (
                    <Link
                        key={stop}
                        href={`/stop/${encodeURIComponent(stop)}`}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#2e2e2e] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#252525] transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <IconMapPin size={20} className="text-blue-600 dark:text-blue-500" />
                            <span className="font-semibold">{stop}</span>
                        </div>
                        <IconChevronRight size={20} className="text-slate-400" />
                    </Link>
                ))}
            </div>
        </main>
    );
}
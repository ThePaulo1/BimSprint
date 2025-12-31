import Link from "next/link";

const stops = [
    "Stephansplatz", "Börse", "Lassallestraße", "Hauptbahnhof S U",
    "Julius-Raab-Platz", "Stubentor U, Dr.-Karl-Lueger-Platz",
    "Weihburggasse", "Schwarzenbergplatz", "Oper, Karlsplatz U", "Burgring"
];

export default function Stops() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors duration-300">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Stationen</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Wählen Sie Ihre Haltestelle aus</p>

                <div className="grid gap-3">
                    {stops.map((stop) => (
                        <Link
                            key={stop}
                            href={`/stop/${encodeURIComponent(stop)}`}
                            className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all active:scale-[0.98]"
                        >
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{stop}</span>
                            <svg className="w-5 h-5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
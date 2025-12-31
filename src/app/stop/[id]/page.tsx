import Link from "next/link";

const stopData: Record<string, string[]> = {
    "Stephansplatz": ["U1 Oberlaa", "U1 Leopoldau", "U3 Ottakring", "U3 Simmering"],
    "Börse": ["1 Prater Hauptallee", "1 Stefan-Fadinger-Platz", "71 Kaiserebersdorf", "D Nußdorf"],
    "Lassallestraße": ["80A Praterstern", "80A Neu Marx"],
    "Hauptbahnhof S U": ["U1 Oberlaa", "U1 Leopoldau", "18 Burggasse-Stadthalle", "D Absberggasse"],
    "Julius-Raab-Platz": ["1 Prater Hauptallee", "2 Dornbach", "2 Friedrich-Engels-Platz"],
    "Stubentor U, Dr.-Karl-Lueger-Platz": ["U3 Ottakring", "U3 Simmering", "2 Dornbach"],
    "Weihburggasse": ["2 Dornbach", "2 Friedrich-Engels-Platz"],
    "Schwarzenbergplatz": ["2 Dornbach", "71 Kaiserebersdorf", "D Nußdorf"],
    "Oper, Karlsplatz U": ["U1 Oberlaa", "U4 Heiligenstadt", "1 Stefan-Fadinger-Platz", "62 Lainz"],
    "Burgring": ["1 Prater Hauptallee", "2 Dornbach", "71 Kaiserebersdorf", "D Nußdorf"]
};

interface StopProps {
    params: Promise<{ id: string }>;
}

export default async function StopDetail({ params }: StopProps) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const directions = stopData[decodedId] || [];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors duration-300">
            <div className="max-w-md mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">{decodedId}</h1>
                    <div className="h-1.5 w-16 bg-blue-600 dark:bg-blue-500 mt-2 rounded-full"></div>
                </div>

                <div className="grid gap-4">
                    {directions.map((direction) => {
                        const line = direction.split(" ")[0];
                        const destination = direction.replace(line, "").trim();

                        return (
                            <Link
                                key={direction}
                                href={`/monitor/${encodeURIComponent(direction)}`}
                                className="flex items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all group"
                            >
                                <div className="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold text-lg group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors shadow-inner">
                                    {line}
                                </div>
                                <div className="ml-4">
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black">Richtung</p>
                                    <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-tight">{destination}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
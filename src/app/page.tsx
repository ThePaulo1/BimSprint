import Link from "next/link";

const stops = [
    "Stephansplatz",
    "Börse",
    "Lassallestraße",
    "Hauptbahnhof S U",
    "Julius-Raab-Platz",
    "Stubentor U, Dr.-Karl-Lueger-Platz",
    "Weihburggasse",
    "Schwarzenbergplatz",
    "Oper, Karlsplatz U",
    "Burgring"
]

export default function Stops() {
    return (
        <div className="flex flex-col">
            {stops.map((stop) => (
                <Link href={"stop/" + stop} key={stop}>
                    {stop}
                </Link>
            ))}
        </div>
    )
}
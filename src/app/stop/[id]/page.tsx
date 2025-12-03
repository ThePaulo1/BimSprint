import Link from "next/link";

const directions = [
    "U1 Oberlaa",
    "U1 Leopoldau",
    "U3 Ottakring",
    "U3 Simmering"
]

interface StopProps {
    params: Promise<{ id: string; }>;
}

export default async function Stops({params}: StopProps) {
    const {id} = await params

    return (
        <div className="flex flex-col p-8 gap-y-4">
        {directions.map((direction) => (
                <Link href={"/monitor/" + direction} key={direction}>
                    {direction}
                </Link>
            ))}
        </div>
    )
}
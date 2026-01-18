import Settings from "./Settings";
import Link from "next/link";

export default function Menu() {
    return (
        <nav className="flex mx-8 mt-4">
            <Link href={"/"} className="flex-1">{">Bim>>Sprint"}</Link>
            <div className="flex-1 flex justify-end">
            <Settings/>
            </div>
        </nav>
    )
}
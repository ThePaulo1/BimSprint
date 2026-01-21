"use client"

import Settings from "./Settings/Settings";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Menu() {
    const pathname = usePathname();

    return (
        <nav className="flex mx-8 mt-4">
            <Link
                href={"/"}
                className="flex-1"
                data-umami-event="Logo button"
                data-umami-event-from={pathname}
            >
                {"🔮 BimSprint"}</Link>
            <div className="flex-1 flex justify-end">
                <Settings/>
            </div>
        </nav>
    )
}
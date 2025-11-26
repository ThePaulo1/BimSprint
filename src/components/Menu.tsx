import Settings from "./Settings";
import StopPicker from "./StopPicker";
import Link from "next/link";

export default function Menu() {
    return (
        <div className="flex justify-around ">
            <Link href={"/"}>{">Bim>>Sprint"}</Link>
            <StopPicker/>
            <Settings/>
        </div>
    )
}
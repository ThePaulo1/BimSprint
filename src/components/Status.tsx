import type {ReactNode} from "react";

export default function Status({children}: { children: ReactNode }) {

    return (
        <div className="bg-red-500 w-screen h-screen">
            {children}
            <div className="italic">Miss</div>
        </div>
    )
}
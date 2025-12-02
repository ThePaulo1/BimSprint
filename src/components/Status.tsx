import type {ReactNode} from "react";

export default function Status({children}: { children: ReactNode }) {

    return (
        <div className="h-full">
            {children}
            <div className="italic">Miss</div>
        </div>
    )
}
import Metrics from "../../../components/Metrics";
import Status from "../../../components/Status";

interface MonitorProps {
    params: Promise<{ id: string; }>;
}

export default async function Monitor({params}: MonitorProps) {
    const {id} = await params

    return (
        <>
            <Status>
                {id}
                <Metrics/>
            </Status>
        </>
    )
}
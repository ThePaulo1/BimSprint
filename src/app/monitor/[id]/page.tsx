import Metrics from "../../../components/Metrics";
import SafeTime from "../../../components/SafeScheduleLocation";

interface MonitorProps {
    params: Promise<{ id: string; }>;
}

export default async function Monitor({params}: MonitorProps) {
    const {id} = await params

    return (
        <>
        <SafeTime diva={id}/>
        <Metrics diva={id} />
        </>
    )
}
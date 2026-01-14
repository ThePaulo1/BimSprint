import Metrics from "../../../components/Metrics";

interface MonitorProps {
    params: Promise<{ id: string; }>;
}

export default async function Monitor({params}: MonitorProps) {
    const {id} = await params

    return (
        <Metrics diva={id} />
    )
}
import {NextRequest, NextResponse} from "next/server";
import {ApiResponse} from "@/app/lib/wl-types/realtime";

export async function GET(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params

    try {
        const response = await fetch("https://www.wienerlinien.at/ogd_realtime/monitor?diva=" + id, {
            next: {revalidate: 360},
            cache: "force-cache",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(!response.ok) {
            return NextResponse.json({error: 'Failed to fetch data'}, {status: 500});
        }

        const monitors = (await response.json() as ApiResponse).data.monitors;

        return NextResponse.json(monitors, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.SERVER_URL ?? "*",
            },
        });
    } catch (error) {
        return NextResponse.json({error: 'Failed to fetch data'}, {status: 500});
    }
}
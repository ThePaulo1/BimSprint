import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const diva = searchParams.get('diva');
    const rbl = searchParams.get('rbl');
    let url = diva
        ? `https://www.wienerlinien.at/ogd_realtime/monitor?diva=${diva}`
        : `https://www.wienerlinien.at/ogd_realtime/monitor?rbl=${rbl}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Monitor failed' }, { status: 500 });
    }
}
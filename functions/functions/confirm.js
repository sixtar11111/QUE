const SUPABASE_URL = 'https://bujndshnjgabkndhijcs.supabase.co'; // 填你的 Project URL
const SUPABASE_KEY = 'sb_publishable_7iBhqfflYvpWg9iZqY7QIg_MtGkU1fX';                // 填你的 anon Key

export async function onRequest(context) {
    const { request } = context;
    if (request.method !== "POST") return new Response("Error", { status: 405 });

    try {
        const body = await request.json();

        // 调用 confirm_fill 函数
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/confirm_fill`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                my_url: body.my_url,
                target_id: body.target_id
            })
        });

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

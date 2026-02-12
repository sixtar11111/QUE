// 记得替换下面的两个变量！
const SUPABASE_URL = 'https://bujndshnjgabkndhijcs.supabase.co'; // 填你的 Project URL
const SUPABASE_KEY = 'sb_publishable_7iBhqfflYvpWg9iZqY7QIg_MtGkU1fX';                // 填你的 anon Key


export async function onRequest(context) {
    const { request } = context;
    if (request.method !== "POST") return new Response("Error", { status: 405 });

    try {
        const body = await request.json();
        const myUrl = body.url;
        // 限制一次最多取 5 个，贪多嚼不烂
        const wantCount = 5;

        if (!myUrl || !myUrl.startsWith('http')) {
            return new Response(JSON.stringify({ error: "无效的链接" }), { status: 400 });
        }

        // 调用数据库函数 exchange_links
        const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exchange_links`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ my_url: myUrl, want_count: wantCount })
        });

        const data = await dbRes.json();
        return new Response(JSON.stringify({ links: data }), { headers: { "Content-Type": "application/json" } });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
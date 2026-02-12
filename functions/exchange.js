// 记得替换下面的两个变量！
const SUPABASE_URL = 'https://bujndshnjgabkndhijcs.supabase.co'; // 填你的 Project URL
const SUPABASE_KEY = 'sb_publishable_7iBhqfflYvpWg9iZqY7QIg_MtGkU1fX';                // 填你的 anon Key

export async function onRequest(context) {
    const { request } = context;

    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json();
        const myUrl = body.url;
        let wantCount = parseInt(body.count) || 1; // 用户想填几个？

        // 限制一下，一次最多填 10 个，防止有人捣乱
        if (wantCount > 10) wantCount = 10;
        if (wantCount < 1) wantCount = 1;

        if (!myUrl || !myUrl.startsWith('http')) {
            return new Response(JSON.stringify({ error: "无效的链接" }), { status: 400 });
        }

        // 调用我们在数据库里写的那个“智能函数” (rpc)
        const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exchange_links`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                my_url: myUrl,
                want_count: wantCount
            })
        });

        if (!dbRes.ok) {
            const errText = await dbRes.text();
            throw new Error("数据库错误: " + errText);
        }

        const data = await dbRes.json(); // 这里拿到的就是别人链接的数组

        return new Response(JSON.stringify({ links: data }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
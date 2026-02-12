// 记得替换下面的两个变量！
const SUPABASE_URL = 'https://bujndshnjgabkndhijcs.supabase.co'; // 填你的 Project URL
const SUPABASE_KEY = 'sb_publishable_7iBhqfflYvpWg9iZqY7QIg_MtGkU1fX';                // 填你的 anon Key
      

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") return new Response("Error", { status: 405 });

  try {
    const body = await request.json();
    const myUrl = body.url;
    const wantCount = 5; 

    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exchange_links`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
       body: JSON.stringify({ 
        my_url: myUrl,       // 这里必须是 my_url，对应 SQL 的参数名
        want_count: wantCount // 这里必须是 want_count，对应 SQL 的参数名
    })

    const result = await dbRes.json();

    // --- 核心修复：检查返回的是不是数组 ---
    if (!Array.isArray(result)) {
        // 如果不是数组，说明数据库报错了
        console.error("Database Error:", result);
        return new Response(JSON.stringify({ error: result.message || "数据库调用失败", links: [] }), { 
            status: 200, // 依然给 200，但带上错误信息
            headers: { "Content-Type": "application/json" } 
        });
    }

    // 如果是数组，正常返回
    return new Response(JSON.stringify({ links: result }), { 
        headers: { "Content-Type": "application/json" } 
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, links: [] }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
    });
  }
}


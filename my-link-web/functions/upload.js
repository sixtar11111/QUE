// 记得替换下面的两个变量！
const SUPABASE_URL = 'https://bujndshnjgabkndhijcs.supabase.co'; // 填你的 Project URL
const SUPABASE_KEY = 'sb_publishable_7iBhqfflYvpWg9iZqY7QIg_MtGkU1fX';                // 填你的 anon Key

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return new Response("只接受 POST 请求", { status: 405 });
  }

  try {
    const body = await request.json();
    const userUrl = body.url;

    // 简单检查是不是网址
    if (!userUrl || !userUrl.startsWith('http')) {
      return new Response(JSON.stringify({ error: "请输入 http 或 https 开头的网址" }), { status: 400 });
    }

    // 发送给数据库
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/links`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ url: userUrl })
    });

    if (!dbRes.ok) throw new Error("存入数据库失败");

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
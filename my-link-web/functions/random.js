// 记得替换下面的两个变量！
const SUPABASE_URL = 'https://bujndshnjgabkndhijcs.supabase.co'; // 填你的 Project URL
const SUPABASE_KEY = 'sb_publishable_7iBhqfflYvpWg9iZqY7QIg_MtGkU1fX';                // 填你的 anon Key

export async function onRequest(context) {
    // 从数据库拿最新的 1 条
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/links?select=url&order=created_at.desc&limit=1`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await dbRes.json();

    // 随机挑一个
    const randomLink = data.length > 0 ? data[Math.floor(Math.random() * data.length)] : null;

    return new Response(JSON.stringify({ link: randomLink ? randomLink.url : null }), {
        headers: { "Content-Type": "application/json" }
    });
}
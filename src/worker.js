export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/products') {
      return new Response(JSON.stringify({ products: [] }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/api/deals') {
      return new Response(JSON.stringify({ deals: [] }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Dress Deal Tracker API', { status: 200 });
  },

  async scheduled(event, env, ctx) {
    console.log('Cron trigger fired at:', new Date().toISOString());
  }
};

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Proxy User',
        email: 'test@example.com',
        message: 'This is a test message to verify the Vite proxy and backend integration.'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch(e) {
    console.error('Error:', e);
  }
}
test();

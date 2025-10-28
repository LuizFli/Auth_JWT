

const url = 'http://localhost:4000/seed';

async function run() {
  try {
    const body = {
      email: 'admin',
      password: 'admin',
      name: 'admin'
    };

    // Node 18+ has global fetch
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('Seed response status:', res.status);
    console.log('Seed response body:', data);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

run();

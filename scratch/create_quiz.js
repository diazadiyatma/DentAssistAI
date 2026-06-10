const fetch = require('node-fetch');
(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Dental anatomy quiz', type: 'quiz' })
    });
    const data = await res.json();
    console.log('Quiz API response:', data);
  } catch (err) {
    console.error('Error calling quiz API:', err);
  }
})();

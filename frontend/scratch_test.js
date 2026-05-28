const crypto = require('crypto');
const axios = require('axios');

function decrypt(cHex, aHex, bHex) {
  const key = Buffer.from(aHex, 'hex');
  const iv = Buffer.from(bHex, 'hex');
  const ciphertext = Buffer.from(cHex, 'hex');
  
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(false); // slowAES might not use standard padding, or let's see
    let decrypted = decipher.update(ciphertext);
    let final = decipher.final();
    const result = Buffer.concat([decrypted, final]);
    return result.toString('hex');
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
}

async function run() {
  const url = 'https://backenddd-eduu.gt.tc/get_results.php?adm=DKS/2024/003&i=1';
  console.log('Fetching initial challenge...');
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  
  const html = res.data;
  console.log('HTML length:', html.length);
  
  // Extract a, b, c from script
  const matchA = html.match(/toNumbers\("([a-f0-9]+)"\)/g);
  if (!matchA) {
    console.log('Could not find toNumbers. Raw HTML:', html);
    return;
  }
  
  const hexValues = matchA.map(m => m.match(/"([a-f0-9]+)"/)[1]);
  console.log('Extracted hex values:', hexValues);
  
  if (hexValues.length < 3) {
    console.log('Not enough hex values');
    return;
  }
  
  const [a, b, c] = hexValues;
  const cookieValue = decrypt(c, a, b);
  console.log('Decrypted Cookie Value:', cookieValue);
  
  // Let's retry fetching with the cookie set!
  console.log('Retrying fetch with __test cookie...');
  try {
    const res2 = await axios.get(url, {
      headers: {
        'Cookie': `__test=${cookieValue}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://backenddd-eduu.gt.tc/'
      }
    });
    console.log('STATUS:', res2.status);
    console.log('CONTENT-TYPE:', res2.headers['content-type']);
    console.log('DATA:', res2.data);
  } catch (err) {
    console.error('Error on second request:', err.message);
  }
}

run();

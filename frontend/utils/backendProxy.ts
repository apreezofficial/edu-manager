import crypto from 'crypto';
import axios from 'axios';

// Helper to decrypt InfinityFree's slowAES challenge
function decryptChallenge(cHex: string, aHex: string, bHex: string): string {
  const key = Buffer.from(aHex, 'hex');
  const iv = Buffer.from(bHex, 'hex');
  const ciphertext = Buffer.from(cHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(false);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('hex');
}

const BACKEND_BASE = 'https://backenddd-eduu.gt.tc';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let cachedCookie: string | null = null;

async function getBypassCookie(): Promise<string | null> {
  if (cachedCookie) return cachedCookie;
  
  try {
    const res = await axios.get(`${BACKEND_BASE}/get_results.php`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    
    const html = res.data;
    if (typeof html !== 'string' || !html.includes('toNumbers')) {
      // Challenge not present, or already bypassed
      return null;
    }
    
    const matchA = html.match(/toNumbers\("([a-f0-9]+)"\)/g);
    if (!matchA || matchA.length < 3) return null;
    
    const hexValues = matchA.map(m => {
      const match = m.match(/"([a-f0-9]+)"/);
      return match ? match[1] : '';
    });
    
    const [a, b, c] = hexValues;
    cachedCookie = decryptChallenge(c, a, b);
    return cachedCookie;
  } catch (error) {
    console.error('Failed to solve InfinityFree challenge:', error);
    return null;
  }
}

export async function requestBackend(path: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  const url = `${BACKEND_BASE}${path}`;
  const cookie = await getBypassCookie();
  
  const headers: any = {
    'User-Agent': USER_AGENT,
    'Referer': BACKEND_BASE + '/',
  };
  
  if (cookie) {
    headers['Cookie'] = `__test=${cookie}`;
  }
  
  try {
    const response = await axios({
      url,
      method,
      headers,
      data,
      params: method === 'GET' ? data : undefined,
    });
    return response.data;
  } catch (error: any) {
    // If request failed with 403 or we got HTML challenge again, clear cache and retry once
    if (error.response?.status === 403 || (typeof error.response?.data === 'string' && error.response.data.includes('toNumbers'))) {
      cachedCookie = null;
      const newCookie = await getBypassCookie();
      if (newCookie) {
        headers['Cookie'] = `__test=${newCookie}`;
        const retryResponse = await axios({
          url,
          method,
          headers,
          data,
          params: method === 'GET' ? data : undefined,
        });
        return retryResponse.data;
      }
    }
    throw error;
  }
}

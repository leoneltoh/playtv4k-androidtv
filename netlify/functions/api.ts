import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event, context) => {
  try {
    const response = await fetch('https://liste-des-chaines-m-3-u-graceafrica2.replit.app/playtv.m3u', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: content
    };
  } catch (error) {
    console.error('Error fetching M3U:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch channels' })
    };
  }
};

export { handler };

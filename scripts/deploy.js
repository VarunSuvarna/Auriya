const algosdk = require('algosdk');

// Quick deployment for tomorrow
const LOCALNET = {
  server: 'http://localhost',
  port: 4001,
  token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
};

async function quickDeploy() {
  const client = new algosdk.Algodv2(LOCALNET.token, LOCALNET.server, LOCALNET.port);
  
  // Test connection
  try {
    await client.status().do();
    console.log('✅ Connected to LocalNet');
    return true;
  } catch (error) {
    console.error('❌ LocalNet not running. Start with: algokit localnet start');
    return false;
  }
}

quickDeploy();
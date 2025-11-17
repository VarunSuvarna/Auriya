// Emergency mock data for tomorrow's demo
export const mockSongs = [
  {
    id: '1',
    title: 'Digital Dreams',
    artist: 'CryptoBeats',
    price: 0.5,
    marketCap: 25000,
    holders: 150,
    image: '/electronic-music-cover-cyan.jpg',
    audio: '/test-audio.mp3'
  },
  {
    id: '2', 
    title: 'Ocean Waves',
    artist: 'NatureSounds',
    price: 0.3,
    marketCap: 15000,
    holders: 89,
    image: '/ocean-waves-music-cover.jpg',
    audio: '/test-audio.mp3'
  }
];

export const mockTrades = [
  { type: 'buy', amount: 100, price: 0.45, time: '2 min ago' },
  { type: 'sell', amount: 50, price: 0.44, time: '5 min ago' }
];

export const mockStats = {
  totalVolume: 125000,
  totalSongs: 247,
  activeTraders: 1250
};
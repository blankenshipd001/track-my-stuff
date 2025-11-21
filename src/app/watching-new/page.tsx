"use client"

// import React, { useState } from 'react';
// import { Plus, X, Edit2, Check, Film, Tv } from 'lucide-react';

const StreamingWatchlist = () => {
    return (
        <div>Blank Page</div>
    )
}
// const StreamingWatchlist = () => {
//   const [view, setView] = useState('grid'); // grid or list
//   const [filter, setFilter] = useState('all'); // all, movies, tv, watching, completed
  
//   const providers = {
//     netflix: { name: 'Netflix', color: 'bg-red-600' },
//     hulu: { name: 'Hulu', color: 'bg-green-500' },
//     disney: { name: 'Disney+', color: 'bg-blue-600' },
//     hbo: { name: 'HBO Max', color: 'bg-purple-600' },
//     prime: { name: 'Prime Video', color: 'bg-sky-500' },
//     apple: { name: 'Apple TV+', color: 'bg-gray-800' }
//   };
  
//   const [items] = useState([
//     {
//       id: 1,
//       title: 'The Last of Us',
//       type: 'tv',
//       provider: 'hbo',
//       status: 'watching',
//       progress: '7/9 episodes',
//       rating: 5,
//       image: 'https://images.unsplash.com/photo-1574267432644-f610f00de51f?w=400&h=600&fit=crop'
//     },
//     {
//       id: 2,
//       title: 'Oppenheimer',
//       type: 'movie',
//       provider: 'prime',
//       status: 'completed',
//       rating: 4,
//       image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop'
//     },
//     {
//       id: 3,
//       title: 'Stranger Things',
//       type: 'tv',
//       provider: 'netflix',
//       status: 'watching',
//       progress: '4/8 episodes',
//       rating: 4,
//       image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop'
//     },
//     {
//       id: 4,
//       title: 'The Bear',
//       type: 'tv',
//       provider: 'hulu',
//       status: 'watching',
//       progress: '5/10 episodes',
//       rating: 5,
//       image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop'
//     },
//     {
//       id: 5,
//       title: 'Dune: Part Two',
//       type: 'movie',
//       provider: 'hbo',
//       status: 'watchlist',
//       image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop'
//     },
//     {
//       id: 6,
//       title: 'The Morning Show',
//       type: 'tv',
//       provider: 'apple',
//       status: 'watching',
//       progress: '3/10 episodes',
//       rating: 4,
//       image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=600&fit=crop'
//     }
//   ]);

//   const filteredItems = items.filter(item => {
//     if (filter === 'all') return true;
//     if (filter === 'movies') return item.type === 'movie';
//     if (filter === 'tv') return item.type === 'tv';
//     return item.status === filter;
//   });

//   const stats = {
//     watching: items.filter(i => i.status === 'watching').length,
//     completed: items.filter(i => i.status === 'completed').length,
//     watchlist: items.filter(i => i.status === 'watchlist').length
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//               My Watchlist
//             </h1>
//             <p className="text-gray-400 mt-2">Track what you're watching across all platforms</p>
//           </div>
//           <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all">
//             <Plus size={20} />
//             Add Title
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
//             <div className="text-3xl font-bold text-blue-400">{stats.watching}</div>
//             <div className="text-gray-400 text-sm">Currently Watching</div>
//           </div>
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
//             <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
//             <div className="text-gray-400 text-sm">Completed</div>
//           </div>
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
//             <div className="text-3xl font-bold text-purple-400">{stats.watchlist}</div>
//             <div className="text-gray-400 text-sm">In Watchlist</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2 flex-wrap">
//           {['all', 'watching', 'completed', 'watchlist', 'movies', 'tv'].map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                 filter === f
//                   ? 'bg-purple-500 text-white'
//                   : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
//               }`}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Grid View */}
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map(item => (
//             <div
//               key={item.id}
//               className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 group"
//             >
//               <div className="relative h-80">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                
//                 {/* Provider Badge */}
//                 <div className={`absolute top-3 right-3 ${providers[item.provider].color} px-3 py-1 rounded-full text-xs font-semibold`}>
//                   {providers[item.provider].name}
//                 </div>

//                 {/* Type Badge */}
//                 <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//                   {item.type === 'movie' ? <Film size={12} /> : <Tv size={12} />}
//                   {item.type === 'movie' ? 'Movie' : 'TV Show'}
//                 </div>

//                 {/* Bottom Info */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4">
//                   <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  
//                   {item.progress && (
//                     <div className="mb-2">
//                       <div className="text-xs text-gray-300 mb-1">{item.progress}</div>
//                       <div className="w-full bg-gray-700 rounded-full h-1.5">
//                         <div 
//                           className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
//                           style={{ width: `${(parseInt(item.progress) / parseInt(item.progress.split('/')[1])) * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between">
//                     <div className="flex gap-1">
//                       {item.rating && [...Array(5)].map((_, i) => (
//                         <svg
//                           key={i}
//                           className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-600'}`}
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                       ))}
//                     </div>
                    
//                     <div className={`px-2 py-1 rounded text-xs font-semibold ${
//                       item.status === 'watching' ? 'bg-blue-500/20 text-blue-300' :
//                       item.status === 'completed' ? 'bg-green-500/20 text-green-300' :
//                       'bg-purple-500/20 text-purple-300'
//                     }`}>
//                       {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Provider Legend */}
//       <div className="fixed bottom-6 right-6 bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
//         <div className="text-xs font-semibold text-gray-400 mb-2">STREAMING SERVICES</div>
//         <div className="space-y-2">
//           {Object.entries(providers).map(([key, provider]) => (
//             <div key={key} className="flex items-center gap-2">
//               <div className={`w-3 h-3 rounded-full ${provider.color}`} />
//               <span className="text-sm">{provider.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

export default StreamingWatchlist;
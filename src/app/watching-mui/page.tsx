// "use client"
// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Card,
//   CardMedia,
//   CardContent,
//   Chip,
//   LinearProgress,
//   Rating,
//   Grid,
//   Paper,
//   Stack,
// } from '@mui/material';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { Plus, Film, Tv } from 'lucide-react';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#a855f7',
//     },
//     secondary: {
//       main: '#ec4899',
//     },
//     background: {
//       default: '#111827',
//       paper: '#1f2937',
//     },
//   },
//   typography: {
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           backgroundImage: 'none',
//           transition: 'all 0.3s ease',
//           '&:hover': {
//             transform: 'scale(1.05)',
//             boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)',
//           },
//         },
//       },
//     },
//   },
// });

const StreamingWatchlist = () => {
  return (
    <div>blank page</div>
  );
}
export default StreamingWatchlist;

// const StreamingWatchlist = () => {
//   const [filter, setFilter] = useState('all');
  
//   const providers = {
//     netflix: { name: 'Netflix', color: '#dc2626' },
//     hulu: { name: 'Hulu', color: '#22c55e' },
//     disney: { name: 'Disney+', color: '#2563eb' },
//     hbo: { name: 'HBO Max', color: '#9333ea' },
//     prime: { name: 'Prime Video', color: '#0ea5e9' },
//     apple: { name: 'Apple TV+', color: '#374151' }
//   };
  
//   const [items] = useState([
//     {
//       id: 1,
//       title: 'The Last of Us',
//       type: 'tv',
//       provider: 'hbo',
//       status: 'watching',
//       progress: { current: 7, total: 9 },
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
//       progress: { current: 4, total: 8 },
//       rating: 4,
//       image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop'
//     },
//     {
//       id: 4,
//       title: 'The Bear',
//       type: 'tv',
//       provider: 'hulu',
//       status: 'watching',
//       progress: { current: 5, total: 10 },
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
//       progress: { current: 3, total: 10 },
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

//   const getStatusColor = (status: {}) => {
//     switch (status) {
//       case 'watching': return 'info';
//       case 'completed': return 'success';
//       case 'watchlist': return 'secondary';
//       default: return 'default';
//     }
//   };

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <Box
//         sx={{
//           minHeight: '100vh',
//           background: 'linear-gradient(to bottom right, #111827, #1f2937, #111827)',
//           py: 4,
//         }}
//       >
//         <Container maxWidth="xl">
//           {/* Header */}
//           <Box sx={{ mb: 4 }}>
//             <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
//               <Box>
//                 <Typography
//                   variant="h3"
//                   sx={{
//                     fontWeight: 'bold',
//                     background: 'linear-gradient(to right, #c084fc, #f472b6)',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent',
//                     mb: 1,
//                   }}
//                 >
//                   My Watchlist
//                 </Typography>
//                 <Typography color="text.secondary">
//                   Track what you're watching across all platforms
//                 </Typography>
//               </Box>
//               <Button
//                 variant="contained"
//                 size="large"
//                 startIcon={<Plus size={20} />}
//                 sx={{
//                   background: 'linear-gradient(to right, #a855f7, #ec4899)',
//                   '&:hover': {
//                     background: 'linear-gradient(to right, #9333ea, #db2777)',
//                   },
//                 }}
//               >
//                 Add Title
//               </Button>
//             </Stack>

//             {/* Stats */}
//             <Grid container spacing={2} mb={3}>
//               <Grid item xs={12} sm={4}>
//                 <Paper sx={{ p: 2, bgcolor: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)' }}>
//                   <Typography variant="h3" color="info.main" fontWeight="bold">
//                     {stats.watching}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Currently Watching
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Paper sx={{ p: 2, bgcolor: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)' }}>
//                   <Typography variant="h3" color="success.main" fontWeight="bold">
//                     {stats.completed}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Completed
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Paper sx={{ p: 2, bgcolor: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)' }}>
//                   <Typography variant="h3" color="secondary.main" fontWeight="bold">
//                     {stats.watchlist}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     In Watchlist
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </Grid>

//             {/* Filters */}
//             <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
//               {['all', 'watching', 'completed', 'watchlist', 'movies', 'tv'].map(f => (
//                 <Chip
//                   key={f}
//                   label={f.charAt(0).toUpperCase() + f.slice(1)}
//                   onClick={() => setFilter(f)}
//                   color={filter === f ? 'primary' : 'default'}
//                   variant={filter === f ? 'filled' : 'outlined'}
//                   sx={{ fontWeight: 500 }}
//                 />
//               ))}
//             </Stack>
//           </Box>

//           {/* Grid */}
//           <Grid container spacing={3}>
//             {filteredItems.map(item => (
//               <Grid item xs={12} sm={6} md={4} key={item.id}>
//                 <Card
//                   sx={{
//                     bgcolor: 'rgba(31, 41, 55, 0.3)',
//                     backdropFilter: 'blur(12px)',
//                     border: '1px solid rgba(75, 85, 99, 0.5)',
//                     position: 'relative',
//                     overflow: 'visible',
//                   }}
//                 >
//                   <Box sx={{ position: 'relative' }}>
//                     <CardMedia
//                       component="img"
//                       height="400"
//                       image={item.image}
//                       alt={item.title}
//                     />
//                     <Box
//                       sx={{
//                         position: 'absolute',
//                         inset: 0,
//                         background: 'linear-gradient(to top, #111827, rgba(17, 24, 39, 0.4), transparent)',
//                       }}
//                     />

//                     {/* Provider Badge */}
//                     <Chip
//                       label={providers[item.provider].name}
//                       size="small"
//                       sx={{
//                         position: 'absolute',
//                         top: 12,
//                         right: 12,
//                         bgcolor: providers[item.provider].color,
//                         color: 'white',
//                         fontWeight: 600,
//                       }}
//                     />

//                     {/* Type Badge */}
//                     <Chip
//                       icon={item.type === 'movie' ? <Film size={14} /> : <Tv size={14} />}
//                       label={item.type === 'movie' ? 'Movie' : 'TV Show'}
//                       size="small"
//                       sx={{
//                         position: 'absolute',
//                         top: 12,
//                         left: 12,
//                         bgcolor: 'rgba(17, 24, 39, 0.8)',
//                         backdropFilter: 'blur(12px)',
//                         color: 'white',
//                         fontWeight: 600,
//                       }}
//                     />

//                     {/* Content Overlay */}
//                     <CardContent
//                       sx={{
//                         position: 'absolute',
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         color: 'white',
//                       }}
//                     >
//                       <Typography variant="h6" fontWeight="bold" gutterBottom>
//                         {item.title}
//                       </Typography>

//                       {item.progress && (
//                         <Box mb={1}>
//                           <Typography variant="caption" display="block" mb={0.5}>
//                             {item.progress.current}/{item.progress.total} episodes
//                           </Typography>
//                           <LinearProgress
//                             variant="determinate"
//                             value={(item.progress.current / item.progress.total) * 100}
//                             sx={{
//                               bgcolor: 'rgba(55, 65, 81, 0.5)',
//                               '& .MuiLinearProgress-bar': {
//                                 background: 'linear-gradient(to right, #a855f7, #ec4899)',
//                               },
//                             }}
//                           />
//                         </Box>
//                       )}

//                       <Stack direction="row" justifyContent="space-between" alignItems="center">
//                         {item.rating ? (
//                           <Rating value={item.rating} readOnly size="small" />
//                         ) : (
//                           <Box />
//                         )}
//                         <Chip
//                           label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                           size="small"
//                           color={getStatusColor(item.status)}
//                           sx={{ fontWeight: 600 }}
//                         />
//                       </Stack>
//                     </CardContent>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>

//         {/* Floating Legend */}
//         <Paper
//           sx={{
//             position: 'fixed',
//             bottom: 24,
//             right: 24,
//             p: 2,
//             bgcolor: 'rgba(31, 41, 55, 0.9)',
//             backdropFilter: 'blur(12px)',
//             border: '1px solid rgba(75, 85, 99, 0.5)',
//             minWidth: 200,
//           }}
//         >
//           <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
//             STREAMING SERVICES
//           </Typography>
//           <Stack spacing={1}>
//             {Object.entries(providers).map(([key, provider]) => (
//               <Stack direction="row" alignItems="center" spacing={1} key={key}>
//                 <Box
//                   sx={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: '50%',
//                     bgcolor: provider.color,
//                   }}
//                 />
//                 <Typography variant="body2">{provider.name}</Typography>
//               </Stack>
//             ))}
//           </Stack>
//         </Paper>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default StreamingWatchlist;
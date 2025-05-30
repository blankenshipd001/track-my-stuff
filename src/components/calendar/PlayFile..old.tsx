// "use client";

// import {
//   Box,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import Image from "next/image";
// import { useMemo, useState } from "react";
// import dayjs from "dayjs";
// import isoWeek from "dayjs/plugin/isoWeek";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// dayjs.extend(isoWeek);
// dayjs.extend(isSameOrAfter);
// dayjs.extend(isSameOrBefore);

// type Show = {
//   id: string;
//   title: string;
//   airDate: string;
//   posterUrl: string;
//   provider: string;
// };

// type Props = {
//   shows: Show[];
// };

// const providers = ["Netflix", "Hulu", "Disney+", "Amazon", "Apple TV"];

// const CalendarPage = ({ watchList }: Props) => {
//   const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
//   const [weekOffset, setWeekOffset] = useState(0);

//   const baseWeekStart = dayjs().startOf("week");

//   const selectedWeek = useMemo(() => {
//     return Array.from({ length: 7 }, (_, i) =>
//       baseWeekStart.add(weekOffset * 7 + i, "day")
//     );
//   }, [weekOffset, baseWeekStart]);

//   const filteredShows = useMemo(() => {
//     return selectedProvider
//       ? shows.filter((s) => s.provider === selectedProvider)
//       : shows;
//   }, [shows, selectedProvider]);

//   const showsByDate = useMemo(() => {
//     const map: { [date: string]: Show[] } = {};
//     selectedWeek.forEach((day) => {
//       const dateKey = day.format("YYYY-MM-DD");
//       map[dateKey] = filteredShows.filter(
//         (s) => dayjs(s.airDate).format("YYYY-MM-DD") === dateKey
//       );
//     });
//     return map;
//   }, [filteredShows, selectedWeek]);

//   const maxShowsInADay = Math.max(
//     1,
//     ...Object.values(showsByDate).map((s) => s.length)
//   );

//   return (
//     <Box p={2}>
//       {/* Provider Filter */}
//       <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
//         {providers.map((provider) => (
//           <Chip
//             key={provider}
//             label={provider}
//             color={selectedProvider === provider ? "primary" : "default"}
//             onClick={() =>
//               setSelectedProvider(
//                 selectedProvider === provider ? null : provider
//               )
//             }
//           />
//         ))}
//       </Box>

//       {/* Sticky Horizontal Week View */}
//       <Box
//         position="sticky"
//         top={0}
//         zIndex={100}
//         bgcolor="background.paper"
//         overflowX="auto"
//         display="flex"
//         borderBottom="1px solid #ccc"
//         pb={1}
//         sx={{ scrollbarWidth: "thin" }}
//       >
//         {selectedWeek.map((day) => {
//           const dateKey = day.format("YYYY-MM-DD");
//           const showsToday = showsByDate[dateKey] || [];
//           const intensity = showsToday.length / maxShowsInADay;

//           return (
//             <Box
//               key={dateKey}
//               minWidth="140px"
//               flexShrink={0}
//               px={1}
//               py={2}
//               sx={{
//                 background: `rgba(33, 150, 243, ${intensity * 0.3})`,
//                 borderRight: "1px solid #e0e0e0",
//               }}
//             >
//               <Typography variant="subtitle2" fontWeight="bold">
//                 {day.format("ddd")}
//               </Typography>
//               <Typography variant="body2">{day.format("MMM D")}</Typography>
//               <Divider sx={{ my: 1 }} />
//               <Box display="flex" flexDirection="column" gap={1}>
//                 {showsToday.map((show) => (
//                   <Tooltip
//                     key={show.id}
//                     title={
//                       <Card sx={{ maxWidth: 220 }}>
//                         <Image
//                           src={show.posterUrl}
//                           alt={show.title}
//                           width={220}
//                           height={330}
//                           style={{ borderRadius: 4 }}
//                         />
//                         <CardContent>
//                           <Typography variant="subtitle2">{show.title}</Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {show.provider}
//                           </Typography>
//                           <Typography variant="body2">
//                             Airs: {dayjs(show.airDate).format("MMM D, YYYY")}
//                           </Typography>
//                         </CardContent>
//                       </Card>
//                     }
//                     arrow
//                     placement="right"
//                   >
//                     <Box
//                       sx={{
//                         width: 40,
//                         height: 60,
//                         borderRadius: 1,
//                         overflow: "hidden",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <Image
//                         src={show.posterUrl}
//                         alt={show.title}
//                         width={40}
//                         height={60}
//                         style={{ objectFit: "cover" }}
//                       />
//                     </Box>
//                   </Tooltip>
//                 ))}
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>
//     </Box>
//   );
// }

// export default CalendarPage;


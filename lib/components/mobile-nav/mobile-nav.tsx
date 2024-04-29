// import React from "react";
// import { User as FirebaseUser } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { Drawer, List, ListItemText, Divider, ListItemButton } from "@mui/material";

// interface MobileNavProps {
//   drawerOpen: string;
//   user: FirebaseUser;
// }

// export const MobileNav = ({user}: MobileNavProps) => {
//   const router = useRouter();

//   return (
//     <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
//       <List sx={{ width: 250 }}>
//         <ListItemButton onClick={() => router.push("/")}>
//           <ListItemText primary="Search" />
//         </ListItemButton>
//         <ListItemButton onClick={() => router.push("/movies")}>
//           <ListItemText primary="Watchlist" />
//         </ListItemButton>

//         <Divider />

//         {user && (
//           <ListItemButton onClick={logOut}>
//             <ListItemText primary="Log Out" />
//           </ListItemButton>
//         )}
//         {!user && (
//           <ListItemButton onClick={() => signIn()}>
//             <ListItemText primary="Log In" />
//           </ListItemButton>
//         )}
//       </List>
//     </Drawer>
//   );
// };

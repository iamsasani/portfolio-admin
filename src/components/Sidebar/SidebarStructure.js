import {
  Home as HomeIcon,
  Person as ProfileIcon,
  MailOutline as MessagesIcon,
  EventAvailable as MeetingsIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";

const structure = [
  {
    id: 1,
    label: "Profile",
    link: "/app/profile",
    icon: <ProfileIcon />,
  },
  {
    id: 2,
    label: "Dashboard",
    link: "/app/dashboard",
    icon: <HomeIcon />,
  },
  {
    id: 3,
    label: "Messages",
    link: "/app/messages",
    icon: <MessagesIcon />,
  },
  {
    id: 4,
    label: "Meetings",
    link: "/app/meetings",
    icon: <MeetingsIcon />,
  },
];

export default structure;
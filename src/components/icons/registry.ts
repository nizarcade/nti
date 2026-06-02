import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivismOutlined";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import HandshakeIcon from "@mui/icons-material/HandshakeOutlined";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalOutlined";
import RestaurantIcon from "@mui/icons-material/RestaurantOutlined";
import BuildIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ShieldIcon from "@mui/icons-material/ShieldOutlined";
import ScaleIcon from "@mui/icons-material/ScaleOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export const ICON_REGISTRY: Record<string, SvgIconComponent> = {
  school: SchoolIcon,
  heart: VolunteerActivismIcon,
  groups: GroupsIcon,
  handshake: HandshakeIcon,
  favorite: FavoriteIcon,
  home: HomeIcon,
  hospital: LocalHospitalIcon,
  nutrition: RestaurantIcon,
  build: BuildIcon,
  check: CheckCircleIcon,
  shield: ShieldIcon,
  scale: ScaleIcon,
};

export const ICON_KEYS = Object.keys(ICON_REGISTRY);

export function getIconComponent(key: string | undefined | null): SvgIconComponent {
  if (key && ICON_REGISTRY[key]) return ICON_REGISTRY[key];
  return GroupsIcon;
}

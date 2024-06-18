import IconsNavbar from "../../ui/IconsNavbar";
import NavigationNavbar from "../../ui/NavigationNavbar";

export default function Navbar() {
  return (
    <div className="flex flex-col border-b border-borderMain bg-secondary">
      <div className="flex gap-7 px-5 text-sm text-navbarSecondary">
        <IconsNavbar />
        <NavigationNavbar />
      </div>
    </div>
  );
}

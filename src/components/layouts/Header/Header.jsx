import TransButton from "../../TransButton";
// import { useTranslation } from "react-i18next";
import logoimg from "../../../assets/logo.png";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  // const { t } = useTranslation();

  return (
    <header id="navbar" className="bg-primary-50 w-full">
      <div className="flex justify-center">
        <nav
          className="flex w-full max-w-7xl items-center justify-between p-4 md:p-6 "
          aria-label="Main navigation"
        >
          {/* Logo and Main Navigation */}
          <div className="flex items-center py-4 2xl:ps-20 xl:ps-17 lg:ps-8 ps-4 max-h-20 w-full ">
            <Link to="/" className="block" aria-label="Home">
              <img src={logoimg} className="w-30 h-8" alt="Site Logo" />
            </Link>
          </div>

          {/* Trans Button */}
          <div>
            <TransButton />
          </div>
        </nav>
      </div>
    </header>
  );
}

import logoimg from "../../../assets/logo.png";
import instagram from "../../../assets/Instagram.png";
import facebook from "../../../assets/Facebook.png";
import twitter from "../../../assets/Twitter.png";
import linkedin from "../../../assets/Linkedin.png";
import youtube from "../../../assets/Youtube.png";
import whatsapp from "../../../assets/Whatsapp.png";
import TransButton from "../../TransButton";
import { useTranslation } from "react-i18next";
export default function Footer() {
  const { t } = useTranslation();
  return (
    <div>
      <footer className="bg-pure-turquoise ">
        <div className="h-7"></div>
        {/* company data and links */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl  px-4 sm:ps-20 pb-20 flex flex-wrap gap-6 sm:gap-4 md:gap-16 lg:gap-16 xl:gap-32 items-start md:items-baseline flex-col sm:flex-row content-around justify-between">
            {/* Journeys Section */}
            <div className="our-program-footer">
              <p className=" text-start text-white font-bold text-lg mb-6 pl-6">
                {t("footer.training.Training")}
              </p>
              <ul className="cat-dropdown-menu">
                {[
                  "   ",
                  "Software Testing",
                  "Mobile Development",
                  "Web Development",
                  "Cloud DevOps",
                  "AI & Data Science",
                  "Cybersecurity",
                  "Product Management",
                  "Generative AI (GAIC)",
                  "Digital Marketing",
                  "UI/UX",
                  "SprintUp",
                ].map((program, index) => {
                  const slug = program
                    .toLowerCase()
                    .replace(/ & /g, "-")
                    .replace(/ /g, "-")
                    .replace(/[()]/g, "");
                  return (
                    <li key={index}>
                      <a
                        href={`https://sprints.ai/en-eg/categories-journeys/all-programs/${slug}`}
                      >
                        <p className="p3 text-start text-blue-100 hover:text-white mb-3">
                          {program}
                        </p>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Our Services */}
            <div className="our-services-footer">
              <p className=" text-start text-white font-bold text-lg mb-6 pl-6">
                {t("footer.ourServices.Our Services")}
              </p>
              <ul className="cat-dropdown-menu">
                {[
                  {
                    label: "For Learners",
                    href: "https://sprints.ai/en-eg/categories-journeys/all-programs",
                  },
                  {
                    label: "For Businesses",
                    href: "https://sprints.ai/en-eg/enterprise",
                  },
                  {
                    label: "For Governments",
                    href: "https://sprints.ai/en-eg/government",
                  },
                  {
                    label: "HiRemoters",
                    href: "https://hiremoters.ai",
                    target: "_blank",
                  },
                ].map(({ label, href, target }, index) => (
                  <li key={index}>
                    <a
                      href={href}
                      target={target || "_self"}
                      rel="noopener noreferrer"
                    >
                      <p className="p3 text-start text-blue-100 hover:text-white mb-3">
                        {label}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="our-company-footer">
              <p className=" text-start text-white font-bold text-lg mb-6 pl-6">
                {t("footer.company.Company")}
              </p>
              <ul className="cat-dropdown-menu">
                {[
                  { label: "About Us", href: "#" },
                  { label: "Blog", href: "#" },
                  {
                    label: "Careers",
                    href: "#",
                    target: "_blank",
                  },
                  { label: "Terms", href: "#" },
                  {
                    label: "Privacy Policy",
                    href: "#",
                  },
                ].map(({ label, href, target }, idx) => (
                  <li key={idx}>
                    <a
                      href={href}
                      target={target || "_self"}
                      rel="noopener noreferrer"
                    >
                      <p className="p3 text-start text-blue-100 hover:text-white mb-3">
                        {label}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="contact-us-footer">
              <p className="text-start text-white font-bold text-lg mb-6 pl-6">
                {t("footer.contactUs")}
              </p>
              <ul className="cat-dropdown-menu">
                <li>
                  <a href="mailto:info@gearup.com">
                    <p className="p3 text-start text-blue-100 hover:text-white mb-3">
                      info@gearup.com
                    </p>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <p className="p4 leading-4 md:w-32 text-start mx-auto md:mx-0 text-blue-100 w-full mb-3">
                      <span className="font-GilroySemiBold">Netherlands:</span>{" "}
                      Edvard Munchweg...
                    </p>
                  </a>
                </li>
              </ul>
              <div className="border-b-1 border-b-gray-600 h-2"></div>
              <div className="border-1  border-primary-50 rounded-lg  mt-4 ">
                <TransButton />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b-1 border-b-gray-600"></div>
        {/* social media links */}
        <div className="flex justify-center bg-primary-50">
          <div className=" w-full max-w-7xl pt-3 pb-10 px-4 sm:ps-20  flex flex-wrap gap-6 sm:gap-4 md:gap-16 lg:gap-16 xl:gap-32 items-start md:items-baseline flex-col sm:flex-row content-around justify-between">
            {/* Footer Logo and Icons */}
            <div>
              <img
                loading="lazy"
                src={logoimg}
                className="w-40 h-11"
                alt="footer logo"
              />
            </div>
            <div className="flex gap-4 content-around mt-4">
              {[
                {
                  href: "#",
                  src: instagram,
                  alt: "Instagram",
                },
                {
                  href: "#",
                  src: whatsapp,
                  alt: "Whatsapp",
                },
                {
                  href: "#",
                  src: twitter,
                  alt: "X",
                },
                {
                  href: "#",
                  src: facebook,
                  alt: "Facebook",
                },
                {
                  href: "#",
                  src: linkedin,
                  alt: "LinkedIn",
                },
                {
                  href: "#",
                  src: youtube,
                  alt: "Youtube",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    loading="lazy"
                    src={item.src}
                    alt={item.alt}
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

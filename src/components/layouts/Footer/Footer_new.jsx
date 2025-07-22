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
    <footer className="bg-dark text-light mt-auto">
      <div className="container-fluid">
        {/* Main Footer Content */}
        <div className="row py-5">
          <div className="col-lg-8 mx-auto">
            <div className="row g-4">
              {/* Company Info */}
              <div className="col-md-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={logoimg}
                    alt="GearUp Logo"
                    width="40"
                    height="40"
                    className="me-2"
                  />
                  <div>
                    <h5 className="mb-0 fw-bold text-primary">GearUp</h5>
                    <small className="text-muted">
                      Learning and Career Growth
                    </small>
                  </div>
                </div>
                <p className="text-muted small">
                  Empowering careers through innovative training programs and
                  professional development.
                </p>
                <div className="d-flex gap-2 mb-3">
                  <TransButton />
                </div>
              </div>

              {/* Training Programs */}
              <div className="col-md-4">
                <h6 className="fw-bold text-primary mb-3">
                  {t("footer.training.Training")}
                </h6>
                <ul className="list-unstyled small">
                  {[
                    "Software Testing",
                    "Mobile Development",
                    "Web Development",
                    "Cloud DevOps",
                    "AI & Data Science",
                    "Cybersecurity",
                    "Product Management",
                    "Digital Marketing",
                    "UI/UX Design",
                  ].map((program, index) => (
                    <li key={index} className="mb-2">
                      <a
                        href="#"
                        className="text-light text-decoration-none"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {program}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div className="col-md-4">
                <h6 className="fw-bold text-primary mb-3">Quick Links</h6>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none">
                      About Us
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none">
                      Contact
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none">
                      Careers
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none">
                      Privacy Policy
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none">
                      Terms of Service
                    </a>
                  </li>
                </ul>

                {/* Social Media */}
                <h6 className="fw-bold text-primary mb-3 mt-4">Follow Us</h6>
                <div className="d-flex gap-2">
                  {[
                    { icon: linkedin, name: "LinkedIn", link: "#" },
                    { icon: twitter, name: "Twitter", link: "#" },
                    { icon: facebook, name: "Facebook", link: "#" },
                    { icon: instagram, name: "Instagram", link: "#" },
                    { icon: youtube, name: "YouTube", link: "#" },
                    { icon: whatsapp, name: "WhatsApp", link: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      className="text-light p-2 rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      aria-label={social.name}
                    >
                      <img
                        src={social.icon}
                        alt={social.name}
                        width="20"
                        height="20"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-secondary">
          <div className="row py-3">
            <div className="col-lg-8 mx-auto">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="text-muted small mb-2 mb-md-0">
                  © 2025 GearUp. All rights reserved.
                </div>
                <div className="text-muted small">
                  Made with ❤️ for your career growth
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

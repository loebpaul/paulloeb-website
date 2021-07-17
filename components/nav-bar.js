import React, { useState, useEffect } from "react";
import { Navbar as B3Navbar, Nav, NavItem } from "react-bootstrap";

const NavBar = () => {
  const [isOpen, setNavOpen] = useState(false);
  const [navScroll, setNavScroll] = useState(false);
  const [currentActive, setCurrentActive] = useState("home");

  const scrollHandler = () => {
    let bodyScroll = window.scrollY;
    if (bodyScroll > 300) setNavScroll(true);
    else setNavScroll(false);

    bodyScroll += 80;

    if (document.getElementById("contact") === null) return;

    if (document.getElementById("contact").offsetTop < bodyScroll) {
      setCurrentActive("contact");
     } else if (document.getElementById("portfolio").offsetTop < bodyScroll) {
      setCurrentActive("portfolio");
    } else if (document.getElementById("testimonials").offsetTop < bodyScroll) {
      setCurrentActive("testimonials");
    } else if (document.getElementById("about").offsetTop < bodyScroll) {
      setCurrentActive("about");
    } else {
      setCurrentActive("home");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <B3Navbar
      collapseOnSelect
      expand="md"
      className={"land-nav " + (navScroll ? " nav-scroll" : "")}
    >
      <div className="navbar-header">
        <B3Navbar.Brand href="#">Paul Loeb</B3Navbar.Brand>
        <B3Navbar.Toggle aria-controls="responsive-navbar-nav">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </B3Navbar.Toggle>
      </div>

      <B3Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="navbar-right" activeKey={currentActive}>
          <NavItem eventKey="home" href="#home">
            Home
          </NavItem>
          <NavItem eventKey="about" href="#about">
            About
          </NavItem>
          <NavItem eventKey="testimonials" href="#testimonials">
            Testimonials
          </NavItem>
          <NavItem eventKey="portfolio" href="#portfolio">
            Portfolio
          </NavItem>
          <NavItem eventKey="contact" href="#contact">
            Contact
          </NavItem>
        </Nav>
      </B3Navbar.Collapse>
    </B3Navbar>
  );
};

export default NavBar;

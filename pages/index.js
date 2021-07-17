import Head from "next/head";
import NavBar from "../components/nav-bar";
import Home from "../components/home";
import Hero from "../components/Hero";
import Testimonials from "../components/testimonials";
import Portfolio from "../components/portfolio";
import Contact from "../components/contact";
import Bottom from "../components/bottom";

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>Paul Loeb</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <NavBar />
      <Home />
      <span className="anchor" id="about"></span>
      <Hero />
      <span className="anchor" id="testimonials"></span>
      <Testimonials />
      <span className="anchor" id="portfolio"></span>
      <Portfolio />
      <span className="anchor" id="contact"></span>
      <Contact />
      <Bottom />
    </div>
  );
}

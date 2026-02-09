import React from "react";
import Skills from "./skills";
import imgHero from "../../assets/img/paul.jpg";

const Hero = () => {
  return (
    <section className="hero section-padding">
      <div className="container mb-80">
        <div className="row">
          <div className="col-sm-4">
            <div className="hero-img">
              <img src={imgHero.src} alt="Paul Loeb" />
            </div>
          </div>

          <div className="col-sm-7 col-sm-offset-1">
            <div className="hero-item">
              <div className="tit">
                <h4>I AM A TECHNOLOGY LEADER</h4>
              </div>
              <div className="content mb-20">
                <p className="mb-20">
                  Throughout my career, I have leveraged what I know about
                  technology to build world-class products that have an impact
                  on the world.
                </p>
                <p className="mb-20">
                  I love working with great teams to create tools that empower
                  other people to improve their lives on a meaningful scale.
                </p>
                <p>I'm passioniate about music, business, and technology.</p>
              </div>

              <div className="social-icon">
                <a href="https://www.twitter.com/paul8307">
                  <span>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </span>
                </a>
                <a href="https://www.linkedin.com/in/loebpaul">
                  <span>
                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                  </span>
                </a>
                <a href="https://www.github.com/loebpaul">
                  <span>
                    <i className="fa fa-github" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="clear-fix"></div>
        </div>
      </div>

      <Skills></Skills>
    </section>
  );
};

export default Hero;

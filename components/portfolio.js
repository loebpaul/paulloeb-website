import React from "react";
import Link from "next/link";

import imgGuidedShopping from "../assets/img/portfolio/guided-shopping.png";
import imgOnDemand from "../assets/img/portfolio/on-demand.png";
import imgPitchDeckUploader from "../assets/img/portfolio/pitch-code.png";

const potfolioItems = [
  {
    title: "Guided Shopping",
    category: "Thrive Market",
    image: imgGuidedShopping,
    content:
      "A personalized onboarding funnel to speed up basket building and increase first order conversion rate.",
    user: "Paul",
    url: "/portfolio/guided-shopping",
    heart: 120,
    chat: 34,
  },
  {
    title: "On-Demand",
    category: "ZipRecruiter",
    image: imgOnDemand,
    content:
      "A recruitment product for the gig economy to target job-seekers with offers to supplement their income with a side hustle.",
    user: "Paul",
    url: "/portfolio/on-demand",
    heart: 120,
    chat: 34,
  },
  {
    title: "Pitch Deck Uploader",
    category: "React JS",
    image: imgPitchDeckUploader,
    content:
      "A demonstration project built with modern web technologies which allows a user to upload and view a pitch deck.",
    user: "Paul",
    url: "/portfolio/pitch-deck-uploader",
    heart: 120,
    chat: 34,
  },
];

const Portfolio = () => {
  return (
    <section className="blog section-padding">
      <div className="container">
        <div className="text-center mb-50">
          <h4 className="tit tit-center">SOME OF MY WORK</h4>
        </div>
        <div className="row">
          {potfolioItems.map((item, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="post">
                <div className="img-post">
                  <img src={item.image} alt={item.title} />
                  <div className="img-overlay">
                    <Link href={item.url}>
                      <span className="icon-attachment"></span>
                    </Link>
                  </div>
                </div>
                <div className="post-content">
                  <div className="post-title text-center">
                    <h6>
                      <a href="#0">{item.category}</a>
                    </h6>
                    <Link href={item.url}>
                      <h5 className="tit tit-center">{item.title}</h5>
                    </Link>
                  </div>
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

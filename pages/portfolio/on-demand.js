import Head from "next/head";
import Link from "next/link";
import PortfolioItem from "../../components/portfolio-item";
import AboutMe from "../../components/about-me";
import FollowMe from "../../components/follow-me";
import Bottom from "../../components/bottom";

import imgAbout from "../../assets/img/paul.jpg";
import imgOnDemand from "../../assets/img/portfolio/on-demand-large.png";
import imgOnDemandCompanies from "../../assets/img/portfolio/on-demand-companies.png";

function OnDemand() {
  return (
    <div>
      <Head>
        <title>On-Demand | Paul Loeb</title>
      </Head>

      <header className="tona-blog" data-stellar-background-ratio="0.5">
        <div className="blog-overlay">
          <div className="caption v-middle text-center">
            <h1>On-Demand</h1>
            <span>
              <Link href="/">Home /</Link>
            </span>
            <span>
              <Link href="#0"> Portfolio</Link>
            </span>
          </div>
        </div>
      </header>

      <section className="posts section-padding">
        <div className="container">
          <div className="row">
            <div className="main-post col-sm-9">
              <PortfolioItem
                image={imgOnDemand}
                category={[
                  'A bespoke recruitment product for the "gig economy"',
                ]}
                title="ZipRecruiter On-Demand"
                blog={[
                  {
                    class: "tit",
                    post: "Challenge",
                  },
                  {
                    class: "",
                    post: 'Target job-seekers with offers to supplement their income with a "side hustle." Most people who know about working for companies like Uber, Lyft, Postmates, or Instacart go to their websites and sign up directly. My challenge was to pre-qualify good candidates for these roles and recommend relevant opportunities to them at strategic moments throughout their job-seeker experience.',
                    image: imgOnDemandCompanies,
                    imageAlt: "On-Demand Companies",
                  },
                  {
                    class: "tona-post",
                    post: "Companies in this industry have special requirements when it comes to recruiting drivers. They cannot use off-the-shelf talent acquisition software for legal reasons; eg., it typically refers to resumés or hiring managers, which imply the company is recruiting employees as opposed to independent contractors.",
                  },
                  {
                    class: "tit",
                    post: "Solution",
                  },
                  {
                    class: "",
                    post: "We identified job-seekers who would be good candidates for gig economy opportunities using a data science prediction model which included factors such as a job-seeker’s employment history, educational background, previous job applications, and recent search queries.",
                  },
                  {
                    class: "tona-post",
                    post: "We targeted messaging and ads for these job-seekers throughout their recruitment journey; including on-site, in-app, email, SMS, and push notifications. We created a new landing page and onboarding funnel to pre-qualify candidates for relevant opportunities based on localized legal regulations and partner requirements.",
                  },
                  {
                    class: "tit",
                    post: "Collaboration",
                  },
                  {
                    class: "",
                    post: "I worked with multiple stakeholders across the organization including customers, account executives, marketing, customer service, and leadership. I led a cross-platform team including front-end and back-end engineers, UX designers, data scientists, and native iOS and Android developers.",
                  },
                  {
                    class: "tit",
                    post: "Results",
                  },
                  {
                    class: "",
                    post: "We unlocked a new revenue channel for the company in a fast-growing segment, and scaled to 10 enterprise clients.",
                  },
                ]}
              />
            </div>
            <div className="side-bar col-sm-3">
              <AboutMe
                image={imgAbout}
                comment="I love using what I know about technology to build world-class products that have an impact on the world."
              />
              <FollowMe />
            </div>
          </div>
        </div>
      </section>
      <Bottom />
    </div>
  );
}

export default OnDemand;

import Head from "next/head";
import Link from "next/link";
import PortfolioItem from "../../components/portfolio-item";
import AboutMe from "../../components/about-me";
import FollowMe from "../../components/follow-me";
import Bottom from "../../components/bottom";

import imgAbout from "../../assets/img/paul.jpg";
import imgGuidedShopping from "../../assets/img/portfolio/guided-shopping-large.png";
import imgGuidedShoppingQuiz from "../../assets/img/portfolio/guided-shopping-quiz.png";
import imgGuidedShoppingPersonalized from "../../assets/img/portfolio/guided-shopping-personalized.png";

function GuidedShopping() {
  return (
    <div>
      <Head>
        <title>Guided Shopping | Paul Loeb</title>
      </Head>

      <header className="tona-blog" data-stellar-background-ratio="0.5">
        <div className="blog-overlay">
          <div className="caption v-middle text-center">
            <h1>Guided Shopping</h1>
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
                image={imgGuidedShopping}
                imageAlt="Guided Shopping"
                category={[
                  "A personalized onboarding funnel for Thrive Market",
                ]}
                title="Guided Shopping"
                blog={[
                  {
                    class: "tit",
                    post: "Challenge",
                  },
                  {
                    class: "",
                    post: "Speed up basket building and increase the first order conversion rate.",
                  },
                  {
                    class: "tona-post",
                    post: "A new customer who joined Thrive Market didn’t know where to start! We conducted research that showed customers would spend hours browsing the entire product catalog, and the bounce rate was high.",
                  },
                  {
                    class: "tit",
                    post: "Solution",
                  },
                  {
                    class: "",
                    post: "We ask the customer a series of questions and then recommend a list of personalized products for their first order. We built an informative quiz that ascertained a customer’s dietary and lifestyle preferences and then used a data science prediction model to recommend personalized products, product categories, and brands for the customer to purchase in their first order.",
                    image: imgGuidedShoppingQuiz,
                    imageAlt: "Guided Shopping Quiz",
                  },
                  {
                    class: "",
                    post: "",
                    image: imgGuidedShoppingPersonalized,
                    imageAlt: "Guided Shopping",
                  },
                  {
                    class: "tona-post",
                    post: "A/B Test: We ran a 50/50 experiment against the legacy funnel, initially exposed to 5% of website traffic via Optimizely.",
                  },
                  {
                    class: "tit",
                    post: "Collaboration",
                  },
                  {
                    class: "",
                    post: "I worked with stakeholders from across the  company including customers, marketing, merchandising, customer service, and leadership. I led a cross-platform team of UX designers and engineers including frontend, backend, data science, native iOS and Android.",
                  },
                  {
                    class: "tit",
                    post: "Results",
                  },
                  {
                    class: "",
                    post: "400% increase in First Order Conversion Rate! The new onboarding experience was scaled up in traffic; from 5% to 25%, then 50%, and ultimately 100%.",
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

export default GuidedShopping;

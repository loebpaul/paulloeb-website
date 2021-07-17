import Head from "next/head";
import Link from "next/link";
import PortfolioItem from "../../components/portfolio-item";
import AboutMe from "../../components/about-me";
import FollowMe from "../../components/follow-me";
import Bottom from "../../components/bottom";

import imgAbout from "../../assets/img/paul.jpg";
import imgPitchDeckUploader from "../../assets/img/portfolio/pitch-code-large.png";
import imgPitchDeckViewer from "../../assets/img/portfolio/pitch-deck-viewer.png";

function PitchDeckUploader() {
  return (
    <div>
      <Head>
        <title>Pitch Deck Uploader | Paul Loeb</title>
      </Head>

      <header className="tona-blog" data-stellar-background-ratio="0.5">
        <div className="blog-overlay">
          <div className="caption v-middle text-center">
            <h1>Pitch Deck Uploader</h1>
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
                image={imgPitchDeckUploader}
                imageAlt="Pitch Deck Uploader"
                category={["React JS"]}
                title="Pitch Deck Uploader"
                blog={[
                  {
                    class: "tit",
                    post: "Challenge",
                  },
                  {
                    class: "",
                    post: "This is an exercise I completed for an interview project. My goal was to build a tool that would allow a user to upload a pitch deck and then view it.",
                  },
                  {
                    class: "tona-post",
                    post: "The application should let the user upload a pitch deck as a PDF, convert each slide to an image, and then display the images on a webpage.",
                  },
                  {
                    class: "tit",
                    post: "Solution",
                  },
                  {
                    class: "",
                    post: "I built a full-stack web application using modern technologies: Node.js, React, and Next.js.",
                    image: imgPitchDeckViewer,
                    imageAlt: "Pitch Deck Uploader",
                  },
                  {
                    class: "tona-post",
                    post: "",
                    linkUrl: "https://github.com/loebpaul/pitch-deck-uploader",
                    linkText: "Source Code on GitHub",
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

export default PitchDeckUploader;

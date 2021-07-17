import { useState, useEffect } from "react";
import SkillProgress from "./skill-progress";

const skill_prog = [
  {
    title: "Product Management",
    current: 0,
    progress: 100,
  },
  {
    title: "Software Engineering",
    current: 0,
    progress: 90,
  },
  {
    title: "User Experience",
    current: 0,
    progress: 95,
  },
  {
    title: "Leadership",
    current: 0,
    progress: 90,
  },
  {
    title: "Design",
    current: 0,
    progress: 75,
  },
];

const Skills = () => {
  const [skillProg, setSkillProg] = useState(skill_prog);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const updateProgress = () => {
    let bEnd = true;
    let newProg = [...skillProg];
    newProg.map((skill) => {
      if (skill.current < skill.progress) {
        skill.current += skill.progress / 30;

        if (skill.current > skill.progress) skill.current = skill.progress;
        bEnd = false;
      }
    });
    setSkillProg(newProg);
    if (!bEnd) setTimeout(updateProgress, 30);
  };

  const scrollHandler = () => {
    let bodyScroll = window.scrollY;

    bodyScroll += 80;
    if (document.getElementById("about").offsetTop < bodyScroll) {
      setTimeout(updateProgress, 200);
      window.removeEventListener("scroll", scrollHandler);
    }
  };

  return (
    <div className="skills">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-4">
            <div className="skill-items">
              <div className="skill-title">
                <span className="icon-pencil"></span>
                <br />
                <h5 className="tit">Education</h5>
              </div>

              <div className="item-info mb-50">
                <h6>University of Southern California</h6>
                <p>Marshall School of Business</p>
                <p>B.S. Business Administration</p>
                <p>Entrepreneurship, Music Industry</p>
              </div>

              <div className="item-info mb-50">
                <h6>Video Symphony</h6>
                <p>Audio Engineering</p>
                <p>Certified Pro Tools Expert</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-4">
            <div className="skill-items">
              <div className="skill-title">
                <span className="icon-briefcase"></span>
                <br />
                <h5 className="tit">Experience</h5>
              </div>

              <div className="item-info mb-50">
                <h6>Product Manager</h6>
                <p>Flowspace</p>
                <p>Ticketmaster / Live Nation</p>
                <p>Thrive Market</p>
                <p>ZipRecruiter</p>
                <p>Ubiquiti Networks</p>
              </div>

              <div className="item-info mb-50">
                <h6>Software Engineering Manager</h6>
                <p>Beats By Dre / Apple</p>
              </div>

              <div className="item-info">
                <h6>Entrepreneur</h6>
                <p>DropTrack</p>
                <p>No Ego Records</p>
                <p>OrderingApps</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-4">
            <div className="skill-items">
              <div className="skill-title">
                <span className="icon-tools"></span>
                <br />
                <h5 className="tit">My Skills</h5>
              </div>
              {skillProg.map((item, idx) => (
                <SkillProgress
                  title={item.title}
                  progress={item.current}
                  key={idx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;

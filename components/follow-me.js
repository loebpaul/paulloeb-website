import React from "react";

const FollowMe = () => {
  return (
    <div className="bars">
      <h5 className="tit">Let's Connect</h5>
      <br />

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
  );
};

export default FollowMe;

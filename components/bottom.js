import React from "react";

const Bottom = () => {
  return (
    <footer className="footer text-center">
      <p>
        Copyright &copy; <span>Paul Loeb</span> {new Date().getFullYear()}
      </p>

      <div className="social-icon">
        <a href="https://www.twitter.com/paul8307">
          <span>
            <i className="fa fa-twitter" aria-hidden="true"></i>{" "}
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
    </footer>
  );
};

export default Bottom;

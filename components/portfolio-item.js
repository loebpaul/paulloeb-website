import React from "react";

const PortfolioItem = ({ title, category, blog, image, imageAlt }) => {
  return (
    <div className="col-md-12 mb-30">
      <div className="post">
        <div className="img-post mb-20">
          <img src={image} alt={imageAlt} />
        </div>
        <div className="post-content">
          <div className="post-title text-center">
            {category.map((cate, idx) => (
              <h6 key={idx}>
                {idx > 0 && <span> / </span>}
                <a href="#0"> {cate} </a>
              </h6>
            ))}
            <h5 className="tit tit-center">{title}</h5>
          </div>
          {blog.map((item, idx) => (
            <p
              key={idx}
              className={item.class + (idx === blog.length - 1 ? "" : " mb-20")}
            >
              {item.post}
              {item.linkUrl ? (
                <a target="_blank" href={item.linkUrl}>
                  {item.linkText}
                </a>
              ) : (
                ""
              )}
              {item.image ? <img src={item.image} alt={item.imageAlt} /> : ""}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, EffectFade } from "swiper";

SwiperCore.use([Autoplay, Pagination]);

const Testimonials = () => {
  const mainSlideOptions = {
    slidesPerView: 1,
    loop: true,
    effect: "fade",
    pagination: {
      el: "#main-slider-pagination",
      type: "bullets",
      clickable: true,
    },
    autoplay: {
      delay: 8000,
    },
  };

  return (
    <section id="testimonials" className="testimonials mb-50">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="client-say text-center">
              <Swiper {...mainSlideOptions}>
                <SwiperSlide>
                  <div className="client-item text-center">
                    <span className="icon-quote mb-50"></span>
                    <br />

                    <h5 className="mb-30">WHAT PEOPLE ARE SAYING</h5>

                    <p className="mb-20">
                      Paul was found as part of an extensive search for
                      Ticketmaster and I was so happy to have him join the team.
                      It was a difficult position to fill since they required a
                      lot coming in: a high level of technical experience and
                      sophistication particularly with mobile apps, excellent
                      communication skills for the horizontal structure of the
                      mobile app, and the ability to drive the product forward
                      with good design instincts and planning. Paul has all of
                      these skills in spades.
                    </p>

                    <h6>Jeff Kelsey, Ticketmaster</h6>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="client-item text-center">
                    <span className="icon-quote mb-50"></span>
                    <br />

                    <h5 className="mb-30">WHAT PEOPLE ARE SAYING</h5>

                    <p className="mb-20">
                      Paul demonstrated a strong knowledge of development of web
                      applications that simultaneously support both desktop and
                      mobile phone browsers. His web application interfaces were
                      clean and well thought out.
                    </p>

                    <h6>George Sconyers, American Technology Corporation</h6>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="client-item text-center">
                    <span className="icon-quote mb-50"></span>
                    <br />

                    <h5 className="mb-30">WHAT PEOPLE ARE SAYING</h5>

                    <p className="mb-20">
                      When it comes to anything technical, Paul is your man. He
                      has never ceased to impress me with his various skills and
                      talents.
                    </p>

                    <h6>Richard Doyle, MongoDB</h6>
                  </div>
                </SwiperSlide>

                <div
                  className="swiper-pagination"
                  id="main-slider-pagination"
                ></div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

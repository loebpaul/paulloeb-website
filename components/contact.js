import React, { useState } from "react";
import emailjs from "emailjs-com";
import dynamic from "next/dynamic";

// Import Toast dynamically with SSR disabled to avoid SVG import issues
const Toast = dynamic(() => import("react-lite-toast").then((mod) => mod.Toast), {
  ssr: false,
});

const Contact = () => {
  const [toast, setToast, setToastType] = useState(false);

  function sendEmail(e) {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_m7fc1qh",
        "template_kp49d4j",
        e.target,
        "user_No8PUy2RoEvnPzkfcAVXs"
      )
      .then(
        (result) => {
          if (result.text == "OK") {
            window.toastOutcome = "success";
            setToast(!toast);
            //console.log(result.text)
          }
        },
        (error) => {
          window.toastOutcome = "error";
          setToast(!toast);
          console.log(error.text);
        }
      );
  }
  return (
    <section className="contact section-padding">
      <div className="contact-overlay"></div>

      <div className="text-center mb-50">
        <h4 className="tit tit-center">GET IN TOUCH</h4>
      </div>

      <div className="contact-item container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <form
              className="form"
              onSubmit={sendEmail}
              id="contact-form"
              method="post"
              action="#"
            >
              <div className="messages"></div>

              <div className="controls">
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      id="from_name"
                      type="text"
                      name="from_name"
                      placeholder="Name *"
                      required="required"
                      data-error="Firstname is required."
                    />
                    <div className="help-block with-errors"></div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      id="from_email"
                      type="email"
                      name="from_email"
                      placeholder="Email *"
                      required="required"
                      data-error="Valid email is required."
                    />
                    <div className="help-block with-errors"></div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      placeholder="Subject"
                    />
                    <div className="help-block with-errors"></div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message *"
                      rows="4"
                      required="required"
                      data-error="Message."
                    ></textarea>
                    <div className="help-block with-errors"></div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <input
                    type="submit"
                    className="button"
                    value="Send Message"
                    id="btnSubmitContact"
                  />
                </div>
                {toast && window.toastOutcome == "success" && (
                  <Toast
                    type="success"
                    title="Message Sent"
                    description="Thank you, your message was sent successfully."
                    position="bottomleft"
                    duration={3000}
                  />
                )}
                {toast && window.toastOutcome == "error" && (
                  <Toast
                    type="error"
                    title="Error Sending Message"
                    description="Something went wrong sending your message."
                    position="bottomleft"
                    duration={3000}
                  />
                )}
                <div className="clear-fix"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

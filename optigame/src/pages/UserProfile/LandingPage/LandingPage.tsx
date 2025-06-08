import React from "react";
import Features from "./components/Features";
import Introduction from "./components/Introduction";
import AboutUs from "./components/AboutUs";
import data from "./data/data.json";
import LandingNavbar from "./components/LandingNavbar";
import ContactUs from "./components/ContactUs";
const LandingPage = () => {
  return (
    <div>
      <LandingNavbar />
      <div id="introduction">
        <Introduction introData={data.Introduction} />
      </div>
      <div id="features">
        <Features features={data.Features} />
      </div>
      <div id="aboutus">
        <AboutUs blurb={data.AboutUs.blurb} whyChoose={data.AboutUs.whyChoose} />
      </div>
      <div id="contactus">
        <ContactUs/>

      </div>
    </div>
  );
};

export default LandingPage
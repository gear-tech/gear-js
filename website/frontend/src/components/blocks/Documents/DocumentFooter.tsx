import React, { VFC } from 'react';
import Logo from 'assets/images/logo_gray.svg';
import './Document.scss';

export const DocumentFooter: VFC = () => (
  <section className="footer-section">
    <div className="inner-block">
      <div className="contact-block" id="contacts">
        <h2>Contact us</h2>
        <div className="row">
          <a href="tel:1-978-235-0880">1-978-235-0880</a>
          <a href="mailto:veller@gear-tech.io">hello@gear-tech.io</a>
        </div>
      </div>

      <a href="#" className="logo">
        <img src={Logo} alt="logo" />
      </a>
      <div className="copyrights">2022. All rights reserved.</div>
    </div>
  </section>
);

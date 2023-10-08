import React from 'react'
import './TandC.css'
const TandC = () => {
  return (
    <div className="product-information">
      <h1 style={{ fontSize: '24px', textAlign: 'center' }}>Product Information</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        We make every effort to provide accurate product descriptions, prices, and availability information.
        However, we do not warrant that product descriptions or other content on the website are accurate, complete,
        reliable, current, or error-free.
      </p>

      <h2 style={{ fontSize: '20px' }}>Terms and Conditions for IMAGO</h2>
      <ol>
        <li>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using IMAGO, you agree to comply with and be bound by these terms and conditions. If you do not agree with these terms, please do not use this website.
          </p>
        </li>
        <li>
          <h3>2. Privacy Policy</h3>
          <p>
            Please review our Privacy Policy, which governs the collection, use, and disclosure of personal information on the website.
          </p>
        </li>
        <li>
          <h3>3. Product Information</h3>
          <p>
            We make every effort to provide accurate product descriptions, prices, and availability information. However, we do not warrant that product descriptions or other content on the website are accurate, complete, reliable, current, or error-free.
          </p>
        </li>
        <li>
          <h3>4. Orders and Payment</h3>
          <p>
            a. By placing an order, you agree to pay the specified price for the products or services, including any applicable taxes and shipping fees.
          </p>
          <p>
            b. Payment methods and details will be provided during the checkout process.
          </p>
        </li>
        <li>
          <h3>5. Shipping and Delivery</h3>
          <p>
            a. We will make reasonable efforts to deliver products within the estimated timeframe, but we are not responsible for delays beyond our control.
          </p>
          <p>
            b. Risk of loss or damage to products passes to you upon delivery.
          </p>
        </li>
        <li>
          <h3>6. Returns and Refunds</h3>
          <p>
            Please review our Return and Refund Policy for information on returning products and requesting refunds.
          </p>
        </li>
        <li>
          <h3>7. User Accounts</h3>
          <p>
            a. You are responsible for maintaining the confidentiality of your account information and password.
          </p>
          <p>
            b. You are responsible for all activities that occur under your account.
          </p>
        </li>
        <li>
          <h3>8. Prohibited Activities</h3>
          <p>
            You agree not to engage in any unlawful, abusive, or disruptive behavior on the website. This includes, but is not limited to, hacking, spamming, or transmitting harmful code.
          </p>
        </li>
        <li>
          <h3>9. Intellectual Property</h3>
          <p>
            All content on this website, including text, images, logos, and trademarks, is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute our content without our written permission.
          </p>
        </li>
        <li>
          <h3>10. Limitation of Liability</h3>
          <p>
            We are not liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our website or products.
          </p>
        </li>
        <li>
          <h3>11. Termination</h3>
          <p>
            We reserve the right to terminate or suspend your access to the website at our discretion, without notice, for any reason.
          </p>
        </li>
        <li>
          <h3>12. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms and conditions at any time. Please check this page regularly for updates.
          </p>
        </li>
      </ol>
      <p>
        If you have any questions or concerns about these terms and conditions, please contact us at <a href="https://imago-alpha.vercel.app">imago-alpha.vercel.app</a>.
      </p>

      <p>
        These terms and conditions are a basic template and should be customized to fit the specific needs and legal requirements of your e-commerce website. It's crucial to seek legal advice to ensure compliance with relevant laws and regulations in your jurisdiction.
      </p>
    </div>
  )
}

export default TandC
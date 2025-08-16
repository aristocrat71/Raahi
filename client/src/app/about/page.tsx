import styles from "./page.module.css";
import Button from "@/components/ui/Button";

export default function About() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>About Raahi</h1>
        <p className={styles.subtitle}>Your personal travel companion for planning and organizing trips</p>
      </section>

      <section className={styles.content}>
        <div className={styles.textSection}>
          <h2>Our Mission</h2>
          <p>
            At Raahi, we believe that travel planning should be as enjoyable as the journey itself. 
            Our mission is to simplify the travel planning process, making it stress-free and accessible to everyone.
          </p>
          <p>
            We've created a platform that helps you organize all aspects of your trips in one place,
            from itineraries and accommodations to activities and transportation.
          </p>
        </div>

        <div className={styles.textSection}>
          <h2>Our Story</h2>
          <p>
            Raahi was born out of a passion for travel and the frustration of managing travel plans across multiple apps and documents.
            We wanted to create a comprehensive solution that addresses all the pain points of travel planning.
          </p>
          <p>
            Our team of travel enthusiasts and tech experts came together to build a platform that combines
            intuitive design with powerful planning tools to enhance your travel experience.
          </p>
        </div>

        <div className={styles.textSection}>
          <h2>Why Choose Us</h2>
          <ul className={styles.featureList}>
            <li>Comprehensive trip planning tools</li>
            <li>User-friendly interface</li>
            <li>Personalized recommendations</li>
            <li>Collaborative planning features</li>
            <li>Secure and private</li>
            <li>Accessible on all devices</li>
          </ul>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Join Our Community of Travelers</h2>
          <p className={styles.ctaSubtitle}>
            Start planning your dream vacations with Raahi today.
          </p>
          <Button href="/login" size="large">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

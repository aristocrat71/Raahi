import styles from "./page.module.css";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          {/* SVG background pattern or world map could go here */}
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Your Personal <span>Travel Planner</span>
          </h1>
          <p className={styles.subtitle}>
            Plan your trips, organize your itineraries, and explore the world with Raahi.
            Keep all your travel plans in one place and focus on creating memories.
          </p>
          <div className={styles.cta}>
            <Button href="/login" size="large">
              Get Started
            </Button>
            <Button href="/about" variant="outline" size="large">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose Raahi?</h2>
        <p className={styles.sectionSubtitle}>
          Our platform offers everything you need to plan and enjoy your travels
        </p>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Smart Itinerary Planning</h3>
            <p className={styles.featureDescription}>
              Create detailed day-by-day travel plans with our intuitive planning tools. Organize activities, accommodations, and transportation in one place.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Destination Discovery</h3>
            <p className={styles.featureDescription}>
              Explore popular destinations and hidden gems. Get personalized recommendations based on your travel preferences and interests.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Trip Sharing</h3>
            <p className={styles.featureDescription}>
              Collaborate with friends and family on trip planning. Share itineraries, suggestions, and travel memories with your travel companions.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>
          Start planning your next adventure in just a few simple steps
        </p>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Create an Account</h3>
            <p className={styles.stepDescription}>
              Sign up for free using your email or Google account to access all features.
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Plan Your Trip</h3>
            <p className={styles.stepDescription}>
              Use our tools to create detailed itineraries, add activities, and organize your travel schedule.
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Enjoy Your Journey</h3>
            <p className={styles.stepDescription}>
              Access your plans on the go, get reminders, and make the most of your travel experience.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Next Adventure?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of travelers who plan and organize their trips with Raahi.
          </p>
          <Button href="/login" size="large">
            Sign Up For Free
          </Button>
        </div>
      </section>
    </>
  );
}

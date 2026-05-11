import Link from "next/link";
import styles from "./page.module.css";

export default function MarketingHomepage() {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <h1 className={styles.title}>
          The Lightning Fast, Offline-First Bookmark Manager
        </h1>
        <p className={styles.subtitle}>
          Save, organize, and search your links instantly. Linke is a lightweight PWA that keeps your data cached locally for zero-latency access, while securely syncing to the cloud in the background.
        </p>
        <Link href="/dashboard" className={styles.ctaButton}>
          Open App (Free)
        </Link>
      </header>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Developers and Students Choose Linke</h2>
        <div className={styles.grid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Zero Latency Search</h3>
            <p className={styles.featureDesc}>
              Unlike other bookmark managers, Linke saves your links directly to your browser's IndexedDB. This means filtering and searching through thousands of links happens instantly, with absolutely zero server lag.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>☁️</div>
            <h3 className={styles.featureTitle}>Automated Cloud Sync</h3>
            <p className={styles.featureDesc}>
              When you are online, Linke automatically pushes your saved links to a secure PostgreSQL database. If you switch devices, your entire bookmark library syncs instantly.
            </p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3 className={styles.featureTitle}>Progressive Web App</h3>
            <p className={styles.featureDesc}>
              Install Linke directly to your iOS or Android home screen. It functions exactly like a native app, complete with offline capabilities so you can read your saved links on the subway or an airplane.
            </p>
          </article>
        </div>
      </section>

      {/* FAQ / Semantic SEO Content */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        
        <div className={styles.faqItem}>
          <h3 className={styles.faqQuestion}>What is an offline bookmark manager?</h3>
          <p className={styles.faqAnswer}>
            An offline bookmark manager like Linke stores your saved URLs, tags, and folders directly on your device's local storage. This allows you to access and organize your resources even when you don't have an active internet connection.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3 className={styles.faqQuestion}>How do I save links offline?</h3>
          <p className={styles.faqAnswer}>
            Simply paste the URL into Linke. Our background service worker will attempt to fetch the metadata (title and description). Once saved, the link and its metadata are cached permanently on your device.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h3 className={styles.faqQuestion}>Is it better than default browser bookmarks?</h3>
          <p className={styles.faqAnswer}>
            Yes. Built-in browser bookmarks lack robust tagging, full-text search, and cross-platform synchronization without forcing you into an ecosystem (like Chrome or Safari). Linke is a lightweight, cross-platform productivity link organizer that works everywhere.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Linke. The offline-first bookmark manager for students and developers.</p>
      </footer>
    </div>
  );
}

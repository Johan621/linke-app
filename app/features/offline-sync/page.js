import Link from "next/link";
import styles from "../../page.module.css";

export const metadata = {
  title: "Offline Bookmark Manager | Save Links Without Internet",
  description: "Linke is a robust offline bookmark manager. Save, read, and organize your web links completely offline with zero server latency.",
  keywords: ["offline bookmark manager", "save links offline", "read it later offline", "PWA bookmarks"],
  alternates: {
    canonical: "/features/offline-sync",
  },
};

export default function OfflineSyncFeature() {
  return (
    <div className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.title}>The Ultimate Offline Bookmark Manager</h1>
        <p className={styles.subtitle}>
          Stop relying on an internet connection to access your own data. Linke is a progressive web app (PWA) designed from the ground up to be an offline-first bookmark organizer.
        </p>
        <Link href="/dashboard" className={styles.ctaButton}>
          Try It For Free
        </Link>
      </header>

      <section className={styles.featuresSection}>
        <div className={styles.faqItem}>
          <h2 className={styles.sectionTitle}>How an Offline Bookmark Manager Works</h2>
          <p className={styles.faqAnswer}>
            When you use cloud-only bookmark managers, every search, tag, and folder open requires a round-trip to a database server. If you are on an airplane, subway, or dealing with spotty Wi-Fi, you lose access to your critical resources.
          </p>
          <br/>
          <p className={styles.faqAnswer}>
            Linke solves this by utilizing your browser's native <strong>IndexedDB</strong>. When you save a link, it is instantly written to your device's hard drive. Your entire library of saved links, tags, and folders is always available, with absolutely zero latency. 
          </p>
        </div>

        <div className={styles.faqItem}>
          <h2 className={styles.faqQuestion}>Does it still backup to the cloud?</h2>
          <p className={styles.faqAnswer}>
            Yes! While Linke functions as a standalone offline bookmark app, it features a background synchronization engine. The moment your device detects an internet connection, it silently pushes your new bookmarks to our secure, encrypted Supabase PostgreSQL database.
          </p>
        </div>

        <div className={styles.faqItem}>
          <Link href="/" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>
            &larr; Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

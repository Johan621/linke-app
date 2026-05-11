import Link from "next/link";
import styles from "../../page.module.css";

export const metadata = {
  title: "Bookmark Organizer With Tags | Lightning Fast Search",
  description: "Organize your web research effortlessly. Linke is a powerful bookmark organizer with tagging, full-text search, and folder management for developers and students.",
  keywords: ["bookmark organizer with tags", "link search engine", "developer link organizer", "student research bookmarks"],
  alternates: {
    canonical: "/features/tags-search",
  },
};

export default function TagsSearchFeature() {
  return (
    <div className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.title}>A Bookmark Organizer That Actually Works</h1>
        <p className={styles.subtitle}>
          Stop losing important articles in chaotic browser bookmark bars. Linke provides deep tagging and instant full-text search to retrieve your links in milliseconds.
        </p>
        <Link href="/dashboard" className={styles.ctaButton}>
          Start Organizing
        </Link>
      </header>

      <section className={styles.featuresSection}>
        <div className={styles.faqItem}>
          <h2 className={styles.sectionTitle}>Organize With Tags & Folders</h2>
          <p className={styles.faqAnswer}>
            As a developer or student, you collect hundreds of links: API documentation, GitHub repositories, research papers, and tutorials. A simple folder structure isn't enough.
          </p>
          <br/>
          <p className={styles.faqAnswer}>
            Linke allows you to assign multiple custom tags to every link you save. This means a single article can exist in your "WebDev" folder, while simultaneously being tagged as `#react` and `#tutorial`. When you need it, you simply type your tags into the search bar, and Linke filters your entire library instantly.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h2 className={styles.faqQuestion}>Instant Full-Text Search</h2>
          <p className={styles.faqAnswer}>
            Because Linke caches your metadata (titles, descriptions, and domains) directly on your device, our search engine operates with zero latency. Every keystroke instantly filters your links. You no longer have to remember exactly what you named a bookmark—just search for a word you remember from the description.
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

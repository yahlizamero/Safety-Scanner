import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import heroImg from "../../assets/hero-teens.png"; // <- make sure the filename matches
import logo from "../../assets/project-logo.png";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.brandRow}>
            <img src={logo} alt="SafetyScanner" className={styles.brandLogo} />
          </div>
          <div className={styles.kicker}>Teen Internet Safety • BeSafe</div>

          <h1 className={styles.headline}>
            Scan before you share.
            <br />
            Stay safer online.
          </h1>

          <p className={styles.subhead}>
            SafetyScanner checks photos and public presence before they go online.
            It flags identifying details (logos, location clues, license plates) and suggests quick fixes like blur or crop.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/auth" className={styles.primaryBtn}>Sign in</Link>
            <a href="#about" className={styles.secondaryBtn}>Learn more</a>
          </div>

          <div className={styles.miniStats}>
            <div className={styles.stat}>
              <div className={styles.statTop}>Detect</div>
              <div className={styles.statBottom}>Risky details</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statTop}>Suggest</div>
              <div className={styles.statBottom}>Blur / Crop</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statTop}>Report</div>
              <div className={styles.statBottom}>Online footprint</div>
            </div>
          </div>
        </div>

        <aside className={styles.imageCard}>
          <div className={styles.imageWrap}>
            <img className={styles.heroImage} src={heroImg} alt="Teens using a phone" />
            <div className={styles.imageGlow} />
            <div className={styles.imageBadge}>Safer sharing, in seconds</div>
          </div>

          <div className={styles.sideBody}>
            <h3 className={styles.sideTitle}>What we detect</h3>
            <ul className={styles.sideList}>
              <li>Logos, badges, school names</li>
              <li>Location hints: signs, landmarks</li>
              <li>License plates & unique IDs</li>
              <li>Risky context that exposes info</li>
            </ul>
          </div>
        </aside>
      </section>

        <section id="about">
          <h2 className={styles.sectionTitle}>About SafetyScanner</h2>
          <p className={styles.aboutText}>
            The goal is simple: help teen girls spot what could reveal too much — before posting. <br />
            You get clear warnings and quick edits, with a future “public presence” report to help you lock down what’s visible.
            Change modes for safety education or get help resources if needed.
          </p>
        </section>

        {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Photo safety scan</h3>
          <p className={styles.featureText}>
            Upload a photo and get alerts about identifying details.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Fix suggestions</h3>
          <p className={styles.featureText}>
            Blur/crop recommendations that reduce exposure before sharing.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Safety tips and help</h3>
          <p className={styles.featureText}>
            Recieve safety recommendations and privacy tips.
            Provides Hotlines and Resources for support.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

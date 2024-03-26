import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Modpacks",
    description: (
      <>
        Echo Enterprises offers carefully curated Minecraft modpacks, tailored
        for diverse playstyles. Dive into epic adventures or unleash your
        creativity with our mods. Join our community for an unparalleled gaming
        experience!
      </>
    ),
  },
  {
    title: "Discord Bots",
    description: (
      <>
        Echo Enterprises delivers finely-tuned bots designed to enhance your
        Discord experience. Our bots are tailored to cater to various needs,
        from moderation to entertainment. Join our Discord community to access
        these powerful tools and elevate your server's functionality and fun!.
      </>
    ),
  },
  {
    title: "Servers",
    description: (
      <>
        Echo Enterprises offers immersive multiplayer servers for all
        playstyles. Join us for unforgettable adventures and community fun!
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center"></div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

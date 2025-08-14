import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Frontend Development',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Comprehensive frontend documentation covering React components, styling guides,
        and performance best practices for modern web applications.
      </>
    ),
    link: '/ubeda-afb/',
  },
  {
    title: 'Backend Services',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Backend development guides including API design, database management,
        authentication, and microservices architecture.
      </>
    ),
    link: '/ubeda-afb/',
  },
  {
    title: 'API Reference',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Complete API documentation with endpoints, authentication, SDKs,
        and integration examples for developers.
      </>
    ),
    link: '/ubeda-afb/',
  },
];

function Feature({Svg, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        {link && (
          <div style={{ marginTop: '1rem' }}>
            <a
              className="button button--secondary button--sm"
              href={link}>
              View Documentation →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className="text--center" style={{ marginBottom: '2rem' }}>
            <Heading as="h2">Documentation Hub</Heading>
            <p>Comprehensive documentation for all your development needs</p>
          </div>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
          <div className="row" style={{ marginTop: '2rem' }}>
            <div className="col col--6 col--offset-3">
              <div className="text--center">
                <Heading as="h3">DevOps & Infrastructure</Heading>
                <p>
                  Deployment guides, monitoring setup, and operational procedures
                  for maintaining reliable systems.
                </p>
                <a
                  className="button button--outline button--primary"
                  href="/ubeda-afb/">
                  View DevOps Docs →
                </a>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '2rem' }}>
            <div className="col col--6 col--offset-3">
              <div className="text--center">
                <Heading as="h3">Getting Started</Heading>
                <p>
                  New to the platform? Start with our comprehensive tutorials
                  to get up and running quickly.
                </p>
                <a
                  className="button button--outline button--secondary"
                  href="/ubeda-afb/">
                  View Tutorials →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

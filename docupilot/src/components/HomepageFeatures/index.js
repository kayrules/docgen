import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
//import DocsAssistant from './DocsAssistant.js';

const FeatureList = [
  {
    title: 'Read online repo to generate document',
    Svg: require('@site/static/img/undraw_online-organizer_1kdy.svg').default,
    description: (
      <>
        Automatically reads an online code repository and generates documentation based on the code it finds. 
        It's great for quickly creating initial project documentation without manual effort.
      </>
    ),
    link: '/frontend/intro',
  },
  {
    title: 'Step-by-step code explanation',
    Svg: require('@site/static/img/undraw_road-to-knowledge_f9zn.svg').default,
    description: (
      <>
        Provides a detailed, line-by-line breakdown of a code snippet or function. 
        It's useful for understanding complex logic, debugging, or learning a new language or framework by seeing how each part works together.
      </>
    ),
    link: '/backend/intro',
  },
  {
    title: 'Custom prompt-based documentation',
    Svg: require('@site/static/img/undraw_booking_1ztt.svg').default,
    description: (
      <>
        Allows you to generate documentation tailored to a specific request or prompt. 
        Instead of creating a standard document, you can ask for things like a "quick start guide," a "technical overview for senior developers," or an "API reference," and the system will create it for you.
      </>
    ),
    link: '/api/intro',
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

// ADD CODE BELOW TO ADD DOCS ASSISTANT BUTTONA
// 
//           <div className="row" style={{ marginTop: '2rem' }}>
//             <div className="col col--6 col--offset-3">
//               <div className="text--center">
//                 <Heading as="h3">Getting Started</Heading>
//                 <p>
//                   New to the platform? Start with our comprehensive tutorials
//                   to get up and running quickly.
//                 </p>
//                 <a
//                   className="button button--outline button--secondary"
//                   href="/tutorials/intro">
//                   View Tutorials →
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <DocsAssistant />
//     </>
//   );
// }
import { GrMail } from 'react-icons/gr'
import { FaMapMarkerAlt, FaPhoneAlt, FaSkype, FaGithub } from 'react-icons/fa'
import Layout, { EN, IT } from '../components/layout'
import CVElement from '../components/cv-element'
import Link from 'next/link'

const SectionTitle = ({ name }) => <h2 className="mb-6 uppercase text-3xl">{name}</h2>

export default function IndexPage() {
  return (
    <Layout hasToggle={true}>
      {({ lang }) => (
        <div className="pt-4 px-8 pb-8">
          <section className="pb-8 mb-8 border-b-2 border-gray-800 dark:border-gray-100">
            <div className="sm:flex">
              <div className="flex flex-col justify-between sm:w-3/5 border-gray-300 dark:border-gray-600 border-b-2 sm:border-b-0 mb-4 sm:mb-0 pb-4 sm:pb-0 sm:border-r-2 sm:mr-2">
                <div className="sm:mb-6">
                  <h1 className="text-3xl font-bold">Cristiano Piemontese</h1>
                  <h2 className="text-xl font-light text-emerald-500 dark:text-emerald-400">Software Engineer</h2>
                </div>
              </div>
              <div className="flex flex-col justify-center sm:w-2/5">
                <div className="flex items-center">
                  <FaMapMarkerAlt />
                  <span className="ml-2">{lang === EN ? 'Bologna, Italy' : 'Bologna'}</span>
                </div>
                <div className="flex items-center">
                  <GrMail />
                  <a
                    className="ml-2 truncate text-emerald-500 dark:text-emerald-400"
                    href="mailto:cristiano.piemontese@gmail.com"
                  >
                    cristiano.piemontese@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGithub />
                  <a className="ml-2 text-emerald-500 dark:text-emerald-400" href="https://github.com/cpiemontese">
                    cpiemontese
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="md:flex">
            <div className="md:w-1/2 md:mr-12">
              <SectionTitle name={`${lang === EN ? 'Work Experience' : 'Esperienza Lavorativa'}`} />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Associate engineering manager"
                subtitle={`Prima (Remot${lang === EN ? 'e' : 'o'})`}
                period={`2024 - Present${lang === IT ? 'e' : ''}`}
                list={[
                  {
                    [EN]: 'Lead a team in the development of core services, libraries and general DevEx improvements',
                    [IT]: 'Guidato un team nello sviluppo di servizi core, librerie e miglioramenti generali della DevEx',
                  },
                  {
                    [EN]: "Took part in the Platform leadership team, contributing to the definition of Prima's platform vision and strategy",
                    [IT]: 'Ho fatto parte del Platform leadership team, contribuendo alla definizione della visione e della strategia della piattaforma di Prima',
                  },
                ]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Software engineer"
                subtitle={`Prima (Remot${lang === EN ? 'e' : 'o'})`}
                period={`2022 - 2024`}
                list={[
                  {
                    [EN]: 'Developed and maintained open source libraries and core services (emailing and PDF generation) written in Elixir and Rust',
                    [IT]: 'Sviluppato e mantenuto librerie open source e servizi core (emailing e generazione di PDF) scritti in Elixir e Rust',
                  },
                  {
                    [EN]: "Maintained Prima's Backstage instance",
                    [IT]: "Mantenuto l'istanza di Backstage di Prima",
                  },
                  {
                    [EN]: 'Ran first Devex survey and related interviews',
                    [IT]: 'Svolto la prima survey di Devex e relative interviste',
                  },
                  {
                    [EN]: 'Acted as main driver for planning/prioritizing work for my team',
                    [IT]: 'Agito come principale motore per la pianificazione/prioritizzazione del lavoro per il mio team',
                  },
                ]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Backend developer"
                subtitle={`Vidiemme (Remot${lang === EN ? 'e' : 'o'})`}
                period={`2021 - 2022`}
                list={[
                  {
                    [EN]: 'Developed REST and GraphQL APIs',
                    [IT]: 'Sviluppato API REST e GraphQL',
                  },
                  {
                    [EN]: 'Developed Fullstack applications using Typescript, AdonisJS and SQL databases',
                    [IT]: 'Sviluppato applicazioni in SSR con Typescript, AdonisJS e database SQL',
                  },
                ]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Full-stack developer"
                subtitle={`MIA-Platform (Milan${lang === EN ? '' : 'o'})`}
                period="2019 - 2021"
                list={[
                  {
                    [EN]: 'Contributed to developing the Digital Integration Hub for Helvetia Insurance',
                    [IT]: 'Contribuito allo sviluppo del Digital Integration Hub per Helvetia Assicurazioni',
                  },
                  {
                    [EN]: 'Developed, tested and monitored microservice architectures (Node.js) communicating through REST interfaces, Kafka queues or Mongo dbs and deployed through Kubernetes',
                    [IT]: 'Sviluppato, testato e monitorato architetture a microservizi (Node.js) con comunicazione tramite interfacce REST, code Kafka o database Mongo e deployment con Kubernetes',
                  },
                  {
                    [EN]: 'Created Kibana dashboards to visualize both business and health metrics for our services',
                    [IT]: 'Creato dashboard di Kibana per la visualizzazione di metriche di business e di salute per i nostri servizi',
                  },
                  {
                    [EN]: 'Worked with emerging technologies such as KSQL',
                    [IT]: 'Lavorato con tecnologie emergenti come KSQL',
                  },
                  {
                    [EN]: 'Worked with Gitlab’s CI/CD tools',
                    [IT]: 'Lavorato con strumenti di CI/CD di Gitlab',
                  },
                ]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Full-stack developer"
                subtitle="NSI Nier Soluzioni Informatiche (Bologna)"
                period="2019"
                list={[
                  {
                    [EN]: 'Developed web applications using Mongo (Mongoose, KeystoneJS), Express and Bootstrap',
                    [IT]: 'Sviluppato applicazioni web usando Mongo (Mongoose, KeystoneJS), Express e Bootstrap',
                  },
                  {
                    [EN]: 'Maintained legacy web applications',
                    [IT]: 'Manutenuto applicazioni web legacy',
                  },
                ]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Freelance front-end developer"
                subtitle="EMMEPI s.r.l. (Bologna)"
                period="2018"
              >
                <ul className="mt-4 list-disc list-outside">
                  <li>{lang === EN ? 'Developed the showcase website ' : 'Sviluppato il sito vetrina '}</li>
                </ul>
              </CVElement>
              <CVElement
                className="mb-14"
                lang={lang}
                title="Freelance front-end developer"
                subtitle="FEED-0 (Bologna)"
                period="2017"
                list={[
                  {
                    [EN]: 'Developed the front-end of the FEED-0 e-commerce website',
                    [IT]: 'Sviluppato la parte front-end del sito web e-commerce di FEED-0',
                  },
                ]}
              />
              <SectionTitle name={lang === EN ? 'Education' : 'Formazione'} />
              <CVElement
                className="mb-6"
                lang={lang}
                title={lang === EN ? "Master's Degree in Computer Science" : 'Laurea Magistrale in Informatica'}
                subtitle={`Alma Mater Studiorum - Universit${lang === EN ? 'y of Bologna' : 'à di Bologna'}`}
                period="2018"
                grade={lang === EN ? 'Final mark: 110/110 cum laude' : 'Valutazione: 110/110 e lode'}
              >
                <p>{lang === EN ? 'Thesis in' : 'Tesi di laurea in'} Emerging Programming Paradigms:</p>
                <a className="text-emerald-500 dark:text-emerald-400" href="https://amslaurea.unibo.it/17293/">
                  {lang === EN
                    ? '“Developement of an Interactive Theorem Prover in ELPI”'
                    : '“Sviluppo di un Interactive Theorem Prover in ELPI”'}
                </a>
              </CVElement>
              <CVElement
                className="mb-14 md:mb-0"
                lang={lang}
                title={lang === EN ? "Bachelor's Degree in Computer Science" : 'Laurea Triennale in Informatica'}
                subtitle={`Alma Mater Studiorum - Universit${lang === EN ? 'y of Bologna' : 'à di Bologna'}`}
                period="2016"
                grade={lang === EN ? 'Final mark: 108/110' : 'Valutazione: 108/110'}
              >
                <p>{lang === EN ? 'Thesis in' : 'Tesi di laurea in'} Computer Vision:</p>
                <a className="text-emerald-500 dark:text-emerald-400" href="https://amslaurea.unibo.it/10883/">
                  {lang === EN
                    ? '“Design and implementation of an interactive didactic application for object recognition based on the SIFT algorithm”'
                    : '“Progettazione e implementazione di un’applicazione didattica interattiva per il riconoscimento di oggetti basata sull’algoritmo SIFT”'}
                </a>
              </CVElement>
            </div>
            <div className="md:w-1/2 md:ml-12">
              <SectionTitle name={`${lang === EN ? 'Skills' : 'Competenze'}`} />
              <CVElement
                className="mb-14"
                lang={lang}
                title={lang === EN ? 'Technical skills' : 'Tecniche'}
                list={(function () {
                  const languages = 'C, C++, C#, CSS, Elixir, HTML, Javascript, Python, Rust, Typescript'
                  const techsAndFrameworks =
                    'Docker, Git, GraphQL, Kafka, Kubernetes, MongoDB, SQL, Next.js, Node.js, React, Tailwindcss, Unity3D'
                  const ckadCredlyLink = 'https://www.credly.com/badges/9a267086-bd53-408e-b0c5-e9ce6d79dafb/public_url'
                  const linkClass = 'text-emerald-500 dark:text-emerald-400'

                  return [
                    {
                      [EN]: `Languages: ${languages}`,
                      [IT]: `Linguaggi: ${languages}`,
                    },
                    {
                      [EN]: `Technologies: ${techsAndFrameworks}`,
                      [IT]: `Tecnologie: ${techsAndFrameworks}`,
                    },
                    {
                      [EN]: 'Experience with microservice architectures, REST and GraphQL APIs and event streaming platforms',
                      [IT]: 'Esperienza con architetture a microservizi, API REST e GraphQL e piattaforme di event streaming',
                    },
                    {
                      [EN]: 'Experience with full stack development in Node.js, utilizing a variety of frameworks and tools',
                      [IT]: 'Esperienza nello sviluppo full stack con Node.js, utilizzando una varietà di framework e strumenti',
                    },
                    {
                      [EN]: 'Experience with Agile methodologies like Scrum, Pair Programming and TDD',
                      [IT]: 'Esperienza con metodologie Agili tra cui Scrum, Pair Programming e TDD',
                    },
                    {
                      [EN]: (
                        <a className={linkClass} href={ckadCredlyLink}>
                          CKAD certification
                        </a>
                      ),
                      [IT]: (
                        <a className={linkClass} href={ckadCredlyLink}>
                          Certificazione CKAD
                        </a>
                      ),
                    },
                  ]
                })()}
              />
              <CVElement
                className="mb-14"
                lang={lang}
                title={'Soft skills'}
                list={[
                  {
                    [EN]: `Effective written and verbal communication`,
                    [IT]: `Efficace comunicazione scritta e verbale`,
                  },
                  {
                    [EN]: `Strong presentation skills`,
                    [IT]: `Spiccata capacità di presentazione`,
                  },
                  {
                    [EN]: `Discipline and self-motivation`,
                    [IT]: `Disciplina e automotivazione`,
                  },
                  {
                    [EN]: `Curiousity and continuous learning`,
                    [IT]: `Curiosità e apprendimento continuo`,
                  },
                  {
                    [EN]: `Active listening`,
                    [IT]: `Ascolto attivo`,
                  },
                  {
                    [EN]: `Team-oriented attitude and conflict resolution`,
                    [IT]: `Orientamento al lavoro di squadra e risoluzione dei conflitti`,
                  },
                ]}
              />
              <CVElement
                className="mb-14"
                lang={lang}
                title={lang === EN ? 'Languages' : 'Linguistiche'}
                list={[
                  {
                    [EN]: '🇮🇹 Italian: mother tongue',
                    [IT]: '🇮🇹 Italiano: madrelingua',
                  },
                  {
                    [EN]: '🇬🇧 English: C1 (advanced)',
                    [IT]: '🇬🇧 Inglese: C1 (advanced)',
                  },
                  {
                    [EN]: '🇨🇳 (Mandarin) Chinese: A2',
                    [IT]: '🇨🇳 Cinese (Mandarino): A2',
                  },
                ]}
              />
              <SectionTitle name={`${lang === EN ? 'Other projects' : 'Altri progetti'}`} />
              <CVElement className="" lang={lang} title={lang === EN ? 'Articles' : 'Articoli'}>
                <ul className="mt-4 mb-8 list-disc list-outside">
                  <li>
                    <a
                      className="text-emerald-500 dark:text-emerald-400"
                      href="https://inside.helloprima.com/insurance-is-hard-from-sweetxml-to-saxy"
                    >
                      Engineering Insurance is hard – From SweetXML to Saxy
                    </a>
                  </li>
                </ul>
              </CVElement>
              <CVElement className="" lang={lang} title={lang === EN ? 'Games' : 'Giochi'}>
                <ul className="mt-4 mb-8 list-disc list-outside">
                  <li>
                    <a className="text-emerald-500 dark:text-emerald-400" href="/run-sparty-run">
                      Run Sparty, Run!
                    </a>{' '}
                    &ndash; {lang === EN ? 'final project for the' : 'progetto finale per la'}{' '}
                    <a
                      className="text-emerald-500 dark:text-emerald-400"
                      href="https://www.coursera.org/specializations/game-development"
                    >
                      Game Design and Development Specialization
                    </a>{' '}
                    {lang === EN ? 'at' : 'di'} Coursera
                  </li>
                </ul>
              </CVElement>
              <CVElement className="" lang={lang} title="Tools">
                <ul className="mt-4 mb-8 list-disc list-outside">
                  <li>
                    <Link className="text-emerald-500 dark:text-emerald-400" href="/scales-permutation-generator">
                      {lang === EN ? 'Scales permutation generator' : 'Generatore di permutazioni di scale'}
                    </Link>
                  </li>
                </ul>
              </CVElement>
            </div>
          </section>
        </div>
      )}
    </Layout>
  )
}

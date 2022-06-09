import { GrMail } from 'react-icons/gr'
import { FaMapMarkerAlt, FaPhoneAlt, FaSkype, FaGithub } from 'react-icons/fa'
import Layout, { EN, IT } from '../components/layout'
import CVElement from '../components/cv-element'

const SectionTitle = ({ name }) => <h2 className="mb-6 uppercase text-3xl">{name}</h2>

export default function IndexPage() {
  return (
    <Layout home>
      {({ lang }) => (
        <>
          <section className="pb-8 mb-8 border-b-2 border-gray-800 dark:border-gray-100">
            <div className="sm:flex">
              <div className="flex flex-col justify-between sm:w-3/5 border-gray-300 dark:border-gray-600 border-b-2 sm:border-b-0 mb-4 sm:mb-0 pb-4 sm:pb-0 sm:border-r-2 sm:mr-2">
                <div className="sm:mb-6">
                  <h1 className="text-3xl font-bold">Cristiano Piemontese</h1>
                  <h2 className="text-xl font-light text-green-500 dark:text-green-400">Full-stack developer</h2>
                </div>
              </div>
              <div className="flex flex-col justify-center sm:w-2/5">
                <div className="flex items-center">
                  <FaMapMarkerAlt />
                  <span className="ml-2">{lang === EN ? 'Milan, Italy' : 'Milano'}</span>
                </div>
                <div className="flex items-center">
                  <GrMail />
                  <a
                    className="ml-2 truncate text-green-500 dark:text-green-400"
                    href="mailto:cristiano.piemontese@gmail.com"
                  >
                    cristiano.piemontese@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <FaSkype />
                  <a className="ml-2 text-green-500 dark:text-green-400" href="skype:cristiano.piemontese?chat">
                    cristiano.piemontese
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGithub />
                  <a className="ml-2 text-green-500 dark:text-green-400" href="https://github.com/cpiemontese">
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
                title="Software engineer"
                subtitle={`Prima Assicurazioni (Milan${lang === EN ? '' : 'o'})`}
                period={`2022 - Present${lang === IT ? 'e' : ''}`}
                list={[]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Backend developer"
                subtitle={`Vidiemme (Milan${lang === EN ? '' : 'o'})`}
                period={`2021 - 2022`}
                list={[
                  {
                    [EN]: 'Developed REST and GraphQL APIs',
                    [IT]: 'Sviluppato API REST e GraphQL',
                  },
                  {
                    [EN]: 'Developed Full applications using Typescript, AdonisJS and SQL databases',
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
                  <li>
                    {lang === EN ? 'Developed the current showcase site ' : 'Sviluppato l’attuale sito vetrina '}
                    <a className="text-green-500 dark:text-green-400" href="https://www.mpinsegne.it">
                      www.mpinsegne.it
                    </a>
                  </li>
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
                <a className="text-green-500 dark:text-green-400" href="https://amslaurea.unibo.it/17293/">
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
                period="2018"
                grade={lang === EN ? 'Final mark: 108/110' : 'Valutazione: 108/110'}
              >
                <p>{lang === EN ? 'Thesis in' : 'Tesi di laurea in'} Computer Vision:</p>
                <a className="text-green-500 dark:text-green-400" href="https://amslaurea.unibo.it/10883/">
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
                title={lang === EN ? 'Tecnical skills' : 'Informatiche'}
                list={(function () {
                  const languages = 'C, C++, C#, CSS, Elixir, HTML, Javascript, Python, Rust, Typescript'
                  const techsAndFrameworks =
                    'Docker, Git, GraphQL, Kafka, Kubernetes, MongoDB, MySQL, Next.js, Node.js, React, Tailwindcss, Unity3D'
                  const ckadCredlyLink = 'https://www.credly.com/badges/9a267086-bd53-408e-b0c5-e9ce6d79dafb/public_url'
                  const linkClass = 'text-green-500 dark:text-green-400'

                  return [
                    {
                      [EN]: `Languages: ${languages}`,
                      [IT]: `Linguaggi: ${languages}`,
                    },
                    {
                      [EN]: `Technologies and frameworks: ${techsAndFrameworks}`,
                      [IT]: `Tecnologie e frameworks: ${techsAndFrameworks}`,
                    },
                    {
                      [EN]: 'Experience with microservice architectures, REST and GraphQL APIs and event streaming platforms',
                      [IT]: 'Esperienza con architetture a microservizi, API REST e GraphQL e piattaforme di event streaming',
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
                title={lang === EN ? 'Communication and social skills' : 'Relazionali e organizzative'}
                list={[
                  {
                    [EN]: `Teamwork and leadership skills developed through work, academic and personal projects,
                    such as the participation to events like Google Hash Code`,
                    [IT]: `Ottime capacità di lavoro di squadra sviluppate attraverso esperienze lavorative,
                    progetti accademici e partecipazione a eventi come Google Hash Code`,
                  },
                  {
                    [EN]: `Good communication and listening skills with project managers,
                    teammates and clients with varying degrees of technical knowledge`,
                    [IT]: `Buone capacità di comunicazione con project manager, teammates e
                    clienti a vari livelli di conoscenza tecnica`,
                  },
                  {
                    [EN]: `Disposition towards writing documentation`,
                    [IT]: `Propensione alla scrittura di documentazione`,
                  },
                  {
                    [EN]: `Excellent problem solving abilities and learning
                    predisposition: thanks to both my academic studies and
                    personal disposition I am eager to learn new concepts,
                    technologies and languages`,
                    [IT]: `Ottime capacità di problem solving e attitudine
                    all’apprendimento: grazie sia agli studi accademici
                    che alla predisposizione personale sono desideroso
                    di imparare nuovi concetti, tecnologie e linguaggi.`,
                  },
                ]}
              />
              <CVElement
                className="mb-14"
                lang={lang}
                title={lang === EN ? 'Languages' : 'Linguistiche'}
                list={[
                  {
                    [EN]: 'Italian: mother tongue',
                    [IT]: 'Italiano: madrelingua',
                  },
                  {
                    [EN]: 'English: C1 (advanced)',
                    [IT]: 'Inglese: C1 (advanced)',
                  },
                ]}
              />
              <SectionTitle name={`${lang === EN ? 'Other projects' : 'Altri progetti'}`} />
              <CVElement className="" lang={lang} title={lang === EN ? 'Games' : 'Giochi'}>
                <ul className="mt-4 list-disc list-outside">
                  <li>
                    <a className="text-green-500 dark:text-green-400" href="/run-sparty-run">
                      Run Sparty, Run!
                    </a>{' '}
                    &ndash; {lang === EN ? 'final project for the' : 'progetto finale per la'}{' '}
                    <a
                      className="text-green-500 dark:text-green-400"
                      href="https://www.coursera.org/specializations/game-development"
                    >
                      Game Design and Development Specialization
                    </a>{' '}
                    {lang === EN ? 'at' : 'di'} Coursera
                  </li>
                </ul>
              </CVElement>
            </div>
          </section>
        </>
      )}
    </Layout>
  )
}

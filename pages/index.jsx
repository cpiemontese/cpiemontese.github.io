import Layout, { EN, IT } from "../components/layout";
import { FaMapMarkerAlt, FaPhoneAlt, FaSkype, FaGithub } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import CVElement from "../components/cv-element";

const SectionTitle = ({ name }) => (
  <h2 className=" w-max px-2 mb-6 uppercase text-xl bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800">
    {name}
  </h2>
);

export default function IndexPage() {
  return (
    <Layout home>
      {({ lang }) => (
        <>
          <section className="pb-6 mb-8 border-b-2 border-gray-800 dark:border-gray-100">
            <div className="sm:flex">
              <div className="flex flex-col justify-between sm:w-3/5 border-gray-300 dark:border-gray-600 border-b-2 sm:border-b-0 mb-4 sm:mb-0 pb-4 sm:pb-0 sm:border-r-2 sm:mr-2">
                <div className="sm:mb-6">
                  <h1 className="text-3xl font-bold">Cristiano Piemontese</h1>
                  <h2 className="text-xl font-light text-green-500 dark:text-green-400">
                    Full-stack developer
                  </h2>
                </div>
              </div>
              <div className="flex flex-col justify-center sm:w-2/5">
                <div className="flex items-center">
                  <FaMapMarkerAlt />
                  <span className="ml-2">
                    {lang === EN ? "Milan, Italy" : "Milano"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaPhoneAlt />
                  <span className="ml-2">+39 348 12 37 382</span>
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
                  <a
                    className="ml-2 text-green-500 dark:text-green-400"
                    href="skype:cristiano.piemontese?chat"
                  >
                    cristiano.piemontese
                  </a>
                </div>
                <div className="flex items-center">
                  <FaGithub />
                  <a
                    className="ml-2 text-green-500 dark:text-green-400"
                    href="https://github.com/cpiemontese"
                  >
                    cpiemontese
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section className="flex">
            <div className="sm:w-1/2">
              <SectionTitle
                name={`${
                  lang === EN ? "Work Experience" : "Esperienza Lavorativa"
                }`}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Full-stack developer"
                subtitle={`MIA-Platform (Milan${lang === EN ? "" : "o"})`}
                period={`2019 - Present${lang === IT ? "e" : ""}`}
                list={[
                  {
                    [EN]:
                      "Contributed to developing the Digital Integration Hub",
                    [IT]:
                      "Contribuito allo sviluppo del Digital Integration Hub",
                  },
                  {
                    [EN]:
                      "Developed, tested and monitored microservice architectures (Node.js) communicating through REST interfaces, Kafka queues or Mongo dbs and deployed through Kubernetes",
                    [IT]:
                      "Sviluppato, testato e monitorato architetture a microservizi (Node.js) con comunicazione tramite interfacce REST, code Kafka o database Mongo e deployment con Kubernetes",
                  },
                  {
                    [EN]:
                      "Created Kibana dashboards to visualize both business and health metrics for our services",
                    [IT]:
                      "Creato dashboard di Kibana per la visualizzazione di metriche di business e di salute per i nostri servizi",
                  },
                  {
                    [EN]: "Worked with emerging technologies such as KSQL",
                    [IT]: "Lavorato con tecnologie emergenti come KSQL",
                  },
                  {
                    [EN]: "Worked with Gitlab’s CI/CD tools",
                    [IT]: "Lavorato con strumenti di CI/CD di Gitlab",
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
                    [EN]:
                      "Developed web applications using Mongo (Mongoose, KeystoneJS), Express and Bootstrap",
                    [IT]:
                      "Sviluppato applicazioni web usando Mongo (Mongoose, KeystoneJS), Express e Bootstrap",
                  },
                  {
                    [EN]: "Maintained legacy web applications",
                    [IT]: "Manutenuto applicazioni web legacy",
                  },
                ]}
              />
              <CVElement
                className="mb-8"
                lang={lang}
                title="Freelance front-end developer"
                subtitle="EMMEPI s.r.l. (Bologna)"
                period="2018"
                list={[
                  {
                    [EN]:
                      "Developed the current showcase site (www.mpinsegne.it)",
                    [IT]:
                      "Sviluppato l’attuale sito vetrina (www.mpinsegne.it)",
                  },
                  {
                    [EN]: "Maintained legacy web applications",
                    [IT]: "Manutenuto applicazioni web legacy",
                  },
                ]}
              />
              <CVElement
                className="mb-12"
                lang={lang}
                title="Freelance front-end developer"
                subtitle="FEED-0 (Bologna)"
                period="2017"
                list={[
                  {
                    [EN]:
                      "Developed the front-end of the FEED-0 e-commerce website",
                    [IT]:
                      "Sviluppato la parte front-end del sito web e-commerce di FEED-0",
                  },
                ]}
              />
              <SectionTitle name={lang === EN ? "Education" : "Formazione"} />
            </div>
            <div className="sm:w-1/2"></div>
          </section>
        </>
      )}
    </Layout>
  );
}

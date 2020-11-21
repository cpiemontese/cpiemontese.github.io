import Layout, { EN, IT } from "../components/layout";
import { FaMapMarkerAlt, FaPhoneAlt, FaSkype, FaGithub } from "react-icons/fa";
import { GrMail } from "react-icons/gr";

export default function IndexPage() {
  return (
    <Layout home>
      {({ lang }) => (
        <section>
          <div className="sm:flex">
            <div className="flex flex-col justify-between sm:w-3/5 border-b-2 sm:border-b-0 mb-4 sm:mb-0 pb-4 sm:pb-0 sm:border-r-2 sm:mr-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold">Cristiano Piemontese</h1>
                <h2 className="text-xl font-light">Full-stack developer</h2>
              </div>
            </div>
            <div className="flex flex-col justify-center sm:w-2/5">
              <div className="flex items-center">
                <FaMapMarkerAlt />
                <span className="ml-2">{lang === EN ? "Milan" : "Milano"}</span>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt />
                <span className="ml-2">+39 348 12 37 382</span>
              </div>
              <div className="flex items-center">
                <GrMail />
                <a
                  className="ml-2 truncate"
                  href="mailto:cristiano.piemontese@gmail.com"
                >
                  cristiano.piemontese@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <FaSkype />
                <a className="ml-2" href="skype:cristiano.piemontese?chat">
                  cristiano.piemontese
                </a>
              </div>
              <div className="flex items-center">
                <FaGithub />
                <a className="ml-2" href="https://github.com/cpiemontese">
                  cpiemontese
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

import Layout from "../components/layout";
import { FaMapMarkerAlt, FaPhoneAlt, FaSkype, FaGithub } from "react-icons/fa";
import { GrMail } from "react-icons/gr";

export default function IndexPage() {
  return (
    <Layout home>
      <section>
        <div className="flex">
          <div className="flex flex-col justify-between w-2/3 border-r-2 mr-2">
            <div>
              <h1 className="text-3xl font-bold">Cristiano Piemontese</h1>
              <h2 className="text-xl font-light">Full-stack developer</h2>
            </div>
            <p>Nato a Bentivoglio (Bo) il 26/11/1994</p>
          </div>
          <div className="w-1/3">
            <div className="flex items-center">
              <FaMapMarkerAlt />
              <span className="ml-2">Milano</span>
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
    </Layout>
  );
}

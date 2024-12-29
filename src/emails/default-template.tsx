import { Body, Container, Head, Html, Tailwind } from "@react-email/components";
import { format } from "date-fns";
import type { Item, Status } from "../utils/appendStatus";

export default function DefaultTemplate({
  attractions,
}: {
  attractions: (Item & {
    status?: Status;
  })[];
}) {
  const translatedStatuses: Record<
    Status,
    {
      label: string;
      color: string;
    }
  > = {
    ADDED: { label: "Toegevoegd", color: "#16a34a" },
    REMOVED: { label: "Verwijderd", color: "#ef4444" },
    UPDATED: { label: "Bijgewerkt", color: "#f97316" },
  };

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans leading-6 text-[#4d3928] bg-[#fcf5ed]">
          <Container className="max-w-2xl">
            <div className="my-8">
              <div className="text-center size-16 bg-white outline outline-[#ede5d5] mx-auto rounded-full">
                <span className="block pt-3 text-3xl mx-auto">🔔</span>
              </div>
              <p className="font-semibold text-center mt-4 text-base">
                De onderhoudspagina van de Efteling is bijgewerkt!
              </p>
            </div>
            <p>
              Onderstaande data is verzameld op de pagina{" "}
              <a
                className="font-semibold text-[#aa182c]"
                href="https://www.efteling.com/nl/park/informatie/in-onderhoud"
                target="_blank"
              >
                Gesloten attracties
              </a>{" "}
              op de website van de Efteling. Deze pagina wordt eens per uur
              uitgelezen om wijzigingen bij te houden.
            </p>

            <p className="text-sm italic opacity-80">
              Laatst bijgewerkt: {format(new Date(), "d MMM yyyy HH:mm")}
            </p>

            <h3 className="mt-12">Gesloten attracties</h3>
            <div className="outline outline-[#ede5d5] bg-white p-2 bg rounded">
              <table className="border-collapse">
                {attractions.map((attraction, index) => (
                  <tr
                    key={index}
                    className={
                      attraction.status &&
                      `text-[${translatedStatuses[attraction.status].color}]`
                    }
                  >
                    <td className="p-2">{attraction.name}</td>
                    <td className="p-2">
                      <span className="mr-2">{attraction.period}</span>
                      {attraction.status && (
                        <div
                          className={`inline-block font-extrabold uppercase text-xs px-2 py-1 rounded bg-[${translatedStatuses[attraction.status].color}]/10`}
                        >
                          {translatedStatuses[attraction.status].label}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

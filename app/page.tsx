import { BIO, SITE_URL } from "@/lib/data/bio";
import JsonLd from "@/components/json-ld";
import HomeTerminal from "@/components/home-terminal";

export default function Home() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: BIO.name,
    jobTitle: `${BIO.title} at ${BIO.company}`,
    worksFor: { "@type": "Organization", name: BIO.company, url: BIO.companyUrl },
    url: SITE_URL,
    sameAs: [BIO.social.linkedin, BIO.social.github, BIO.social.x],
    alumniOf: BIO.education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.school,
    })),
    description: BIO.tagline,
  };

  return (
    <>
      <JsonLd data={personLd} />
      <section className="sr-only">
        <h1>{BIO.name} — {BIO.title} at {BIO.company}</h1>
        <p>{BIO.tagline}</p>
        {BIO.journey.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <h2>Projects</h2>
        {BIO.projects.map((p) => (
          <div key={p.name}>
            <a href={p.url}>{p.name}</a>
            <p>{p.description}</p>
          </div>
        ))}
        <h2>Skills</h2>
        {BIO.skills.map((cat) => (
          <div key={cat.label}>
            <h3>{cat.label}</h3>
            <p>{cat.items.join(", ")}</p>
          </div>
        ))}
      </section>
      <HomeTerminal />
    </>
  );
}

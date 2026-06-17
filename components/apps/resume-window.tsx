"use client";

import { BIO } from "@/lib/data/bio";

export default function ResumeWindow() {
  return (
    <div className="p-5 font-mono text-sm leading-relaxed overflow-y-auto">
      {/* Download link */}
      <div className="flex justify-end mb-4">
        <a
          href="#"
          className="text-accent hover:text-glow-accent underline underline-offset-2 text-xs"
        >
          Download PDF
        </a>
      </div>

      {/* Header */}
      <div className="mb-6 border-b border-terminal-border pb-4">
        <h2 className="text-foreground text-glow text-lg font-bold">
          {BIO.name}
        </h2>
        <p className="text-muted mt-1">
          {BIO.title} at{" "}
          <a
            href={BIO.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-glow-accent underline underline-offset-2"
          >
            {BIO.company}
          </a>
        </p>
        <p className="text-dim text-xs mt-1">
          {BIO.location} &middot; From {BIO.from}
        </p>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-foreground font-semibold mb-3">
          <span className="text-accent">$</span> cat education.txt
        </h3>
        <div className="ml-4 space-y-2">
          {BIO.education.map((edu) => (
            <div key={edu.school}>
              <span className="text-foreground">{edu.school}</span>
              <span className="text-dim"> — </span>
              <span className="text-muted">{edu.degree}</span>
              {"year" in edu && (
                <span className="text-dim text-xs ml-2">({edu.year})</span>
              )}
              {"note" in edu && (
                <p className="text-dim text-xs ml-4 mt-0.5">{edu.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Journey / Experience */}
      <div className="mb-6">
        <h3 className="text-foreground font-semibold mb-3">
          <span className="text-accent">$</span> cat journey.txt
        </h3>
        <ul className="ml-4 space-y-2">
          {BIO.journey.map((item, i) => (
            <li key={i} className="text-muted">
              <span className="text-dim mr-2">&bull;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-foreground font-semibold mb-3">
          <span className="text-accent">$</span> ls skills/
        </h3>
        <div className="ml-4 space-y-3">
          {BIO.skills.map((cat) => (
            <div key={cat.label}>
              <span className="text-dim text-xs">{cat.label}/</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded border border-terminal-border text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h3 className="text-foreground font-semibold mb-3">
          <span className="text-accent">$</span> ls building/
        </h3>
        <div className="ml-4 space-y-3">
          {BIO.projects.map((project) => (
            <div
              key={project.name}
              className="border border-terminal-border rounded p-3 bg-[#0d0d0d]"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-glow-accent font-semibold"
              >
                {project.name}
              </a>
              <p className="text-muted text-xs mt-1">{project.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <h3 className="text-foreground font-semibold mb-3">
          <span className="text-accent">$</span> cat interests.txt
        </h3>
        <div className="ml-4 space-y-3">
          {BIO.interests.map((interest) => (
            <div
              key={interest.label}
              className="border border-terminal-border rounded p-3 bg-[#0d0d0d]"
            >
              <span className="text-accent font-semibold text-xs">
                {interest.label}/
              </span>
              <p className="text-muted text-xs mt-1">{interest.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mb-2">
        <h3 className="text-foreground font-semibold mb-3">
          <span className="text-accent">$</span> cat contact.txt
        </h3>
        <div className="ml-4 space-y-1">
          <p>
            <span className="text-dim">email</span>
            <span className="text-dim mx-2">&rarr;</span>
            <a
              href={`mailto:${BIO.email}`}
              className="text-accent hover:text-glow-accent underline underline-offset-2"
            >
              {BIO.email}
            </a>
          </p>
          <p>
            <span className="text-dim">github</span>
            <span className="text-dim mx-2">&rarr;</span>
            <a
              href={BIO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-glow-accent underline underline-offset-2"
            >
              {BIO.social.github.replace("https://", "")}
            </a>
          </p>
          <p>
            <span className="text-dim">linkedin</span>
            <span className="text-dim mx-2">&rarr;</span>
            <a
              href={BIO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-glow-accent underline underline-offset-2"
            >
              {BIO.social.linkedin.replace("https://", "")}
            </a>
          </p>
          <p>
            <span className="text-dim">x/twitter</span>
            <span className="text-dim mx-2">&rarr;</span>
            <a
              href={BIO.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-glow-accent underline underline-offset-2"
            >
              {BIO.social.x.replace("https://", "")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

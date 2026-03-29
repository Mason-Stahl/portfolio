import React from "react";
import TransitionLink from "./TransitionLink";

type Project = {
  title: string;
  description?: string;
  href: string;
};

type ProjectsSectionProps = {
  title: string;
  projects: Project[];
};

export default function ProjectsSection({
  title,
  projects,
}: ProjectsSectionProps) {
  const count = projects.length;

  return (
    <section className="min-h-screen px-8 py-20">
      <h2 className="text-4xl font-bold mb-12">{title}</h2>

      {count === 1 && <SingleLayout project={projects[0]} />}
      {count === 2 && <TwoLayout projects={projects} />}
      {count >= 3 && <GridLayout projects={projects} />}
    </section>
  );
}

/* =========================
   Layouts
========================= */

function SingleLayout({ project }: { project: Project }) {
  return (
    <div className="max-w-5xl">
      <TransitionLink href={project.href} className="group">
        <div className="cursor-pointer">
          <div className="flex items-center gap-8 p-12 backdrop-blur-md bg-black/20 border border-white/10 hover:bg-black/30 transition-all duration-300">
            <div className="w-40 h-40 bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-semibold group-hover:opacity-80 transition">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-4 text-lg text-gray-300">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </TransitionLink>
    </div>
  );
}

function TwoLayout({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-8">
      {projects.map((p) => (
        <TransitionLink key={p.title} href={p.href} className="group">
          <div className="cursor-pointer">
            <div className="flex items-center gap-6 p-10 backdrop-blur-md bg-black/20 border border-white/10 hover:bg-black/30 transition-all duration-300">
              <div className="w-32 h-32 bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-semibold group-hover:opacity-80 transition">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="mt-2 text-gray-300">
                    {p.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TransitionLink>
      ))}
    </div>
  );
}

function GridLayout({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-8">
      {projects.map((p) => (
        <TransitionLink key={p.title} href={p.href} className="group">
          <div className="cursor-pointer">
            <div className="flex items-center gap-6 p-8 backdrop-blur-md bg-black/20 border border-white/10 hover:bg-black/30 transition-all duration-300">
              <div className="w-28 h-28 bg-gray-700 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold group-hover:opacity-80 transition">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="mt-2 text-gray-300">
                    {p.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TransitionLink>
      ))}
    </div>
  );
}

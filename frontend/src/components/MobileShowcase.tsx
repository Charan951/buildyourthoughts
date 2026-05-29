import { useCallback, useEffect, useState } from "react";
import { useSiteDataRefresh } from "@/hooks/useSiteDataRefresh";
import { fetchPublic } from "@/lib/siteData";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import MotionSection from "@/components/MotionSection";
import TextReveal from "@/components/TextReveal";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ApiProject {
  _id: string;
  title: string;
  image: string;
  category?: string;
  description?: string;
  liveUrl?: string;
  order?: number;
}

const defaultProjectCards: ApiProject[] = [
  {
    _id: "placeholder-1",
    title: "Project One",
    category: "Web",
    description: "A polished web solution built for modern business.",
    image: "",
    liveUrl: "",
    order: 0,
  },
  {
    _id: "placeholder-2",
    title: "Project Two",
    category: "Mobile",
    description: "A smart app experience optimized for mobile users.",
    image: "",
    liveUrl: "",
    order: 1,
  },
  {
    _id: "placeholder-3",
    title: "Project Three",
    category: "Design",
    description: "A visually stunning product crafted with care.",
    image: "",
    liveUrl: "",
    order: 2,
  },
];

const MobileShowcase = () => {
  const [projects, setProjects] = useState<ApiProject[]>([]);

  const loadProjects = useCallback(() => {
    fetchPublic<ApiProject[]>("/api/projects")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(
            data
              .map((project) => ({
                ...project,
                image: resolveMediaUrl(project.image),
              }))
              .sort((a, b) => (a.order || 0) - (b.order || 0))
          );
        }
      })
      .catch(() => {
        setProjects([]);
      });
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useSiteDataRefresh(["projects", "all"], loadProjects, [loadProjects]);

  const useApi = projects.length > 0;
  const displayProjects = useApi ? projects.slice(0, 3) : defaultProjectCards;

  return (
    <section className="py-16 md:py-32 overflow-hidden relative bg-background section-optimized">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative container">
        <MotionSection className="text-center mb-10 md:mb-20" animation="parallax-reveal">
          <span className="text-primary text-sm font-black uppercase tracking-[0.3em] mb-3 md:mb-4 block">Portfolio</span>
          <TextReveal
            text="Our Latest Masterpieces"
            className="text-2xl md:text-6xl font-heading font-black justify-center mb-3 md:mb-6"
          />
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-xl font-light leading-relaxed px-4 md:px-0">
            We build stunning mobile apps and web solutions that redefine user experience.
          </p>
        </MotionSection>

        <MotionSection animation="bounce-up" className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayProjects.map((project, i) => (
              <AnimatedSection key={project._id || i} delay={i * 120} animation="bounce-in">
                <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 p-4 md:p-5 shadow-[0_20px_60px_hsl(var(--primary)/0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30">
                  <div className="relative mb-4 overflow-hidden rounded-[1.5rem] bg-slate-900/40 h-48 md:h-52 shrink-0">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title || `Project ${i + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/40">No preview available</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-2">
                      {project.category || "Project"}
                    </div>
                    <h3 className="text-lg font-heading font-black text-white mb-2 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 mb-4">
                      {project.description || "A standout project demonstrating our expertise and attention to detail."}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-bold text-sm hover:text-primary/80"
                      >
                        Live Preview
                      </a>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.25em] text-white/50">No live URL</span>
                    )}

                    {project._id ? (
                      <Link to={`/projects/${project._id}`} className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-primary">
                        View Details <ArrowRight size={14} />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </MotionSection>

        <div className="text-center mt-8 md:mt-16">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-105 transition-all duration-300"
          >
            View All Projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;

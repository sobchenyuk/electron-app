import { Button } from "../components/ui/button";
import { toast } from "@/hooks/useToast";
import { Copy } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/sobchenyuk-andrey/";
const AVATAR_URL = "./avatar.png";
const FALLBACK_AVATAR_URL = "./1772872536741.png";

const START_YEAR = 2013;
const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - START_YEAR;

const skills = {
  "Frontend: Languages": ["JavaScript (8 years)", "TypeScript (4.5 years)", "ES5/6/7"],
  "Frontend: Frameworks & Libraries": ["Vue.js (4.5 years)", "React.js (4.5 years)", "Nuxt.js", "Next.js"],
  "Frontend: Mobile": ["React Native (0.5 years)", "Flutter (Pet-projects)"],
  "Frontend: Build & Template": ["Vite", "Webpack", "Gulp", "Parcel", "Pug", "Twig", "EJS", "BLADE", "Handlebars.js"],
  "UI & Styling": ["Bootstrap", "Bulma", "Semantic UI", "MaterializeCSS", "Sass", "SCSS", "LESS", "Stylus", "PostCSS"],
  "Backend: Languages": ["PHP (2 years)", "Node.js (4 years)"],
  "Backend: Node.js Frameworks": ["Express.js", "Nest.js", "Adonis.js"],
  "Backend: PHP Frameworks": ["Laravel 5+", "Yii2", "Symfony", "Slim"],
  "Backend: CMS & APIs": ["WordPress", "OpenCart 2+", "Joomla", "WooCommerce", "Drupal", "Bitrix24", "PrestaShop", "Strapi", "RESTful API", "JSON-RPC", "SOAP", "GraphQL"],
  "Databases & DevOps": ["PostgreSQL", "MySQL", "LiteSQL", "MongoDB", "Docker", "Sentry", "PWA", "Deployment automation"],
};

const workHistory = [
    {
        role: "Senior Frontend Developer & Team Lead",
        company: "Enterprise Data Management Platform",
        period: "Current Project",
        stack: "Nuxt.js 3.14, Vue.js 3, TypeScript, Tailwind CSS, Pinia",
        details: [
            "Leading development team for comprehensive enterprise frontend application.",
            "Architected server-side rendering and component structure using Vue 3 Composition API.",
            "Developed responsive design system with Storybook documentation.",
            "Configured performance optimization: code splitting, lazy loading, PWA features.",
            "Established comprehensive development workflow: ESLint, Stylelint, Husky, Docker.",
            "Integrated real-time error monitoring with Sentry and long polling for data synchronization.",
            "Technical mentoring and code review processes for development team."
        ]
    },
    {
        role: "Frontend Web Developer",
        company: "Freelance, United States of America",
        period: "Apr 2021 – Current",
        details: [
            "Full Stack Developer and blockchain development.",
            "Frontend & Backend Developer & Team Lead.",
            "Full-time remote work with US-based clients."
        ]
    },
    {
        role: "Middle Front End Developer",
        company: "Temabit Software Development, Kharkiv",
        period: "Oct 2020 – Mar 2021",
        stack: "Vue.js, Node.js, Nuxt.js, Electron.js, Adonis.js, Express.js, PostgreSQL, MySQL, LiteSQL",
        details: [
            "Development and implementation of new solutions in existing projects.",
            "Project support with Electron-Vue.js.",
            "Writing software for integration at self-service checkouts and money processing."
        ]
    },
    {
        role: "Middle Front End Developer",
        company: "Switchere, Ireland",
        period: "Apr 2019 – Sep 2020",
        stack: "Vue.js, Nuxt.js, LESS, Webpack, Perl backend",
        details: [
            "Development of web interfaces, user and client parts.",
            "Development of promotions, advertising campaigns, cashback, processing of client requests.",
            "Development of new web applications and maintenance of existing ones."
        ]
    },
    // ... other roles
];


const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">{title}</h2>
        <hr className="border-white/10" />
        <div className="text-muted-foreground leading-relaxed max-w-3xl">
            {children}
        </div>
    </div>
);

const SkillChip = ({ skill }: { skill: string }) => (
  <div className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-muted-foreground">
    {skill}
  </div>
);

const Contacts = () => {
  const copyLinkedIn = () => {
    navigator.clipboard.writeText(LINKEDIN_URL);
    toast({
      title: "Copied",
      description: "LinkedIn Profile URL copied to clipboard.",
      variant: "success",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-16 text-foreground">
      {/* Profile Hero Block */}
      <div className="text-center space-y-5 pt-8">
	        <img
	          src={AVATAR_URL}
	          alt="Andrey Sobchenyuk"
	          className="w-44 h-44 rounded-full mx-auto object-cover cursor-pointer border-2 border-green-500/50"
	          onError={(event) => {
	            event.currentTarget.src = FALLBACK_AVATAR_URL;
	          }}
	          onClick={copyLinkedIn}
	        />
        <div>
          <h1 className="text-5xl font-bold">Andrey Sobchenyuk</h1>
          <p className="text-xl font-semibold text-green-400 mt-2">Senior Full Stack Developer</p>
          <p className="text-md text-muted-foreground mt-1">{yearsOfExperience}+ Years Experience • Vue.js • React.js • Node.js • TypeScript</p>
        </div>
        <div className="flex justify-center">
            <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
                <p className="text-sm font-mono text-foreground truncate">{LINKEDIN_URL}</p>
                <Button size="sm" variant="outline" onClick={copyLinkedIn}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>

      <Section title="Professional Summary">
        <p>
          With {yearsOfExperience}+ years of comprehensive development experience and deep expertise in modern JavaScript frameworks, I bring a unique combination of technical depth and practical experience in building enterprise-grade applications. Eager to contribute to team success through hard work, attention to detail, and excellent organizational skills.
        </p>
      </Section>
      
      <Section title="Key Achievements & Expertise">
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="font-semibold text-green-400 mb-2">Technical Leadership</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Enterprise Architecture: Successfully architected and maintained complex enterprise applications</li>
                    <li>Performance Optimization: Code splitting, lazy loading, asset optimization, efficient state management</li>
                    <li>Modern Workflows: Automated testing, code quality tools, documentation-driven development</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-green-400 mb-2">Development Practices</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Full-Stack Integration: Seamless frontend-backend integration with strong backend knowledge</li>
                    <li>Real-time Systems: Long polling implementation, WebSocket adaptation, real-time data sync</li>
                    <li>Team Collaboration: Code reviews, technical mentoring, Git workflows, project management</li>
                </ul>
            </div>
        </div>
      </Section>

      <Section title="Core Skills">
        <div className="space-y-6">
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category}>
              <h3 className="text-md font-semibold text-green-400/80 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {skillList.map((skill) => (
                  <SkillChip key={skill} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Work History">
        <div className="space-y-8">
            {workHistory.map((job, index) => (
                <div key={index}>
                    <h3 className="font-semibold text-green-400">{job.role}</h3>
                    <p className="text-sm text-muted-foreground">{job.company} • {job.period}</p>
                    {job.stack && <p className="text-xs mt-2 font-mono">Stack: {job.stack}</p>}
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        {job.details.map((detail, i) => <li key={i}>{detail}</li>)}
                    </ul>
                </div>
            ))}
        </div>
      </Section>

        <Section title="Education & Certifications">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-green-400 mb-2">Education</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li>School.spalah (2015–2016): PHP, Yii2</li>
                        <li>GoIT (2016): Frontend, JavaScript, CSS, HTML</li>
                        <li>UITSchool (2016-2017): Java, JavaScript, PHP, Laravel</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-green-400 mb-2">Languages</h3>
                     <ul className="list-disc list-inside space-y-1">
                        <li>Russian — Native</li>
                        <li>Ukrainian — Native</li>
                        <li>English — Elementary (A2)</li>
                    </ul>
                </div>
            </div>
        </Section>

    </div>
  );
};

export default Contacts;

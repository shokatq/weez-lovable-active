
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  Brain, 
  Calendar, 
  Users, 
  Folder,
  GraduationCap,
  Briefcase,
  UserCheck,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.getAttribute('data-section') || '0');
            setVisibleSections(prev => [...new Set([...prev, sectionIndex])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleTryWeez = () => {
    navigate("/home");
  };

  const AnimatedSection = ({ children, index, className = "" }: { 
    children: React.ReactNode; 
    index: number; 
    className?: string;
  }) => (
    <section 
      data-section={index}
      className={`${className} transition-all duration-1000 ${
        visibleSections.includes(index) 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <AnimatedSection index={0} className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
            Introducing Weez AI
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-gray-400 font-light leading-relaxed">
            Your smart document assistant. Organize, access, and summarize anything instantly.
          </h2>
          
          <Button
            onClick={handleTryWeez}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-12 py-4 text-lg rounded-lg mt-12 group"
          >
            Try Weez
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </AnimatedSection>

      {/* Section 1: What is Weez AI? */}
      <AnimatedSection index={1} className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Meet Your AI-Powered Organizer
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Weez AI helps you manage your files, notes, tasks, and conversations — all in one place. 
            Whether it's a PDF, a task sheet, a note, or an image, Weez automatically organizes and 
            makes it easy to find.
          </p>
          <div className="flex justify-center items-center space-x-6 mt-12">
            <div className="p-4 bg-gray-900 rounded-lg animate-float">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <ArrowRight className="w-6 h-6 text-gray-600" />
            <div className="p-4 bg-gray-900 rounded-lg animate-float" style={{ animationDelay: '0.5s' }}>
              <Folder className="w-8 h-8 text-green-400" />
            </div>
            <ArrowRight className="w-6 h-6 text-gray-600" />
            <div className="p-4 bg-gray-900 rounded-lg animate-float" style={{ animationDelay: '1s' }}>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 2: Key Features */}
      <AnimatedSection index={2} className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Why Choose Weez?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-6">
                <Folder className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white">Easy Organization</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Automatically sort and group your documents by type, topic, or date.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-6">
                <Search className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white">AI Search</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Search documents using natural language, and Weez uses NER + vector AI to fetch the best match.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white">Smart Summaries</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Summarize long files, notes, or tasks in a click.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white">Task Manager</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Add tasks, link them with documents, and never miss a deadline.
              </p>
            </div>

            <div className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white">Group Sharing & Chat</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Collaborate via groups, share files, and chat inside Weez without switching apps.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 3: Built for Everyone */}
      <AnimatedSection index={3} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
            For Students, Professionals, and Teams
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Weez is designed to work across needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Students</h3>
              <p className="text-gray-400">Managing assignments and notes</p>
            </div>

            <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Professionals</h3>
              <p className="text-gray-400">Handling reports and documents</p>
            </div>

            <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Teams</h3>
              <p className="text-gray-400">Collaborating over tasks and sharing resources</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 4: How It Works */}
      <AnimatedSection index={4} className="py-24 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            How Weez Works
          </h2>
          
          <div className="space-y-12">
            {[
              { step: 1, title: "Allow storage access", description: "Grant Weez permission to access your files" },
              { step: 2, title: "Weez scans and tags files automatically", description: "Our AI analyzes and categorizes your documents" },
              { step: 3, title: "Use AI-powered search", description: "Find, summarize, and manage with natural language" },
              { step: 4, title: "Organize or share as needed", description: "Collaborate and share right from the app" }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Section 5: Testimonials */}
      <AnimatedSection index={5} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Loved by Early Testers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-6 italic">
                "Weez helped me find documents I forgot I had. It's like magic!"
              </p>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-gray-400">Student</span>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
              <p className="text-gray-300 mb-6 italic">
                "Managing team docs and tasks was never this easy."
              </p>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-green-400" />
                <span className="text-sm text-gray-400">Project Lead</span>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 md:col-span-2 lg:col-span-1">
              <p className="text-gray-300 mb-6 italic">
                "The AI search is incredibly accurate. Saves me hours every week."
              </p>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-gray-400">Researcher</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 6: Get Started */}
      <AnimatedSection index={6} className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Start Using Weez Today
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Try the smart way to manage your files and tasks.<br />
            <span className="text-white font-semibold">Simple. Fast. AI-powered.</span>
          </p>
          
          <Button
            onClick={handleTryWeez}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-12 py-4 text-lg rounded-lg mt-12 group"
          >
            Try Weez
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Intro;

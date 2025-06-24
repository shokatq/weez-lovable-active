
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
  CheckCircle,
  Sparkles
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

  const handleTryWeezy = () => {
    navigate("/home");
  };

  const AnimatedSection = ({ children, index, className = "" }: { 
    children: React.ReactNode; 
    index: number; 
    className?: string;
  }) => (
    <section 
      data-section={index}
      className={`${className} transition-all duration-700 ease-out ${
        visibleSections.includes(index) 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* Hero Section */}
      <AnimatedSection index={0} className="min-h-screen flex items-center justify-center px-6 gradient-hero">
        <div className="text-center space-y-8 max-w-4xl">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600 text-sm font-medium">Introducing Weezy AI</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight fade-in-stagger-1">
            Your Smart Document
            <br />
            <span className="text-blue-600">Assistant</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto fade-in-stagger-2">
            Organize, access, and summarize anything instantly. The intelligent way to manage 
            your files, notes, and tasks — all in one beautifully simple place.
          </p>
          
          <div className="fade-in-stagger-3">
            <Button
              onClick={handleTryWeezy}
              className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg mr-4"
            >
              Try Weezy
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="btn-secondary px-8 py-3 text-lg rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* What is Weezy AI Section */}
      <AnimatedSection index={1} className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Your AI-Powered Organizer
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Weezy AI helps you manage your files, notes, tasks, and conversations — all in one place. 
              Whether it's a PDF, a task sheet, a note, or an image, Weezy automatically organizes and 
              makes it easy to find.
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-8 mt-16">
            <div className="p-6 bg-gray-50 rounded-xl hover-lift">
              <FileText className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="text-sm text-gray-600 mt-2">Upload</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="p-6 bg-gray-50 rounded-xl hover-lift" style={{ animationDelay: '0.2s' }}>
              <Folder className="w-8 h-8 text-green-600 mx-auto" />
              <p className="text-sm text-gray-600 mt-2">Organize</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="p-6 bg-gray-50 rounded-xl hover-lift" style={{ animationDelay: '0.4s' }}>
              <Brain className="w-8 h-8 text-purple-600 mx-auto" />
              <p className="text-sm text-gray-600 mt-2">Analyze</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection index={2} className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Weezy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your workflow and boost productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Folder,
                title: "Easy Organization",
                description: "Automatically sort and group your documents by type, topic, or date.",
                color: "text-blue-600"
              },
              {
                icon: Search,
                title: "AI Search",
                description: "Search documents using natural language, powered by advanced AI vectors.",
                color: "text-green-600"
              },
              {
                icon: Brain,
                title: "Smart Summaries",
                description: "Summarize long files, notes, or tasks in a single click.",
                color: "text-purple-600"
              },
              {
                icon: Calendar,
                title: "Task Manager",
                description: "Add tasks, link them with documents, and never miss a deadline.",
                color: "text-orange-600"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share files and collaborate seamlessly without switching apps.",
                color: "text-red-600"
              },
              {
                icon: CheckCircle,
                title: "Smart Workflow",
                description: "Automate repetitive tasks and focus on what matters most.",
                color: "text-indigo-600"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-soft card-hover border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Built for Everyone */}
      <AnimatedSection index={3} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              For Students, Professionals, and Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Weezy adapts to your needs, whether you're managing coursework, 
              handling business documents, or collaborating with your team.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                description: "Perfect for managing assignments, research papers, and study notes.",
                color: "bg-blue-600"
              },
              {
                icon: Briefcase,
                title: "Professionals",
                description: "Streamline reports, presentations, and important documents.",
                color: "bg-green-600"
              },
              {
                icon: Users,
                title: "Teams",
                description: "Collaborate effectively on projects and share resources seamlessly.",
                color: "bg-purple-600"
              }
            ].map((user, index) => (
              <div key={index} className="text-center p-8 card-hover">
                <div className={`w-16 h-16 ${user.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium`}>
                  <user.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{user.title}</h3>
                <p className="text-gray-600">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection index={4} className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How Weezy Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple, intuitive process.
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              { 
                step: 1, 
                title: "Connect Your Storage", 
                description: "Link your Google Drive, Dropbox, or other cloud services securely." 
              },
              { 
                step: 2, 
                title: "AI Analysis", 
                description: "Our AI automatically scans and categorizes your documents intelligently." 
              },
              { 
                step: 3, 
                title: "Search & Organize", 
                description: "Find anything instantly with natural language search and smart organization." 
              },
              { 
                step: 4, 
                title: "Collaborate & Share", 
                description: "Work together seamlessly and share documents with your team." 
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-soft card-hover">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection index={5} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Loved by Early Users
            </h2>
            <p className="text-xl text-gray-600">
              See what people are saying about Weezy AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Weezy helped me find documents I forgot I had. It's like having a personal assistant!",
                role: "University Student"
              },
              {
                quote: "Managing team documents has never been this easy. Weezy saves us hours every week.",
                role: "Project Manager"
              },
              {
                quote: "The AI search is incredibly accurate. It understands exactly what I'm looking for.",
                role: "Research Analyst"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 card-hover">
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection index={6} className="py-24 px-6 gradient-soft">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Join thousands of users who have revolutionized their document management.
            <br />
            <span className="font-semibold text-gray-900">Simple. Smart. Powerful.</span>
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleTryWeezy}
              className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="btn-secondary px-8 py-3 text-lg rounded-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 Weezy AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Intro;

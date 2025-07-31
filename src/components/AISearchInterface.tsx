import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Brain, FileText, Lightbulb } from "lucide-react";
import { fastApiService } from "@/services/fastApiService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AISearchInterface = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [ragResponse, setRagResponse] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  const getUserId = () => user?.email || user?.id || 'anonymous_user';

  const handleSemanticSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await fastApiService.search({
        query_text: query,
        user_id: getUserId(),
        top_k: 10
      });
      
      if (result.success && result.data?.results) {
        setSearchResults(result.data.results);
        toast.success(`Found ${result.data.results.length} documents`);
      } else {
        setSearchResults([]);
        toast.error("No documents found");
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRAGQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await fastApiService.ask({
        action: 'rag_query',
        query_text: query,
        user_id: getUserId(),
        top_k: 10
      });
      
      if (result.success && result.data?.answer) {
        setRagResponse(result.data.answer);
        toast.success("Generated AI response");
      } else {
        setRagResponse("I don't have specific information about this topic in your current files.");
        toast.warning("No relevant information found");
      }
    } catch (error) {
      console.error('RAG query failed:', error);
      toast.error("AI query failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIAgent = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await fastApiService.askAgent({
        query: query,
        user_id: getUserId()
      });
      
      if (result.success && result.data?.response) {
        setRagResponse(result.data.response);
        toast.success("AI agent responded");
      } else {
        setRagResponse("I'm unable to process this request at the moment.");
        toast.warning("AI agent unavailable");
      }
    } catch (error) {
      console.error('AI agent failed:', error);
      toast.error("AI agent failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    if (query.length > 2) {
      try {
        const result = await fastApiService.getSearchSuggestions({
          partial_query: query,
          user_id: getUserId(),
          limit: 5
        });
        
        if (result.success && result.data?.suggestions) {
          setSuggestions(result.data.suggestions);
        }
      } catch (error) {
        console.error('Suggestions failed:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">AI-Powered Document Search</h1>
        <p className="text-muted-foreground">Search, analyze, and get insights from your documents using advanced AI</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Query
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your documents or search for specific content..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                getSuggestions();
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
              className="flex-1"
            />
            <Button onClick={handleSemanticSearch} disabled={loading}>
              Search
            </Button>
          </div>
          
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setQuery(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Semantic Search
          </TabsTrigger>
          <TabsTrigger value="rag" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            RAG Query
          </TabsTrigger>
          <TabsTrigger value="agent" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={handleSemanticSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search Documents
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="grid gap-4">
              {searchResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{result.title || result.name}</h3>
                      <Badge variant="secondary">Score: {result.score?.toFixed(2) || 'N/A'}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{result.content || result.summary}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">{result.file_type || result.type}</Badge>
                      <Badge variant="outline">{result.platform}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rag" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={handleRAGQuery} disabled={loading}>
              <Brain className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
          </div>
          
          {ragResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{ragResponse}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agent" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={handleAIAgent} disabled={loading}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Ask AI Agent
            </Button>
          </div>
          
          {ragResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Agent Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{ragResponse}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISearchInterface;
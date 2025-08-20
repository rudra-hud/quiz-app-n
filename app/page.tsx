"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SocialShare } from "@/components/social-share"
import {
  Menu,
  Moon,
  Sun,
  Copy,
  Download,
  Info,
  Clock,
  Shield,
  BookOpen,
  Brain,
  FileText,
  Users,
  Star,
  Zap,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Share2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "@/hooks/use-toast"
import {
  trackEvent,
  trackContentGeneration,
  trackContentDownload,
  trackThemeChange,
  trackHistoryView,
  trackMenuInteraction,
} from "@/components/analytics"

interface HistoryItem {
  prompt: string
  result: string
  time: string
}

export default function QuizSolverApp() {
  const [type, setType] = useState("quiz")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [count, setCount] = useState(5)
  const [output, setOutput] = useState("AI output will appear here...")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const savedHistory = localStorage.getItem("ai-history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    trackEvent("page_view", {
      event_category: "navigation",
      page_title: "QuizSolver App Home",
    })
  }, [])

  const saveToHistory = (prompt: string, result: string) => {
    const newItem: HistoryItem = {
      prompt,
      result,
      time: new Date().toLocaleString(),
    }
    const updatedHistory = [newItem, ...history].slice(0, 10)
    setHistory(updatedHistory)
    localStorage.setItem("ai-history", JSON.stringify(updatedHistory))
  }

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic before generating.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    trackEvent("content_generation_started", {
      event_category: "content_creation",
      content_type: type,
      topic: topic,
    })

    let prompt = ""
    if (type === "quiz") {
      prompt = `Generate ${count} multiple choice questions on "${topic}" with answers. Difficulty: ${difficulty}`
    } else if (type === "notes") {
      prompt = `Write detailed notes on "${topic}" in bullet points.`
    } else {
      prompt = `Create a student assignment on "${topic}" with instructions and 5+ questions.`
    }

    try {
      // Note: In a real implementation, you'd want to use a server-side API route
      // to keep your API key secure
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyC-89UCdA2WQCZc3R_-eQcK9rht1S8tjUg"
      const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      })

      const data = await response.json()
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No result generated"

      setOutput(result)
      saveToHistory(prompt, result)

      trackContentGeneration(type, topic, difficulty, count)

      toast({
        title: "Content Generated",
        description: "Your AI content has been generated successfully!",
      })
    } catch (error) {
      const errorMessage = `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      setOutput(errorMessage)
      trackEvent("content_generation_error", {
        event_category: "errors",
        error_message: errorMessage,
        content_type: type,
        topic: topic,
      })
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      trackEvent("content_copied", {
        event_category: "content_interaction",
        content_type: type,
      })
      toast({
        title: "Copied",
        description: "Text has been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadPDF = () => {
    // Simple text download as fallback
    const element = document.createElement("a")
    const file = new Blob([output], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "ai_output.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    trackContentDownload(type, "txt")

    toast({
      title: "Downloaded",
      description: "Content has been downloaded as a text file.",
    })
  }

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    trackThemeChange(newTheme)
  }

  const handleMenuClick = () => {
    setShowMenu(!showMenu)
    trackMenuInteraction("menu_toggle")
  }

  const handleHistoryClick = () => {
    trackHistoryView()
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "QuizSolver App",
            description: "AI-powered quiz, notes, and assignment generator for students and educators",
            url: "https://quiz-app-rouge-three-79.vercel.app",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "QuizSolver Team",
            },
            featureList: [
              "AI Quiz Generation",
              "Study Notes Creation",
              "Assignment Builder",
              "Multiple Difficulty Levels",
              "Dark Mode Support",
              "History Tracking",
              "Social Sharing",
            ],
          }),
        }}
      />

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 relative">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenuClick}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {showMenu && (
              <Card className="absolute top-12 left-0 z-50 w-48">
                <CardContent className="p-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => trackMenuInteraction("about_us")}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        About Us
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Us</DialogTitle>
                      </DialogHeader>
                      <p>
                        QuizSolver App is an AI-powered tool that helps students generate quizzes, notes, and
                        assignments instantly using Google's Gemini AI. Built with love by students, for students.
                      </p>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => trackMenuInteraction("privacy_policy")}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy Policy
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Privacy Policy</DialogTitle>
                      </DialogHeader>
                      <p>
                        QuizSolver does not collect or store any personal data; all activity runs securely and privately
                        in your browser.
                      </p>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleHistoryClick}>
                        <Clock className="h-4 w-4 mr-2" />
                        History
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Recent History</DialogTitle>
                      </DialogHeader>
                      {history.length === 0 ? (
                        <p>No history found.</p>
                      ) : (
                        <div className="space-y-4">
                          {history.map((item, index) => (
                            <div key={index} className="border-b pb-2">
                              <Badge variant="outline" className="mb-2">
                                {item.time}
                              </Badge>
                              <p className="font-medium">Prompt: {item.prompt}</p>
                              <p className="text-sm text-muted-foreground mt-1">{item.result.slice(0, 200)}...</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>

          <h1 className="text-xl font-bold">🧠 QuizSolver App</h1>

          <Button variant="secondary" size="sm" onClick={handleThemeChange}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? " Light" : " Dark"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">AI-Powered Educational Content Generator</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Transform your learning experience with our advanced AI technology. Generate custom quizzes, comprehensive
            study notes, and engaging assignments in seconds. Perfect for students, educators, and lifelong learners who
            want to enhance their educational journey with intelligent, personalized content creation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Smart Quiz Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Create customized quizzes with multiple difficulty levels. Our AI understands your topic and generates
                  relevant, challenging questions with accurate answers.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Comprehensive Study Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Generate detailed, well-structured study notes on any topic. Perfect for exam preparation, research,
                  or expanding your knowledge base.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Assignment Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Create engaging assignments with clear instructions and thought-provoking questions. Ideal for
                  educators and self-directed learners.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mb-8" />

        {/* Controls */}
        <section>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Generate AI Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-48">
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">📝 Quiz</SelectItem>
                      <SelectItem value="notes">📖 Notes</SelectItem>
                      <SelectItem value="assignment">📚 Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-2 min-w-64">
                  <label className="text-sm font-medium mb-2 block">Topic</label>
                  <Input
                    placeholder="Enter topic (e.g., Blockchain, History, Mathematics)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                {type === "quiz" && (
                  <>
                    <div className="min-w-32">
                      <label className="text-sm font-medium mb-2 block">Difficulty</label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-24">
                      <label className="text-sm font-medium mb-2 block">Questions</label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={count}
                        onChange={(e) => setCount(Number.parseInt(e.target.value) || 5)}
                      />
                    </div>
                  </>
                )}

                <Button onClick={generateContent} disabled={isLoading} className="min-w-32">
                  {isLoading ? "Generating..." : "🚀 Generate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Output */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Content</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadPDF}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Your Generated Content</DialogTitle>
                      </DialogHeader>
                      <SocialShare
                        title="Check out my AI-generated quiz!"
                        text={`I just created amazing educational content with QuizSolver App: ${topic ? `"${topic}"` : "AI-powered learning"}`}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="ml-4">Generating content...</p>
                </div>
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-96 font-mono text-sm"
                  placeholder="AI output will appear here..."
                />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose QuizSolver?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Perfect for Everyone
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Students preparing for exams and tests</li>
                <li>• Educators creating engaging classroom content</li>
                <li>• Professionals expanding their knowledge</li>
                <li>• Researchers organizing study materials</li>
                <li>• Homeschool parents designing curricula</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Instant AI-powered content generation</li>
                <li>• Multiple difficulty levels for quizzes</li>
                <li>• Comprehensive study notes creation</li>
                <li>• Assignment builder with instructions</li>
                <li>• Dark mode for comfortable studying</li>
                <li>• History tracking and content management</li>
                <li>• Social sharing of generated content</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Choose Content Type</h4>
              <p className="text-sm text-muted-foreground">
                Select whether you want to generate a quiz, study notes, or assignment based on your learning needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Enter Your Topic</h4>
              <p className="text-sm text-muted-foreground">
                Input any subject or topic you want to study. Our AI works with virtually any educational content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Instant Results</h4>
              <p className="text-sm text-muted-foreground">
                Receive high-quality, customized educational content in seconds. Copy, download, or save for later use.
              </p>
            </div>
          </div>
        </section>

        {/* Social Media Promotion Section */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Share QuizSolver with Friends</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Help others discover the power of AI-generated educational content. Share QuizSolver with your study
                  groups, classmates, and fellow educators.
                </p>
                <SocialShare
                  title="QuizSolver App - AI-Powered Quiz Generator"
                  text="Discover QuizSolver: Generate quizzes, study notes, and assignments instantly using AI! Perfect for students and educators."
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-muted mt-16 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">QuizSolver App</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Empowering education through AI-powered content generation. Create quizzes, notes, and assignments that
                enhance learning experiences for students and educators worldwide.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://twitter.com/QuizSolverApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://facebook.com/QuizSolverApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Like us on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://linkedin.com/company/quizsolver"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://instagram.com/QuizSolverApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://youtube.com/@QuizSolverApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to our YouTube channel"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Quiz Generator</li>
                <li>Study Notes Creator</li>
                <li>Assignment Builder</li>
                <li>Multiple Difficulty Levels</li>
                <li>Content History</li>
                <li>Social Sharing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Educational Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest updates on new features and educational tips.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Enter email" className="text-sm" />
                <Button size="sm" onClick={() => trackEvent("newsletter_signup", { event_category: "engagement" })}>
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QuizSolver App. Built with AI technology for educational excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

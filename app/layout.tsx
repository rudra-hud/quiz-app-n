import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from "@/components/analytics"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuizSolver App - AI-Powered Quiz, Notes & Assignment Generator",
  description:
    "Generate quizzes, study notes, and assignments instantly using AI. Perfect for students and educators. Create custom quizzes with multiple difficulty levels.",
  keywords: "quiz generator, AI quiz, study notes, assignment generator, education tool, student helper, AI learning",
  authors: [{ name: "QuizSolver Team" }],
  creator: "QuizSolver",
  publisher: "QuizSolver",
  robots: "index, follow",
  openGraph: {
    title: "QuizSolver App - AI-Powered Quiz Generator",
    description:
      "Generate quizzes, study notes, and assignments instantly using AI. Perfect for students and educators.",
    type: "website",
    locale: "en_US",
    url: "https://quiz-app-rouge-three-79.vercel.app",
    siteName: "QuizSolver App",
    images: [
      {
        url: "/placeholder.svg?key=kcb45",
        width: 1200,
        height: 630,
        alt: "QuizSolver App - AI-Powered Educational Content Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizSolver App - AI-Powered Quiz Generator",
    description: "Generate quizzes, study notes, and assignments instantly using AI.",
    site: "@QuizSolverApp",
    creator: "@QuizSolverApp",
    images: ["/placeholder.svg?key=5qebc"],
  },
  generator: "v0.app",
  other: {
    "fb:app_id": "your-facebook-app-id",
    "article:author": "QuizSolver Team",
    "article:publisher": "https://www.facebook.com/QuizSolverApp",
  },
  alternates: {
    canonical: "https://quiz-app-rouge-three-79.vercel.app",
    languages: {
      "en-US": "https://quiz-app-rouge-three-79.vercel.app",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://quiz-app-rouge-three-79.vercel.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <GoogleAnalytics />
      </head>
      <body>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}

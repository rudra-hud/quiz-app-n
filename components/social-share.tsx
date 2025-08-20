"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { trackContentShare } from "@/components/analytics"

interface SocialShareProps {
  title?: string
  text?: string
  url?: string
}

export function SocialShare({
  title = "QuizSolver App",
  text = "Check out this AI-powered quiz generator!",
  url,
}: SocialShareProps) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(shareUrl)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=AI,Education,QuizGenerator`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400")
    trackContentShare(platform, "app_share")
    toast({
      title: "Shared!",
      description: `Content shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    })
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      trackContentShare("copy_link", "app_share")
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("whatsapp")}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" onClick={copyLink} className="flex items-center gap-2 bg-transparent">
            <Link2 className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

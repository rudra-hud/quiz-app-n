"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
    dataLayer: any[]
  }
}

// Google Analytics tracking ID - replace with your actual GA4 measurement ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_TRACKING_ID || GA_TRACKING_ID === "G-XXXXXXXXXX") return

    const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`

    // Track page views
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  // Don't render script if no tracking ID is set
  if (!GA_TRACKING_ID || GA_TRACKING_ID === "G-XXXXXXXXXX") {
    return null
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
            });
          `,
        }}
      />
    </>
  )
}

// Analytics event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      event_category: "engagement",
      event_label: parameters?.label || "",
      value: parameters?.value || 0,
      ...parameters,
    })
  }
}

export const trackContentGeneration = (contentType: string, topic: string, difficulty?: string, count?: number) => {
  trackEvent("content_generated", {
    event_category: "content_creation",
    content_type: contentType,
    topic: topic,
    difficulty: difficulty || "N/A",
    question_count: count || 0,
    event_label: `${contentType}_${topic}`,
  })
}

export const trackContentShare = (platform: string, contentType: string) => {
  trackEvent("content_shared", {
    event_category: "social_sharing",
    platform: platform,
    content_type: contentType,
    event_label: `${platform}_${contentType}`,
  })
}

export const trackContentDownload = (contentType: string, format: string) => {
  trackEvent("content_downloaded", {
    event_category: "content_export",
    content_type: contentType,
    file_format: format,
    event_label: `${contentType}_${format}`,
  })
}

export const trackThemeChange = (theme: string) => {
  trackEvent("theme_changed", {
    event_category: "user_preference",
    theme_mode: theme,
    event_label: theme,
  })
}

export const trackHistoryView = () => {
  trackEvent("history_viewed", {
    event_category: "navigation",
    event_label: "history_modal",
  })
}

export const trackMenuInteraction = (action: string) => {
  trackEvent("menu_interaction", {
    event_category: "navigation",
    menu_action: action,
    event_label: action,
  })
}

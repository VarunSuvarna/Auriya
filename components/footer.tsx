import Link from "next/link"
import { Github, Shield, Lock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 mx-auto">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} AlgoKYC. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Lock className="h-4 w-4" />
            <span>Privacy</span>
          </Link>
          <Link
            href="/security"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

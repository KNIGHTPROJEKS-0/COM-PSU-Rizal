import { Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppFooter() {
  return (
    <footer className="w-full py-6 bg-background/80 backdrop-blur-md mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Collaboration Online Meet</p>
            <p className="text-xs text-muted-foreground mt-1">Organize your tasks based on urgency and importance</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

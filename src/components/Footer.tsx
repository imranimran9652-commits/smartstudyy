import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} SmartStudy. Plan. Focus. Thrive.
        </p>
        <p className="flex items-center gap-1.5 font-medium">
          Crafted with <Heart className="h-3.5 w-3.5 fill-pink text-pink animate-pulse" /> by{" "}
          <span className="font-bold bg-gradient-to-r from-primary via-pink to-lavender bg-clip-text text-transparent">
            K. Imran
          </span>
        </p>
      </div>
    </footer>
  );
}

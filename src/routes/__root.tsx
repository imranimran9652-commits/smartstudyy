import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { SideRails } from "@/components/SideRails";
import { Footer } from "@/components/Footer";
import { ThemeProvider, themeInitScript } from "@/lib/theme";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Smart Study Companion — Plan, Focus, Thrive" },
      { name: "description", content: "A colorful, aesthetic study companion to plan topics, track progress, focus with Pomodoro, and visualize your learning." },
      { property: "og:title", content: "Smart Study Companion — Plan, Focus, Thrive" },
      { property: "og:description", content: "A colorful, aesthetic study companion to plan topics, track progress, focus with Pomodoro, and visualize your learning." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Smart Study Companion — Plan, Focus, Thrive" },
      { name: "twitter:description", content: "A colorful, aesthetic study companion to plan topics, track progress, focus with Pomodoro, and visualize your learning." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/09162bce-3e07-41fd-8c23-37ece008f549/id-preview-7ba65051--bf28e34f-417d-4525-a7d7-7250315ed9aa.lovable.app-1777051759011.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/09162bce-3e07-41fd-8c23-37ece008f549/id-preview-7ba65051--bf28e34f-417d-4525-a7d7-7250315ed9aa.lovable.app-1777051759011.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <SideRails />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 animate-fade-in flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </div>
    </ThemeProvider>
  );
}

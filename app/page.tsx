import { links } from "@/data/links";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function Page() {
  const activeLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-xl flex flex-col gap-4">
        {activeLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardHeader className="flex-row items-center justify-between gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base text-zinc-900 dark:text-zinc-50">
                    {link.title}
                  </CardTitle>
                  {link.description && (
                    <CardDescription>{link.description}</CardDescription>
                  )}
                </div>
                <ExternalLink
                  size={16}
                  className="shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
                />
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </main>
  );
}

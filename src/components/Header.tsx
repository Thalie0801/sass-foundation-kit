import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoAeditus from "@/assets/logo-aeditus.jpg";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" }
];

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/20 bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoAeditus} alt="Aeditus" className="h-9 w-auto rounded-sm" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            <span className="bg-gradient-gold bg-clip-text text-transparent">Aeditus</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth?mode=signin">Connexion</Link>
          </Button>
          <Button asChild variant="premium" size="sm">
            <Link to="/auth?mode=signup&plan=Starter">Plan Starter</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

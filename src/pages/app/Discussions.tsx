const threads = [
  {
    title: "Brief vidéo HERO",
    author: "Amélie (Æditus)",
    excerpt: "Nous avons intégré les retours du board, prêt pour validation.",
    timestamp: "Il y a 3h",
  },
  {
    title: "Stratégie Reels Octobre",
    author: "Marc",
    excerpt: "Peut-on ajouter un accent ambassadeurs pour LinkedIn ?",
    timestamp: "Hier",
  },
];

const ClientDiscussions = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold">Discussions & support</h1>
        <p className="text-sm text-muted-foreground">
          Alfie centralise vos échanges, les décisions et ouvre un ticket si besoin côté admin.
        </p>
      </div>
      <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold">
        Nouvelle discussion
      </button>
    </header>

    <ul className="mt-6 space-y-3">
      {threads.map((thread) => (
        <li key={thread.title} className="rounded-xl border bg-background p-4">
          <header className="flex items-center justify-between">
            <p className="font-medium">{thread.title}</p>
            <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
          </header>
          <p className="mt-1 text-xs text-muted-foreground">{thread.author}</p>
          <p className="mt-2 text-sm text-foreground">{thread.excerpt}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default ClientDiscussions;

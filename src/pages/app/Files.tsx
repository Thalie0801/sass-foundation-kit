const assets = [
  { name: "Article - Stratégie SEO Q4", type: "Google Doc", size: "28 ko" },
  { name: "Visuels Carrousel IG", type: "Zip", size: "12 Mo" },
  { name: "Video HERO 4K", type: "MP4", size: "320 Mo" },
];

const ClientFiles = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold">Livrables</h1>
        <p className="text-sm text-muted-foreground">
          Retrouvez tous vos contenus générés, classés par campagne et prêts au téléchargement.
        </p>
      </div>
      <button className="rounded-xl border bg-background px-4 py-2 text-sm shadow-sm hover:bg-muted">
        Importer un fichier
      </button>
    </header>

    <ul className="mt-6 grid gap-4 md:grid-cols-3">
      {assets.map((asset) => (
        <li key={asset.name} className="rounded-xl border bg-background p-4">
          <p className="font-medium">{asset.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{asset.type} · {asset.size}</p>
          <button className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline">
            Télécharger
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default ClientFiles;

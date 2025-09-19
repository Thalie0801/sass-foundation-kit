const tasks = [
  { title: "Valider 5 accroches SEO", owner: "Client", due: "17 sept.", status: "À faire" },
  { title: "Uploader assets branding", owner: "Client", due: "18 sept.", status: "En cours" },
  { title: "Review vidéo HERO", owner: "Æditus", due: "19 sept.", status: "En attente" },
];

const ClientTasks = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold">Tâches collaboratives</h1>
        <p className="text-sm text-muted-foreground">
          Vos actions et celles de l'équipe Æditus apparaissent ici avec suivi temps réel.
        </p>
      </div>
      <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold">
        Créer une tâche
      </button>
    </header>

    <ul className="mt-6 space-y-3">
      {tasks.map((task) => (
        <li key={task.title} className="flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-muted-foreground">Responsable : {task.owner}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {task.status}
            </span>
            <span className="text-sm text-muted-foreground">Pour le {task.due}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ClientTasks;

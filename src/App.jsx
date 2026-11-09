import { useEffect, useMemo, useState } from "react";
import { sections, allArticles } from "./content.js";

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function flatText(a) {
  const parts = [a.title, a.summary, ...(a.tags || [])];
  a.blocks.forEach((b) => {
    if (b.x) parts.push(b.x);
    if (b.items) parts.push(...b.items);
    if (b.rows) parts.push(...b.rows.flat());
  });
  return norm(parts.join(" "));
}

function useHashId() {
  const read = () => window.location.hash.replace(/^#\/?/, "") || "inicio";
  const [id, setId] = useState(read);
  useEffect(() => {
    const on = () => setId(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return id;
}

function Code({ x, note }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(x);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {}
  };
  return (
    <figure className="code">
      <button onClick={copy} aria-label="Copiar comando">
        {ok ? "Copiado" : "Copiar"}
      </button>
      <pre>
        <code>{x}</code>
      </pre>
      {note && <figcaption>{note}</figcaption>}
    </figure>
  );
}

function Block({ b }) {
  switch (b.t) {
    case "h":
      return <h3>{b.x}</h3>;
    case "p":
      return <p>{b.x}</p>;
    case "ul":
      return (
        <ul>
          {b.items.map((i, k) => (
            <li key={k}>{i}</li>
          ))}
        </ul>
      );
    case "code":
      return <Code x={b.x} note={b.note} />;
    case "callout":
      return (
        <aside className={`callout ${b.kind}`}>
          <strong>{b.title}</strong>
          <span>{b.x}</span>
        </aside>
      );
    case "table":
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {b.head.map((h, k) => (
                  <th key={k}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, k) => (
                    <td key={k}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

function Home() {
  return (
    <>
      <h1>Wiki de Seguridad en Microsoft Azure</h1>
      <p className="lead">
        Guía práctica de aseguramiento y auditoría en la nube, construida a
        partir del laboratorio de Gestión de Seguridad de la Información (Caso B
        · Transportes Valle Azul). Cada medida se explica con su comando, su
        justificación, el control NIST que la respalda y su límite.
      </p>
      <div className="cards">
        {sections.map((s) => (
          <section key={s.group} className="card">
            <h2>{s.group}</h2>
            <ul>
              {s.articles.map((a) => (
                <li key={a.id}>
                  <a href={`#/${a.id}`}>{a.title}</a>
                  <small>{a.summary}</small>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function Article({ a, idx }) {
  const prev = allArticles[idx - 1];
  const next = allArticles[idx + 1];
  return (
    <article>
      <p className="crumb">{a.group}</p>
      <h1>{a.title}</h1>
      <p className="lead">{a.summary}</p>
      {a.blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
      <nav className="pager">
        {prev ? <a href={`#/${prev.id}`}>← {prev.title}</a> : <span />}
        {next ? <a href={`#/${next.id}`}>{next.title} →</a> : <span />}
      </nav>
    </article>
  );
}

export default function App() {
  const id = useHashId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const index = useMemo(
    () => allArticles.map((a) => ({ a, text: flatText(a) })),
    []
  );
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (!n) return null;
    return index.filter((e) => n.split(/\s+/).every((w) => e.text.includes(w))).map((e) => e.a);
  }, [q, index]);

  const idx = allArticles.findIndex((a) => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [id]);

  return (
    <div className="layout">
      <header className="topbar">
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Menú">
          ☰
        </button>
        <a href="#/inicio" className="brand">
          Azure Seguridad · Wiki
        </a>
      </header>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <input
          type="search"
          placeholder="Buscar (ej. rbac, mfa, R1)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {results ? (
          <div className="group">
            <h4>{results.length} resultado(s)</h4>
            {results.map((a) => (
              <a key={a.id} href={`#/${a.id}`} className={a.id === id ? "active" : ""}>
                {a.title}
              </a>
            ))}
          </div>
        ) : (
          sections.map((s) => (
            <div className="group" key={s.group}>
              <h4>{s.group}</h4>
              {s.articles.map((a) => (
                <a key={a.id} href={`#/${a.id}`} className={a.id === id ? "active" : ""}>
                  {a.title}
                </a>
              ))}
            </div>
          ))
        )}
      </aside>
      <main>
        {idx >= 0 ? <Article a={allArticles[idx]} idx={idx} /> : <Home />}
        <footer>
          Material de estudio basado en el laboratorio TI3062 · INACAP Valparaíso.
          Los datos del caso son ficticios.
        </footer>
      </main>
    </div>
  );
}

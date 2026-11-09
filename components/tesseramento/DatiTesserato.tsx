"use client";

import { Blocco, Campo } from "@/components/modulo/Campi";
import type { Anagrafica, Contatti, DatiTesseramento, Errori, Genitore } from "@/lib/tesseramento/dati";

/** Oggi in AAAA-MM-GG, ora locale: limite massimo del campo data. */
const oggiISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Il codice fiscale si scrive comunque: maiuscolo e senza spazi mentre si digita. */
const cf = (v: string) => v.replace(/\s/g, "").toUpperCase().slice(0, 16);

export function DatiTesserato({
  dati,
  errori,
  onChange,
}: {
  dati: DatiTesseramento;
  errori: Errori;
  onChange: (d: DatiTesseramento) => void;
}) {
  const minore = dati.perChi === "minore";
  const t = dati.tesserato;
  // Per un minore il browser non deve proporre i dati salvati del genitore.
  const auto = (v: string) => (minore ? "off" : v);

  const set = (campo: keyof Anagrafica, v: string) => onChange({ ...dati, tesserato: { ...t, [campo]: v } });
  const setContatti = (campo: keyof Contatti, v: string) => onChange({ ...dati, contatti: { ...dati.contatti, [campo]: v } });
  const setGenitore = (campo: keyof Genitore, v: string) => onChange({ ...dati, genitore: { ...dati.genitore, [campo]: v } });

  const contatti = (prefisso: "contatti" | "g", valori: Contatti, onSet: (c: keyof Contatti, v: string) => void) => (
    <>
      <Campo
        chiave={`${prefisso}.email`}
        etichetta="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={valori.email}
        errore={errori[`${prefisso}.email`]}
        aiuto="Qui arrivano la conferma e le istruzioni per la quota."
        onChange={(e) => onSet("email", e.target.value)}
      />
      <Campo
        chiave={`${prefisso}.telefono`}
        etichetta="Cellulare"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        value={valori.telefono}
        errore={errori[`${prefisso}.telefono`]}
        onChange={(e) => onSet("telefono", e.target.value)}
      />
    </>
  );

  return (
    <div className="space-y-8">
      <Blocco titolo={minore ? "Chi si tessera" : "I tuoi dati"}>
        <Campo chiave="t.nome" etichetta="Nome" autoComplete={auto("given-name")} value={t.nome} errore={errori["t.nome"]} onChange={(e) => set("nome", e.target.value)} />
        <Campo
          chiave="t.cognome"
          etichetta="Cognome"
          autoComplete={auto("family-name")}
          value={t.cognome}
          errore={errori["t.cognome"]}
          onChange={(e) => set("cognome", e.target.value)}
        />
        <Campo
          chiave="t.nascita"
          etichetta="Data di nascita"
          type="date"
          min="1915-01-01"
          max={oggiISO()}
          autoComplete={auto("bday")}
          value={t.nascita}
          errore={errori["t.nascita"]}
          onChange={(e) => set("nascita", e.target.value)}
        />
        <Campo
          chiave="t.luogoNascita"
          etichetta="Comune di nascita"
          aiuto="Se sei nato/a all'estero, scrivi lo Stato."
          autoComplete="off"
          value={t.luogoNascita}
          errore={errori["t.luogoNascita"]}
          onChange={(e) => set("luogoNascita", e.target.value)}
        />
        <Campo
          chiave="t.codiceFiscale"
          etichetta="Codice fiscale"
          className="sm:col-span-2"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={16}
          value={t.codiceFiscale}
          errore={errori["t.codiceFiscale"]}
          onChange={(e) => set("codiceFiscale", cf(e.target.value))}
        />
        <Campo
          chiave="t.indirizzo"
          etichetta="Indirizzo di residenza"
          aiuto="Via e numero civico."
          className="sm:col-span-2"
          autoComplete={auto("street-address")}
          value={t.indirizzo}
          errore={errori["t.indirizzo"]}
          onChange={(e) => set("indirizzo", e.target.value)}
        />
        <Campo
          chiave="t.cap"
          etichetta="CAP"
          inputMode="numeric"
          maxLength={5}
          autoComplete={auto("postal-code")}
          value={t.cap}
          errore={errori["t.cap"]}
          onChange={(e) => set("cap", e.target.value.replace(/\D/g, ""))}
        />
        <Campo
          chiave="t.comune"
          etichetta="Comune di residenza"
          autoComplete={auto("address-level2")}
          value={t.comune}
          errore={errori["t.comune"]}
          onChange={(e) => set("comune", e.target.value)}
        />
        {!minore && contatti("contatti", dati.contatti, setContatti)}
      </Blocco>

      {minore && (
        <Blocco titolo="Genitore o tutore">
          <p className="text-sm text-ink/75 sm:col-span-2">
            Il tesserato è minorenne: servono i dati di chi firma per lui o per lei.
          </p>
          <Campo
            chiave="g.nome"
            etichetta="Nome"
            autoComplete="given-name"
            value={dati.genitore.nome}
            errore={errori["g.nome"]}
            onChange={(e) => setGenitore("nome", e.target.value)}
          />
          <Campo
            chiave="g.cognome"
            etichetta="Cognome"
            autoComplete="family-name"
            value={dati.genitore.cognome}
            errore={errori["g.cognome"]}
            onChange={(e) => setGenitore("cognome", e.target.value)}
          />
          <Campo
            chiave="g.codiceFiscale"
            etichetta="Codice fiscale"
            className="sm:col-span-2"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={16}
            value={dati.genitore.codiceFiscale}
            errore={errori["g.codiceFiscale"]}
            onChange={(e) => setGenitore("codiceFiscale", cf(e.target.value))}
          />
          {contatti("g", dati.genitore, setGenitore)}
        </Blocco>
      )}
    </div>
  );
}

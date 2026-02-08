# YForm Accordion Relation für REDAXO

Erweitert das bestehende YForm-Feld `be_manager_relation` (Typ 5 = Inline) um eine **Accordion-Darstellung**. Inline-Relationen werden als kompakte, auf- und zuklappbare Panels dargestellt – ideal bei vielen Einträgen.

![Accordion Relation](https://raw.githubusercontent.com/FriendsOfREDAXO/yform_accordion_relation/main/screenshot.png)

## Features

- **Accordion-Panels** – jeder Inline-Datensatz als auf-/zuklappbares Bootstrap-Panel
- **Live-Titel** – der Panel-Header zeigt den aktuellen Feldwert und aktualisiert sich bei Eingabe
- **Mehrere Titelfelder** – kombiniert mehrere Felder zum Titel, z. B. `"vorname,nachname"` → „Max Mustermann"
- **Live-Suche** – filtert Einträge in Echtzeit nach Titel und Formularinhalten
- **Drag & Drop** – Einträge per Sortier-Handle verschieben (wenn Prio-Feld konfiguriert)
- **Alle auf-/zuklappen** – Buttons in der Toolbar oder Doppelklick auf das Label
- **Löschen mit Bestätigung** – nativer Browser-Dialog vor dem Entfernen eines Eintrags
- **Status-Farben** – farbige Markierung am linken Rand je nach Status-Feld (rot/grün/grau)
- **Leer-Zustand** – zeigt einen Platzhalter wenn keine Einträge vorhanden sind
- **„Neu"-Markierung** – neue Einträge werden mit grünem Rahmen und Badge hervorgehoben
- **Fehler-Auto-Open** – Panels mit Validierungsfehlern werden automatisch geöffnet
- **Dark-Mode-kompatibel** – funktioniert mit dem REDAXO Dark Theme
- **100 % kompatibel** – kein eigenes Value, kein neuer Feldtyp, alle YForm-Core-Funktionen bleiben erhalten

## Voraussetzungen

- REDAXO ≥ 5.19.1
- PHP ≥ 8.2
- YForm ≥ 5.0

## Installation

1. Im REDAXO-Installer nach **yform_accordion_relation** suchen und installieren
2. Oder manuell nach `redaxo/src/addons/yform_accordion_relation` kopieren und im Backend aktivieren

## Verwendung

Am bestehenden `be_manager_relation`-Feld (Typ **5 – Inline**) im Feld **Attribute** einfach aktivieren:

```json
{"accordion": true}
```

Alle bestehenden Inline-Relationen werden damit als Accordion angezeigt. Ohne das Attribut bleibt das Original-Verhalten erhalten.

### Optionen

Alle Optionen werden als JSON im Attribute-Feld konfiguriert:

```json
{
    "accordion": true,
    "accordion_title_field": "vorname,nachname",
    "accordion_open": "new",
    "accordion_new_label": "Neuer Termin",
    "accordion_status_field": "status"
}
```

| Attribut | Typ | Standard | Beschreibung |
|---|---|---|---|
| `accordion` | bool | `false` | **Pflicht.** Aktiviert die Accordion-Darstellung |
| `accordion_title_field` | string | *auto* | Feldname(n) der Zieltabelle für den Panel-Titel. Komma-getrennt für mehrere Felder, z. B. `"vorname,nachname"`. Standard: erstes Feld aus der Anzeige-Feld-Konfiguration |
| `accordion_open` | string | `"new"` | Welche Panels initial geöffnet sind: `new` = nur neue, `first` = erstes, `all` = alle, `none` = keines |
| `accordion_new_label` | string | *Neuer Eintrag* | Label für neue, noch leere Einträge |
| `accordion_status_field` | string | – | Feldname eines Status-/Select-Felds. Der Wert steuert die farbige Markierung am linken Panelrand |

### Beispiele

**Minimal – nur Accordion aktivieren:**
```json
{"accordion": true}
```

**Titel aus einem bestimmten Feld:**
```json
{"accordion": true, "accordion_title_field": "variantenbezeichnung"}
```

**Titel aus Vor- und Nachname kombiniert:**
```json
{"accordion": true, "accordion_title_field": "vorname,nachname"}
```

**Alle Panels offen, eigenes Label für neue Einträge:**
```json
{"accordion": true, "accordion_open": "all", "accordion_new_label": "Neue Variante"}
```

**Status-Farben am linken Rand:**
```json
{"accordion": true, "accordion_status_field": "status"}
```

| Wert | Farbe | Bedeutung |
|------|-------|-----------|
| `0` | Rot | Inaktiv / Offline |
| `1` | Grün | Aktiv / Online |
| `2` | Grau | Entwurf / Archiviert |

**Alle Optionen kombiniert:**
```json
{
    "accordion": true,
    "accordion_title_field": "vorname,nachname",
    "accordion_open": "none",
    "accordion_new_label": "Neuer Kontakt",
    "accordion_status_field": "status"
}
```

## Funktionsweise

Das AddOn liefert **keine eigene Value-Klasse** und keinen neuen Feldtyp. Es überschreibt die drei Inline-Relation-Templates per `rex_yform::addTemplatePath()`:

- `value.be_manager_inline_relation.tpl.php` – Wrapper
- `value.be_manager_inline_relation_form.tpl.php` – Einzelnes Formular-Panel
- `value.be_manager_inline_relation-view.tpl.php` – Ansichtsmodus

Jedes Template prüft, ob `"accordion": true` in den Attributen gesetzt ist. Falls ja, wird die Accordion-Darstellung gerendert. Falls nein, wird exakt das Original-Verhalten ausgegeben.

### Warum kein eigenes Value?

Der YForm-Core prüft an zahlreichen Stellen (REST-API, YORM, History, Manager-Formular, Tabellen-Relationen) per String-Vergleich auf den Typ-Namen `be_manager_relation`. Ein abgeleiteter Typ mit eigenem Namen würde dort nicht erkannt. Der Template-Override-Ansatz umgeht dieses Problem vollständig.

### Kompatibilität mit yform_usability

Das AddOn ist vollständig kompatibel mit **yform_usability**. Beide nutzen unterschiedliche Selektoren, Bibliotheken und DOM-Ziele:

| | yform_usability | yform_accordion_relation |
|---|---|---|
| Bibliothek | SortableJS | jQuery UI Sortable |
| Selektor | `.sortable-list` (Tabellenzeilen) | `[data-yform-accordion-sortable]` (Panels) |
| Ziel | Tabellen-Listenansicht | Inline-Relation-Formulare |

## Deinstallation

Nach dem Deinstallieren verhalten sich alle Inline-Relationen wieder wie gewohnt. Die JSON-Attribute in den Feldern können bestehen bleiben – ohne das AddOn werden sie einfach ignoriert.

## Lizenz

MIT License – siehe [LICENSE.md](LICENSE.md)

## Autor

**Friends Of REDAXO**

* https://www.redaxo.org
* https://github.com/FriendsOfREDAXO

## Credits

**Project Lead**

[Thomas Skerbis](https://github.com/skerbis)

Basiert auf den YForm Inline-Relation-Templates von [Yakamara](https://github.com/yakamara/redaxo_yform)

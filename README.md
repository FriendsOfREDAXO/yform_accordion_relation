# YForm Accordion Relation für REDAXO

Erweitert das bestehende YForm-Feld `be_manager_relation` (Typ 5 = Inline) um eine **Accordion-Darstellung**. Inline-Relationen werden als kompakte, auf- und zuklappbare Panels dargestellt – ideal bei vielen Einträgen.

## Features

- **Accordion-Panels** – jeder Inline-Datensatz als auf-/zuklappbares Bootstrap-Panel
- **Live-Titel** – der Panel-Header zeigt den aktuellen Feldwert und aktualisiert sich bei Eingabe
- **Mehrere Titelfelder** – kombiniert mehrere Felder zum Titel, z. B. `"vorname,nachname"` → „Max Mustermann"
- **Live-Suche** – filtert Einträge in Echtzeit nach Titel und Formularinhalten
- **Drag & Drop** – Einträge per Sortier-Handle verschieben (wenn Prio-Feld konfiguriert)
- **Alle auf-/zuklappen** – Buttons in der Toolbar oder Doppelklick auf das Label
- **Status-Toggle** – Status direkt im Panel-Header per Klick umschalten
- **Löschen mit Bestätigung** – nativer Browser-Dialog vor dem Entfernen eines Eintrags
- **Status-Farben** – farbige Markierung am linken Rand je nach Status-Feld
- **Leer-Zustand** – zeigt einen Platzhalter wenn keine Einträge vorhanden sind
- **„Neu"-Markierung** – neue Einträge werden mit farbigem Rahmen und Badge hervorgehoben
- **Fehler-Auto-Open** – Panels mit Validierungsfehlern werden automatisch geöffnet
- **Validierung in Collapsed Panels** – `required`-Felder in geschlossenen Panels werden erkannt, das Panel wird geöffnet und ein Fehler-Badge im Header angezeigt
- **Fehler-Badge** – Panel-Header zeigt roten Badge „Bitte prüfen Sie die Eingaben" bei invaliden Feldern, verschwindet automatisch nach Korrektur
- **Vollständige i18n** – alle Texte über Lang-Dateien, keine hardcodierten Strings
- **Dark-Mode-kompatibel** – funktioniert mit dem REDAXO Dark Theme (explizit + auto)
- **100 % kompatibel** – kein eigenes Value, kein neuer Feldtyp, alle YForm-Core-Funktionen bleiben erhalten

## Voraussetzungen

- REDAXO ≥ 5.19.1
- PHP ≥ 8.2
- YForm ≥ 5.0

## Installation

1. Im REDAXO-Installer nach **yform_accordion_relation** suchen und installieren
2. Oder manuell nach `redaxo/src/addons/yform_accordion_relation` kopieren und im Backend aktivieren

## Konfiguration

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
| `0` | Rot (Ring) | Inaktiv / Offline |
| `1` | Grün (gefüllt) | Aktiv / Online |
| `2` | Grau (gefüllt) | Entwurf / Archiviert |

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

## Deinstallation

Nach dem Deinstallieren verhalten sich alle Inline-Relationen wieder wie gewohnt. Die JSON-Attribute in den Feldern können bestehen bleiben – ohne das AddOn werden sie einfach ignoriert.

---

## Für Entwickler

### Funktionsweise

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

### Extension Points

Das AddOn stellt zwei Extension Points zur Verfügung, um eigene Buttons/Inhalte in die Toolbar oder den Panel-Header einzufügen. Über `$ep->getSubject()` werden alle Buttons als Array (links → rechts) übermittelt, sodass neue Buttons gezielt positioniert werden können.

#### `YFORM_ACCORDION_RELATION_TOOLBAR_BUTTONS`

Fügt Buttons in die Toolbar (neben „Alle aufklappen") ein.

```php
rex_extension::register('YFORM_ACCORDION_RELATION_TOOLBAR_BUTTONS', function (rex_extension_point $ep) {
    $buttons = $ep->getSubject();
    // $field = $ep->getParam('field');           // Das YForm Value Objekt
    // $fieldkey = $ep->getParam('fieldkey');
    // $relationKey = $ep->getParam('relationKey');

    // Button links einfügen (am Anfang)
    array_unshift(
        $buttons,
        '<button type="button" class="btn btn-default" title="Info"><i class="rex-icon rex-icon-info"></i></button>',
    );
    return $buttons;
});
```

#### `YFORM_ACCORDION_RELATION_ITEM_BUTTONS`

Fügt Buttons in den Header eines jeden Accordion-Items ein (neben Löschen/Verschieben).

```php
rex_extension::register('YFORM_ACCORDION_RELATION_ITEM_BUTTONS', function (rex_extension_point $ep) {
    $buttons = $ep->getSubject();
    // $field = $ep->getParam('field');                 // Das YForm Value Objekt
    // $counterfieldkey = $ep->getParam('counterfieldkey');
    // $form = $ep->getParam('form');
    // $accordionIsNew = $ep->getParam('accordionIsNew');

    // Button rechts anfügen (am Ende)
    $buttons[] = '<button type="button" class="btn btn-default" title="Info"><i class="rex-icon rex-icon-info"></i></button>';
    return $buttons;
});
```

### Fehlerbehandlung

Das AddOn behandelt Formular-Validierungsfehler auf zwei Ebenen:

**Browser-Validierung (`required`-Felder):**
Wenn ein `required`-Feld in einem geschlossenen Accordion-Panel liegt, kann der Browser es normalerweise nicht fokussieren und zeigt *„An invalid form control is not focusable"*. Das AddOn fängt das `invalid`-Event ab (mit `useCapture`, da es nicht bubbelt), öffnet das Panel rechtzeitig und zeigt einen roten Fehler-Badge im Panel-Header.

**Server-Validierung (YForm `has-error`):**
Nach dem Absenden prüft das AddOn auf `.has-error`, `.form-error`, `.text-warning` und `.alert-danger` innerhalb der Panels. Betroffene Panels werden automatisch geöffnet und mit dem Fehler-Badge markiert.

Der Fehler-State (roter Rand, roter Header, Badge) wird automatisch zurückgesetzt, sobald alle Pflichtfelder im Panel korrekt ausgefüllt sind.

### Farbschema

Die Status-Farben orientieren sich am REDAXO BE-Farbschema:

| Status | CSS-Farbe | BE-Variable |
|--------|-----------|-------------|
| Offline (0) | `#d9534f` | `$color-offline` |
| Online (1) | `#12b55e` | `$color-online` |
| Entwurf (2) | `#324050` | `$color-a-dark` |
| Neu-Badge | `#5bb585` | `$color-d` |

---

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

# Changelog

## [1.3.0] - 2026-02-15
- Feature: Validierung in collapsed Panels – `required`-Felder in geschlossenen Panels werden erkannt, Panel wird geöffnet und Fehler-Badge angezeigt
- Feature: Fehler-Badge im Panel-Header bei invaliden Feldern (roter Badge mit „Bitte prüfen Sie die Eingaben"), verschwindet automatisch nach Korrektur
- Feature: Server-Validierung (`has-error`, `form-error`) zeigt ebenfalls Fehler-Badge im Panel-Header
- Feature: Dark Mode Support für Error-State (explizit + auto)
- Fix: `invalid`-Event mit `useCapture` statt `submit`-Handler – Browser-Validierung blockiert `submit`, `invalid` feuert rechtzeitig
- Fix: Panel-Öffnung bei Validierung via CSS-Klassen + `height`-Reset + Reflow (korrektes Bootstrap-Layout)
- Fix: JS-Redundanzen bereinigt (#12) – 7 setTimeout-Retries zu forEach-Loops konsolidiert
- Fix: Leerer DUPLICATE-Block und unbenutzte Variable entfernt
- Fix: Hardcodierte Status-Labels (`Offline`, `Online`, `Entwurf`) entfernt – dynamisch aus Select-Options
- Fix: Hardcodierten `Status:`-Prefix und Toggle-Tooltip durch i18n ersetzt
- Fix: Doppelklick-Selektor korrigiert (Copilot-Review)
- Update: Vollständige i18n – alle Texte über Lang-Dateien, keine hardcodierten Strings
- Update: Neue Lang-Keys: `status_toggle`, `validation_error`

## [1.2.0] - 2026-02-10
- Feature: Toolbar actions are now grouped in a `btn-group` button group
- Feature: Added Extension Point `YFORM_ACCORDION_RELATION_TOOLBAR_BUTTONS` for custom toolbar actions
- Feature: Added Extension Point `YFORM_ACCORDION_RELATION_ITEM_BUTTONS` for custom item actions
- Update: Improved title field auto-detection logic:
  - Skips non-input types (HTML, PHP, Upload, etc.)
  - Prioritizes valid input fields
  - Falls back to `id` if no other suitable field is found (always available)
- Update: Improved icons for Expand All (`fa-server`) and Collapse All (`fa-bars`)

## [1.1.0] - Initial Release
- Initial release with Accordion features for be_manager_relation (Inline)
- Live Title Update
- Live Search
- Status colors
- Drag & Drop sorting support

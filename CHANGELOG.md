# Changelog

## [1.3.0] - 2026-02-10
- Feature: Added "Duplicate" button to accordion items via `fa-copy` icon (copies all visible inputs, resets IDs)

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

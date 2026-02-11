<?php

/**
 * Template-Override: value.be_manager_inline_relation.tpl.php.
 *
 * Wenn in den Attributen "accordion": true gesetzt ist, wird die
 * Inline-Relation als Accordion dargestellt. Sonst: Original-Verhalten.
 *
 * Aktivierung am be_manager_relation-Feld:
 *   Attributes: {"accordion": true, "accordion_title_field": "name", "accordion_open": "new"}
 *
 * @var rex_yform_value_be_manager_relation $this
 * @psalm-scope-this rex_yform_value_be_manager_relation
 */

$fieldkey ??= 1;
$relationKey ??= 1;
$prototypeForm ??= '';
$forms ??= [];
$prioFieldName ??= '';

// -------------------------------------------------------------------
// Attributes parsen und Accordion-Modus erkennen
// -------------------------------------------------------------------
$attributes = [];
$attrString = $this->getElement('attributes');
if ('' !== $attrString && null !== $attrString) {
    $decoded = json_decode($attrString, true);
    if (is_array($decoded)) {
        $attributes = $decoded;
    }
}

$isAccordion = isset($attributes['accordion']) && $attributes['accordion'];

// -------------------------------------------------------------------
// Kein Accordion? → Original-Verhalten 1:1
// -------------------------------------------------------------------
if (!$isAccordion) {
    $class_group = trim('form-group ' . $this->getHTMLClass());

    $notice = [];
    if ('' != $this->getElement('notice')) {
        $notice[] = rex_i18n::translate($this->getElement('notice'), false);
    }
    if (isset($this->params['warning_messages'][$this->getId()]) && !$this->params['hide_field_warning_messages']) {
        $notice[] = '<span class="text-warning">' . rex_i18n::translate($this->params['warning_messages'][$this->getId()], false) . '</span>';
    }
    if (count($notice) > 0) {
        $notice = '<p class="help-block small">' . implode('<br />', $notice) . '</p>';
    } else {
        $notice = '';
    }

    $prototypeForm = $this->parse('value.be_manager_inline_relation_form.tpl.php', ['counterfieldkey' => $fieldkey . '-' . rex_escape($relationKey), 'form' => $prototypeForm, 'prioFieldName' => $prioFieldName]);

    $sortable = 'data-yform-be-relation-sortable';
    if ('' == $prioFieldName) {
        $sortable = '';
    }

    $fieldkey = 'y' . sha1($fieldkey . '-' . rex_escape($relationKey));

    echo '
    <div class="' . $class_group . '" id="' . $fieldkey . '" data-yform-be-relation-form="' . rex_escape($prototypeForm) . '" data-yform-be-relation-key="' . rex_escape($relationKey) . '" data-yform-be-relation-index="' . count($forms) . '">
        <label class="control-label" for="' . $this->getFieldId() . '">' . $this->getLabel() . ' </label>
        <div data-yform-be-relation-item="' . $fieldkey . '" ' . $sortable . ' class="yform-be-relation-wrapper">';

    $counter = 1;
    foreach ($forms as $form) {
        echo $this->parse('value.be_manager_inline_relation_form.tpl.php', ['counterfieldkey' => $fieldkey . '-' . $counter, 'form' => $form, 'prioFieldName' => $prioFieldName]);
        ++$counter;
    }

    echo '
        </div>
        <div class="btn-group btn-group-xs">
            <button type="button" class="btn btn-default addme" title="add" data-yform-be-relation-add="' . $fieldkey . '-' . $counter . '"><i class="rex-icon rex-icon-add-module"></i><span class="rex-hidden">+</span></button>
        </div>
        ' . $notice . '
    </div>';

    return;
}

// ===================================================================
// ACCORDION-MODUS
// ===================================================================

$class_group = trim('form-group ' . $this->getHTMLClass());

$notice = [];
if ('' != $this->getElement('notice')) {
    $notice[] = rex_i18n::translate($this->getElement('notice'), false);
}
if (isset($this->params['warning_messages'][$this->getId()]) && !$this->params['hide_field_warning_messages']) {
    $notice[] = '<span class="text-warning">' . rex_i18n::translate($this->params['warning_messages'][$this->getId()], false) . '</span>';
}
if (count($notice) > 0) {
    $notice = '<p class="help-block small">' . implode('<br />', $notice) . '</p>';
} else {
    $notice = '';
}

// Accordion-Konfiguration aus Attributes
$titleField = $attributes['accordion_title_field'] ?? '';
$accordionOpen = $attributes['accordion_open'] ?? 'new';
$newLabel = $attributes['accordion_new_label'] ?? rex_i18n::msg('yform_accordion_relation_new_entry');
$statusField = $attributes['accordion_status_field'] ?? '';

// Titelfeld auto-erkennen wenn nicht explizit gesetzt
if ('' === $titleField) {
    // Versuche, ein geeignetes Feld automatisch zu ermitteln
    $targetTable = $this->getElement('table');
    $targetTableObj = rex_yform_manager_table::get($targetTable);

    if ($targetTableObj) {
        // Liste von Typen, die sich nicht als Titel eignen (keine echten Eingabefelder oder reine UI)
        $invalidTypes = ['html', 'php', 'index', 'upload', 'action', 'validate'];

        // 1. Zuerst in der Relation-Definition schauen (target_field)
        $targetFieldAttr = $this->getElement('field');
        if ('' !== $targetFieldAttr && null !== $targetFieldAttr) {
            $parts = explode(',', $targetFieldAttr);
            foreach ($parts as $part) {
                $fName = trim($part);
                if ('' === $fName) {
                    continue;
                }
                if ('id' === $fName) {
                    $titleField = 'id';
                    break;
                }
                $f = $targetTableObj->getValueField($fName);
                if ($f && !in_array($f->getTypeName(), $invalidTypes, true)) {
                    $titleField = $fName;
                    break;
                }
            }
        }

        // 2. Fallback: Erstes sinnvolles Text/Input-Feld aus der Tabelle nehmen
        if ('' === $titleField) {
            foreach ($targetTableObj->getValueFields() as $f) {
                if (!in_array($f->getTypeName(), $invalidTypes, true)) {
                    $titleField = $f->getName();
                    break;
                }
            }
        }
    }

    // 3. Letzter Fallback: ID (immer vorhanden)
    if ('' === $titleField) {
        $titleField = 'id';
    }
}

// Prototype-Form als Accordion-Item rendern
$prototypeForm = $this->parse(
    'value.be_manager_inline_relation_form.tpl.php',
    [
        'counterfieldkey' => $fieldkey . '-' . rex_escape($relationKey),
        'form' => $prototypeForm,
        'prioFieldName' => $prioFieldName,
        'accordion' => true,
        'accordionTitle' => $newLabel,
        'accordionIsNew' => true,
        'accordionIsOpen' => true,
        'accordionTitleField' => $titleField,
    ],
);

$sortable = 'data-yform-accordion-sortable';
if ('' === $prioFieldName) {
    $sortable = '';
}

$fieldkey = 'y' . sha1($fieldkey . '-' . rex_escape($relationKey));

$toolbarButton = [
    '<button type="button" class="btn btn-default" data-yform-accordion-expand-all="' . $fieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_expand_all')) . '"><i class="rex-icon fa-server"></i></button>',
    '<button type="button" class="btn btn-default" data-yform-accordion-collapse-all="' . $fieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_collapse_all')) . '"><i class="rex-icon fa-bars"></i></button>',
];

$toolbarButton = rex_extension::registerPoint(
    new rex_extension_point(
        'YFORM_ACCORDION_RELATION_TOOLBAR_BUTTONS',
        $toolbarButton,
        [
            'field' => $this,
            'fieldkey' => $fieldkey,
            'relationKey' => $relationKey,
            'attributes' => $attributes,
        ],
    ),
);

echo '
    <div class="' . $class_group . ' yform-accordion-relation"
         id="' . $fieldkey . '"
         data-yform-accordion-form="' . rex_escape($prototypeForm) . '"
         data-yform-accordion-key="' . rex_escape($relationKey) . '"
         data-yform-accordion-index="' . count($forms) . '"
         data-yform-accordion-new-label="' . rex_escape($newLabel) . '"
         data-yform-accordion-title-field="' . rex_escape($titleField) . '"
         data-yform-accordion-status-field="' . rex_escape($statusField) . '">
        <label class="control-label" for="' . $this->getFieldId() . '">' . $this->getLabel() . '</label>
        <div>
            <div class="yform-accordion-toolbar">
                <div class="yform-accordion-search">
                    <div class="input-group input-group-sm">
                        <span class="input-group-addon"><i class="rex-icon fa-search"></i></span>
                        <input type="text" class="form-control" data-yform-accordion-search="' . $fieldkey . '" placeholder="' . rex_escape(rex_i18n::msg('yform_accordion_relation_search')) . '" autocomplete="off" />
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-default" data-yform-accordion-search-clear="' . $fieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_search_clear')) . '" style="display:none"><i class="rex-icon fa-times"></i></button>
                        </span>
                    </div>
                </div>
                <div class="yform-accordion-toolbar-actions btn-group btn-group-xs">
                    ' . implode('', $toolbarButton) . '
                </div>
            </div>
            <div data-yform-accordion-items="' . $fieldkey . '" ' . $sortable . ' class="yform-accordion-wrapper panel-group">';

$counter = 1;
foreach ($forms as $form) {
    // Soll dieses Panel offen sein?
    $isOpen = false;
    if ('all' === $accordionOpen) {
        $isOpen = true;
    } elseif ('first' === $accordionOpen && 1 === $counter) {
        $isOpen = true;
    }
    // 'none' und 'new' → bestehende geschlossen

    echo $this->parse(
        'value.be_manager_inline_relation_form.tpl.php',
        [
            'counterfieldkey' => $fieldkey . '-' . $counter,
            'form' => $form,
            'prioFieldName' => $prioFieldName,
            'accordion' => true,
            'accordionTitle' => '#' . $counter,
            'accordionIsNew' => false,
            'accordionIsOpen' => $isOpen,
            'accordionTitleField' => $titleField,
        ],
    );
    ++$counter;
}

echo '
            </div>
            <div class="yform-accordion-add-wrapper">
                <button type="button" class="btn btn-default yform-accordion-add-btn" data-yform-accordion-add="' . $fieldkey . '-' . $counter . '"><i class="rex-icon rex-icon-add-module"></i> ' . rex_escape(rex_i18n::msg('yform_accordion_relation_add')) . '</button>
                <span data-yform-accordion-count class="yform-accordion-counter"><small>' . count($forms) . ' ' . rex_i18n::msg('yform_accordion_relation_count_label') . '</small></span>
            </div>
        </div>
        ' . $notice . '
    </div>';

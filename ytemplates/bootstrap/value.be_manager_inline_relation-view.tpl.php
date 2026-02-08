<?php

/**
 * Template-Override: value.be_manager_inline_relation-view.tpl.php
 *
 * View-Modus: Wenn Accordion aktiv → Panels (readonly). Sonst: Original.
 *
 * @var rex_yform_value_be_manager_relation $this
 * @psalm-scope-this rex_yform_value_be_manager_relation
 */

$fieldkey ??= '';
$forms ??= [];
$relationKey ??= '';

// Attributes parsen
$attributes = [];
$attrString = $this->getElement('attributes');
if ('' !== $attrString && null !== $attrString) {
    $decoded = json_decode($attrString, true);
    if (is_array($decoded)) {
        $attributes = $decoded;
    }
}

$isAccordion = isset($attributes['accordion']) && $attributes['accordion'];

$class_group = trim('form-group ' . $this->getHTMLClass());
$fieldkey = 'y' . sha1($fieldkey . '-' . rex_escape($relationKey));

// -------------------------------------------------------------------
// Kein Accordion? → Original-Verhalten 1:1
// -------------------------------------------------------------------
if (!$isAccordion) {
    $id = sprintf('%u', crc32($this->params['form_name'])) . random_int(0, 10000) . $this->getId();

    echo '
    <div class="' . $class_group . '" id="' . $fieldkey . '" data-yform-be-relation-key="' . rex_escape($relationKey) . '" data-yform-be-relation-index="' . count($forms) . '">
        <label class="control-label" for="' . $this->getFieldId() . '">' . $this->getLabelStyle($this->getLabel()) . ' </label>
        <div data-yform-be-relation-item="' . $fieldkey . '" class="yform-be-relation-wrapper">';

    $counter = 1;
    foreach ($forms as $form) {
        $counterfieldkey = $fieldkey . '-' . $counter;
        echo '<div class="row" id="' . $counterfieldkey . '" data-yform-be-relation-item="' . $counterfieldkey . '">
                <div class="yform-be-relation-inline-form">' . $form . '</div>
            </div>';
        ++$counter;
    }

    echo '
        </div>
    </div>';

    return;
}

// ===================================================================
// ACCORDION VIEW-MODUS
// ===================================================================

$titleField = $attributes['accordion_title_field'] ?? '';

echo '
    <div class="' . $class_group . ' yform-accordion-relation yform-accordion-relation-view"
         id="' . $fieldkey . '"
         data-yform-accordion-title-field="' . rex_escape($titleField) . '">
        <label class="control-label" for="' . $this->getFieldId() . '">' . $this->getLabelStyle($this->getLabel()) . '</label>
        <div class="yform-accordion-wrapper panel-group">';

$counter = 1;
foreach ($forms as $form) {
    $counterfieldkey = $fieldkey . '-' . $counter;
    $collapseId = 'collapse-' . $counterfieldkey;

    echo '<div class="panel panel-default yform-accordion-item" id="' . $counterfieldkey . '">
        <div class="panel-heading">
            <h4 class="yform-accordion-header">
                <a class="yform-accordion-toggle collapsed" role="button" data-toggle="collapse" href="#' . $collapseId . '">
                    <span class="yform-accordion-caret"><i class="rex-icon fa-caret-right"></i></span>
                    <span class="yform-accordion-title-text">#' . $counter . '</span>
                </a>
            </h4>
        </div>
        <div id="' . $collapseId . '" class="panel-collapse collapse">
            <div class="yform-accordion-body">' . $form . '</div>
        </div>
    </div>';
    ++$counter;
}

echo '
        </div>
    </div>';

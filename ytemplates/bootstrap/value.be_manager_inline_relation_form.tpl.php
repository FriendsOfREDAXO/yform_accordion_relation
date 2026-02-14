<?php

/**
 * Template-Override: value.be_manager_inline_relation_form.tpl.php.
 *
 * Rendert ein einzelnes Inline-Formular.
 * Wenn $accordion === true → Bootstrap Panel (Accordion-Item).
 * Sonst → Original-Verhalten (Row mit Buttons).
 *
 * @var rex_yform_value_be_manager_relation $this
 * @psalm-scope-this rex_yform_value_be_manager_relation
 */

$prioFieldName ??= '';
$counterfieldkey ??= '';
$form ??= '';

// Accordion-Parameter (optional, vom Wrapper-Template übergeben)
$accordion ??= false;
$accordionTitle ??= '';
$accordionIsNew ??= false;
$accordionIsOpen ??= false;
$accordionTitleField ??= '';

// -------------------------------------------------------------------
// Kein Accordion? → Original-Verhalten 1:1
// -------------------------------------------------------------------
if (!$accordion) {
    $sortable = false;
    $sortButtons = '';
    $sorthandle = '';

    if ('' != $prioFieldName) {
        $sorthandle = '<span class="sorthandle"></span>';
        $sortButtons = '
            <div class="btn-group btn-group-xs">
             <button type="button" class="btn btn-move" data-yform-be-relation-moveup="' . $counterfieldkey . '" title="move up"><i class="rex-icon rex-icon-up"></i><span class="rex-hidden">⌃</span></button>
             <button type="button" class="btn btn-move" data-yform-be-relation-movedown="' . $counterfieldkey . '" title="move down"><i class="rex-icon rex-icon-down"></i><span class="rex-hidden">⌄</span></button>
            </div>';
    }

    echo '<div class="row" id="' . $counterfieldkey . '" data-yform-be-relation-item="' . $counterfieldkey . '">
        ' . $sorthandle . '
        <span class="removeadded">
            <div class="btn-group btn-group-xs">
             <button type="button" class="btn btn-default addme" title="add" data-yform-be-relation-add="' . $counterfieldkey . '" data-yform-be-relation-add-position="' . $counterfieldkey . '"><i class="rex-icon rex-icon-add-module"></i><span class="rex-hidden">+</span></button>
             <button type="button" class="btn btn-delete removeme" title="delete" data-yform-be-relation-delete="' . $counterfieldkey . '"><i class="rex-icon rex-icon-delete"></i><span class="rex-hidden">-<span</button>
            </div>
            ' . $sortButtons . '
        </span>
        <div class="yform-be-relation-inline-form">' . $form . '</div>
    </div>';

    return;
}

// ===================================================================
// ACCORDION-MODUS: Bootstrap Panel
// ===================================================================

$collapseId = 'collapse-' . $counterfieldkey;
$collapsedClass = $accordionIsOpen ? '' : 'collapsed';
$inClass = $accordionIsOpen ? ' in' : '';
$newClass = $accordionIsNew ? ' yform-accordion-item-new' : '';

/**
 * Toolbar für das Item zusammenstellen.
 */
// Status-Toggle
$toolbarButton = [
    '<button type="button" class="btn btn-xs yform-accordion-status-toggle" data-yform-accordion-status-toggle="' . $counterfieldkey . '" data-status-val="" title="Status umschalten" style="display:none"><span class="yform-status-dot"></span></button>',
];

// Sort-Elemente
$sorthandle = '';
if ('' !== $prioFieldName) {
    $sorthandle = '<span class="yform-accordion-sorthandle"><i class="rex-icon fa-bars"></i></span>';
    $toolbarButton[] = '<button type="button" class="btn btn-xs btn-default" data-yform-accordion-moveup="' . $counterfieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_move_up')) . '"><i class="rex-icon rex-icon-up"></i></button>';
    $toolbarButton[] = '<button type="button" class="btn btn-xs btn-default" data-yform-accordion-movedown="' . $counterfieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_move_down')) . '"><i class="rex-icon rex-icon-down"></i></button>';
}

// add und delete
$toolbarButton[] = '<button type="button" class="btn btn-xs btn-default" data-yform-accordion-add="' . $counterfieldkey . '" data-yform-accordion-add-position="' . $counterfieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_add')) . '"><i class="rex-icon rex-icon-add-module"></i></button>';
$toolbarButton[] = '<button type="button" class="btn btn-xs btn-danger" data-yform-accordion-delete="' . $counterfieldkey . '" title="' . rex_escape(rex_i18n::msg('yform_accordion_relation_delete')) . '"><i class="rex-icon rex-icon-delete"></i></button>';

// Custom
$toolbarButton = rex_extension::registerPoint(
    new rex_extension_point(
        'YFORM_ACCORDION_RELATION_ITEM_BUTTONS',
        $toolbarButton,
        [
            'field' => $this,
            'counterfieldkey' => $counterfieldkey,
            'form' => $form,
            'accordionIsNew' => $accordionIsNew,
        ],
    ),
);

$newBadge = $accordionIsNew ? '<span class="badge badge-success">' . rex_i18n::msg('yform_accordion_relation_new_entry_badge') . '</span>' : '';

echo '<div class="panel panel-default yform-accordion-item' . $newClass . '" id="' . $counterfieldkey . '"
          data-yform-accordion-title-field="' . rex_escape($accordionTitleField) . '">
    <div class="panel-heading">
        <h4 class="yform-accordion-header">
            ' . $sorthandle . '
            <a class="yform-accordion-toggle ' . $collapsedClass . '" role="button" data-toggle="collapse" href="#' . $collapseId . '">
                <span class="yform-accordion-caret"><i class="rex-icon fa-caret-right"></i></span>
                <span class="yform-accordion-title-text">' . rex_escape($accordionTitle) . '</span>' . $newBadge . '
            </a>
            <span class="yform-accordion-actions">
                ' . implode('', $toolbarButton) . '
            </span>
        </h4>
    </div>
    <div id="' . $collapseId . '" class="panel-collapse collapse' . $inClass . '">
        <div class="yform-accordion-body">' . $form . '</div>
    </div>
</div>';

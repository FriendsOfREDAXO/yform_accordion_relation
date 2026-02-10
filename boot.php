<?php

/** @var rex_addon $this */

if (rex_addon::get('yform')->isAvailable()) {
    // Eigene Templates registrieren (wird vor den Standard-Templates gesucht)
    rex_yform::addTemplatePath($this->getPath('ytemplates'));

    // Assets nur im Backend laden
    if (rex::isBackend() && rex::getUser()) {
        rex_view::addCssFile($this->getAssetsUrl('accordion_relation.css'));
        rex_view::addJsFile($this->getAssetsUrl('accordion_relation.js'));

        // JS-Übersetzungen bereitstellen
        rex_view::setJsProperty('yform_accordion_relation_copy_suffix', rex_i18n::msg('yform_accordion_relation_copy_suffix'));
    }
}

/**
 * YForm Accordion Relation - JavaScript
 *
 * Handles accordion behavior for inline 1-n relations:
 * - Collapse/expand panels
 * - Add new items (auto-expand)
 * - Delete items
 * - Sort (move up/down + drag & drop)
 * - Live title update from form field input
 * - Validation error auto-expand
 */
$(document).on('rex:ready', function (event, container) {

    // =========================================================================
    // LIVE TITLE UPDATE
    // =========================================================================

    container.find('.yform-accordion-item').each(function () {
        initTitleWatcher($(this));
    });

    // rex:ready von Subformularen abfangen – Titel erneut auslesen
    container.find('.yform-accordion-relation').on('rex:ready', function (e, subContainer) {
        if (subContainer) {
            subContainer.closest('.yform-accordion-item').each(function () {
                initTitleWatcher($(this));
            });
        }
    });

    // Fallback: Subform-Inputs sind oft erst nach kurzem Delay befüllt
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initTitleWatcher($(this));
        });
    }, 100);
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initTitleWatcher($(this));
        });
    }, 500);

    function initTitleWatcher($item) {
        var titleFieldName = $item.attr('data-yform-accordion-title-field');
        if (!titleFieldName) {
            var $wrapper = $item.closest('[data-yform-accordion-title-field]');
            titleFieldName = $wrapper.attr('data-yform-accordion-title-field');
        }
        if (!titleFieldName) return;

        // Mehrere Titelfelder unterstützen (Komma-separiert)
        var titleFields = titleFieldName.split(',');
        var titleInputs = [];

        for (var i = 0; i < titleFields.length; i++) {
            var fname = $.trim(titleFields[i]);
            if (!fname) continue;
            var $inp = findTitleInput($item, fname);
            if ($inp && $inp.length) {
                titleInputs.push($inp);
            }
        }

        if (titleInputs.length === 0) return;

        function buildTitle() {
            var parts = [];
            for (var j = 0; j < titleInputs.length; j++) {
                var $el = titleInputs[j];
                var val = $el.val();
                if ($el.is('select')) {
                    val = $el.find('option:selected').text();
                }
                val = $.trim(val || '');
                if (val !== '') {
                    parts.push(val);
                }
            }
            return parts.join(', ');
        }

        // Events binden (nur einmal)
        for (var k = 0; k < titleInputs.length; k++) {
            if (!titleInputs[k].data('accordion-title-bound')) {
                titleInputs[k].data('accordion-title-bound', true);
                titleInputs[k].on('input change', function () {
                    var title = buildTitle();
                    if (title !== '') {
                        $item.find('.yform-accordion-title-text').first().text(title);
                    }
                });
            }
        }

        // Initialen Titel setzen
        var initialTitle = buildTitle();
        if (initialTitle !== '') {
            $item.find('.yform-accordion-title-text').first().text(initialTitle);
        }
    }

    // =========================================================================
    // STATUS-FARBE (linker Rahmen)
    // =========================================================================

    function initStatusColor($item) {
        var $wrapper = $item.closest('.yform-accordion-relation');
        var statusField = $wrapper.attr('data-yform-accordion-status-field');
        if (!statusField) return;

        var $statusInput = findTitleInput($item, statusField);
        if (!$statusInput || !$statusInput.length) {
            return;
        }

        function applyStatusColor() {
            var val;
            if ($statusInput.is('select')) {
                val = $statusInput.val();
            } else if ($statusInput.is('input[type="checkbox"]')) {
                val = $statusInput.is(':checked') ? '1' : '0';
            } else if ($statusInput.is('input[type="radio"]')) {
                var radioName = $statusInput.attr('name');
                val = $item.find('input[name="' + radioName + '"]:checked').val() || '';
            } else {
                val = $statusInput.val();
            }
            val = $.trim(val || '');
            // Alle Status-Klassen entfernen
            $item.removeClass(function (index, className) {
                return (className.match(/\byform-accordion-status-\S+/g) || []).join(' ');
            });
            if (val !== '') {
                $item.addClass('yform-accordion-status-' + val);
            }
        }

        applyStatusColor();

        if (!$statusInput.data('accordion-status-bound')) {
            $statusInput.data('accordion-status-bound', true);
            $statusInput.on('input change', applyStatusColor);
        }
    }

    container.find('.yform-accordion-item').each(function () {
        initStatusColor($(this));
    });

    // Status per Retry prüfen (Subform-Inputs sind oft erst nach Delay verfügbar)
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initStatusColor($(this));
        });
    }, 100);
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initStatusColor($(this));
        });
    }, 500);
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initStatusColor($(this));
        });
    }, 1000);

    function findTitleInput($container, fieldName) {
        var selectors = 'input, select, textarea';
        var $all = $container.find(selectors);
        var $match = null;

        // 1. Exakter Match: name endet auf [fieldName] – bevorzuge sichtbare Inputs vor hidden
        var candidates = [];
        $all.each(function () {
            var name = $(this).attr('name') || '';
            if (name.match(new RegExp('\\[' + fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\]$'))) {
                candidates.push($(this));
            }
        });
        if (candidates.length > 0) {
            // Bevorzuge checkbox/radio/select/text vor hidden
            for (var c = 0; c < candidates.length; c++) {
                if (candidates[c].attr('type') !== 'hidden') {
                    return candidates[c];
                }
            }
            return candidates[0]; // Nur hidden vorhanden → nimm es
        }

        // 2. name enthält [fieldName] – bevorzuge sichtbare Inputs
        var candidates2 = [];
        $all.each(function () {
            var name = $(this).attr('name') || '';
            if (name.indexOf('[' + fieldName + ']') !== -1) {
                candidates2.push($(this));
            }
        });
        if (candidates2.length > 0) {
            for (var c2 = 0; c2 < candidates2.length; c2++) {
                if (candidates2[c2].attr('type') !== 'hidden') {
                    return candidates2[c2];
                }
            }
            return candidates2[0];
        }

        // 3. Fallback: id enthält den Feldnamen
        $all.each(function () {
            var id = $(this).attr('id') || '';
            if (id.indexOf(fieldName) !== -1) {
                $match = $(this);
                return false;
            }
        });
        if ($match) return $match;

        // 4. Wrapper-Div: YForm rendert Felder in Containern mit id="...-fieldName"
        // z.B. <div id="yform-data_edit-rex_table_2_0-status"> enthält den Input
        $container.find('[id$="-' + fieldName + '"]').each(function () {
            var $inner = $(this).find('input, select, textarea');
            if ($inner.length) {
                // Bevorzuge sichtbare vor hidden
                var $visible = $inner.filter(':not([type="hidden"])');
                $match = $visible.length ? $visible.first() : $inner.first();
                return false;
            }
        });
        if ($match) return $match;

        // 5. Letzter Fallback: Label-Text matchen
        $container.find('label').each(function () {
            var labelText = $.trim($(this).text()).toLowerCase();
            if (labelText.indexOf(fieldName.toLowerCase()) !== -1) {
                var forId = $(this).attr('for');
                if (forId) {
                    var $target = $container.find('#' + forId);
                    if ($target.length) {
                        $match = $target;
                        return false;
                    }
                }
                // Label ohne for: Input innerhalb des Labels suchen
                var $innerInput = $(this).find('input, select, textarea').filter(':not([type="hidden"])');
                if ($innerInput.length) {
                    $match = $innerInput.first();
                    return false;
                }
            }
        });

        return $match;
    }

    // =========================================================================
    // STATUS TOGGLE (Button im Header zum schnellen Umschalten)
    // =========================================================================

    function initStatusToggle($item) {
        var $wrapper = $item.closest('.yform-accordion-relation');
        var statusField = $wrapper.attr('data-yform-accordion-status-field');
        if (!statusField) return;

        var $toggleBtn = $item.find('[data-yform-accordion-status-toggle]').first();
        if (!$toggleBtn.length) return;

        var $statusInput = findTitleInput($item, statusField);
        if (!$statusInput || !$statusInput.length) return;

        // Button sichtbar machen
        $toggleBtn.show();

        // Mögliche Werte ermitteln
        var possibleValues = ['0', '1'];
        var valueLabels = {'0': 'Offline', '1': 'Online', '2': 'Entwurf'};
        if ($statusInput.is('select')) {
            possibleValues = [];
            $statusInput.find('option').each(function () {
                var v = $(this).val();
                possibleValues.push(v);
                valueLabels[v] = $.trim($(this).text()) || v;
            });
        }

        function getCurrentVal() {
            if ($statusInput.is('input[type="checkbox"]')) {
                return $statusInput.is(':checked') ? '1' : '0';
            }
            return $.trim($statusInput.val() || '0');
        }

        function syncToggleBtn() {
            var val = getCurrentVal();
            $toggleBtn.attr('data-status-val', val);
            var label = valueLabels[val] || ('Status: ' + val);
            $toggleBtn.attr('title', label + ' – Klicken zum Umschalten');
        }

        syncToggleBtn();

        // Klick: nächsten Wert setzen
        if (!$toggleBtn.data('accordion-toggle-bound')) {
            $toggleBtn.data('accordion-toggle-bound', true);
            $toggleBtn.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var current = getCurrentVal();
                var nextIndex = (possibleValues.indexOf(current) + 1) % possibleValues.length;
                var nextVal = possibleValues[nextIndex];

                if ($statusInput.is('input[type="checkbox"]')) {
                    $statusInput.prop('checked', nextVal === '1');
                } else {
                    $statusInput.val(nextVal);
                }
                $statusInput.trigger('change');
                syncToggleBtn();
            });
        }

        // Sync wenn Status sich anderweitig ändert
        if (!$statusInput.data('accordion-toggle-sync')) {
            $statusInput.data('accordion-toggle-sync', true);
            $statusInput.on('change', function () {
                syncToggleBtn();
            });
        }
    }

    container.find('.yform-accordion-item').each(function () {
        initStatusToggle($(this));
    });

    // Retry für verzögert geladene Subforms
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initStatusToggle($(this));
        });
    }, 200);
    setTimeout(function () {
        container.find('.yform-accordion-item').each(function () {
            initStatusToggle($(this));
        });
    }, 600);

    // =========================================================================
    // DELETE (nutzt REDAXO data-confirm für Bestätigung)
    // =========================================================================

    // data-confirm wird von REDAXO core auf document-level behandelt.
    // Bei "Abbrechen" → stopImmediatePropagation, unser Handler wird nie aufgerufen.
    // Bei "OK" → Event läuft weiter, unser Handler entfernt das Panel.
    container.on('click', '[data-yform-accordion-delete]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var targetId = $btn.attr('data-yform-accordion-delete');
        var $panel = $('#' + targetId);
        var $wrapper = $panel.closest('[data-yform-accordion-items]');
        var title = $.trim($panel.find('.yform-accordion-title-text').first().text()) || 'Eintrag';

        if (!confirm('"' + title + '" wirklich l\u00f6schen?')) {
            return;
        }

        $panel.slideUp(200, function () {
            $panel.remove();
            updateCounter($wrapper);
        });
    });

    // =========================================================================
    // MOVE UP / DOWN
    // =========================================================================

    container.find('[data-yform-accordion-moveup]').each(function () {
        $(this).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $item = $(this).closest('.yform-accordion-item');
            var $prev = $item.prev('.yform-accordion-item');
            if ($prev.length) {
                $prev.before($item);
            }
        });
    });

    container.find('[data-yform-accordion-movedown]').each(function () {
        $(this).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $item = $(this).closest('.yform-accordion-item');
            var $next = $item.next('.yform-accordion-item');
            if ($next.length) {
                $next.after($item);
            }
        });
    });

    // =========================================================================
    // SORTABLE (Drag & Drop)
    // =========================================================================

    container.find('[data-yform-accordion-sortable]').each(function () {
        if ($.fn.sortable) {
            $(this).sortable({
                handle: '.yform-accordion-sorthandle',
                items: '> .yform-accordion-item',
                axis: 'y',
                opacity: 0.7,
                placeholder: 'yform-accordion-sortable-placeholder',
                tolerance: 'pointer'
            });
        }
    });

    // =========================================================================
    // ADD NEW ITEM
    // =========================================================================

    container.find('[data-yform-accordion-add]').each(function () {
        $(this).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $btn = $(this);
            var $wrapper = $btn.closest('[data-yform-accordion-form]');

            // Falls der Button innerhalb eines Items ist (insert-after)
            if (!$wrapper.length) {
                $wrapper = $btn.closest('.yform-accordion-relation');
            }

            var id = $wrapper.attr('id');
            var relationKey = $wrapper.attr('data-yform-accordion-key');
            var prototypeForm = $wrapper.attr('data-yform-accordion-form');
            var index = parseInt($wrapper.attr('data-yform-accordion-index'), 10);
            var newLabel = $wrapper.attr('data-yform-accordion-new-label') || 'Neuer Eintrag';

            ++index;
            $wrapper.attr('data-yform-accordion-index', index);

            // Relation-Key durch Index ersetzen
            var rep = new RegExp(escapeRegExp(relationKey), 'g');
            prototypeForm = prototypeForm.replace(rep, index);

            var $newItem = $(prototypeForm);

            // Titel aktualisieren
            $newItem.find('.yform-accordion-title-text').first().text(newLabel + ' #' + index);

            // Panel aufklappen
            $newItem.find('.panel-collapse').addClass('in');
            $newItem.find('.yform-accordion-toggle').removeClass('collapsed');

            // Einfügeposition bestimmen
            var insertPosition = $btn.attr('data-yform-accordion-add-position');
            if (insertPosition) {
                // Nach dem angegebenen Element einfügen
                var $target = $('#' + insertPosition);
                if ($target.length) {
                    $target.after($newItem);
                }
            } else {
                // Am Ende der Liste einfügen
                var $items = $wrapper.find('[data-yform-accordion-items]');
                if ($items.length) {
                    $items.append($newItem);
                }
            }

            // Events initialisieren für das neue Element
            $newItem.trigger('rex:ready', [$newItem]);

            // Title-Watcher für neues Element
            initTitleWatcher($newItem.find('.yform-accordion-item').addBack('.yform-accordion-item'));

            // Counter + Empty State aktualisieren
            var $itemsWrapper = $wrapper.find('[data-yform-accordion-items]');
            updateCounter($itemsWrapper);

            // Status-Farbe initialisieren
            initStatusColor($newItem.find('.yform-accordion-item').addBack('.yform-accordion-item'));

            // Status-Toggle initialisieren
            initStatusToggle($newItem.find('.yform-accordion-item').addBack('.yform-accordion-item'));

            // Zum neuen Element scrollen
            if ($newItem.length) {
                $('html, body').animate({
                    scrollTop: $newItem.offset().top - 100
                }, 300);
            }
        });
    });


    // =========================================================================
    // DUPLICATE: Eintrag duplizieren
    // =========================================================================

    // =========================================================================
    // VALIDATION ERROR: Panels mit Fehlern auto-öffnen
    // =========================================================================

    container.find('.yform-accordion-item').each(function () {
        var $item = $(this);
        var $body = $item.find('.yform-accordion-body');

        // Prüfen ob im Panel Fehler-Markierungen vorhanden sind
        if ($body.find('.has-error, .form-error, .text-warning, .alert-danger').length > 0) {
            var $collapse = $item.find('.panel-collapse');
            $collapse.addClass('in');
            $item.find('.yform-accordion-toggle').removeClass('collapsed');
            $item.addClass('yform-accordion-item-error');
        }
    });

    // =========================================================================
    // HELPER
    // =========================================================================

    function updateCounter($wrapper) {
        var $relation = $wrapper.closest('.yform-accordion-relation');
        var count = $wrapper.find('> .yform-accordion-item').length;
        var $counter = $relation.find('[data-yform-accordion-count]');
        if ($counter.length) {
            $counter.find('small').text(count + ' Einträge');
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // =========================================================================
    // LIVE SEARCH
    // =========================================================================

    container.find('[data-yform-accordion-search]').each(function () {
        var $input = $(this);
        var fieldkey = $input.attr('data-yform-accordion-search');
        var $wrapper = $input.closest('.yform-accordion-relation');
        var $clearBtn = $wrapper.find('[data-yform-accordion-search-clear="' + fieldkey + '"]');
        var searchTimeout = null;

        $input.on('input', function () {
            var query = $.trim($(this).val()).toLowerCase();

            // Clear-Button anzeigen/verstecken
            if (query.length > 0) {
                $clearBtn.show();
            } else {
                $clearBtn.hide();
            }

            // Debounce: 150ms warten
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function () {
                filterAccordionItems($wrapper, query);
            }, 150);
        });

        // Clear-Button
        $clearBtn.on('click', function (e) {
            e.preventDefault();
            $input.val('').trigger('input').focus();
        });

        // Escape: Suche leeren
        $input.on('keydown', function (e) {
            if (e.keyCode === 27) { // ESC
                e.preventDefault();
                $(this).val('').trigger('input');
            }
        });
    });

    function filterAccordionItems($wrapper, query) {
        var $items = $wrapper.find('[data-yform-accordion-items]').first().children('.yform-accordion-item');
        var visibleCount = 0;

        if (query === '') {
            // Kein Filter: alle anzeigen
            $items.each(function () {
                $(this).removeClass('yform-accordion-search-hidden yform-accordion-search-match');
            });
            visibleCount = $items.length;
        } else {
            $items.each(function () {
                var $item = $(this);
                var titleText = $item.find('.yform-accordion-title-text').first().text().toLowerCase();

                // Auch in Formularfeldern suchen (input-Values, select-Texte)
                var fieldTexts = '';
                $item.find('.yform-accordion-body input[type="text"], .yform-accordion-body textarea, .yform-accordion-body select').each(function () {
                    if ($(this).is('select')) {
                        fieldTexts += ' ' + $(this).find('option:selected').text();
                    } else {
                        fieldTexts += ' ' + ($(this).val() || '');
                    }
                });
                fieldTexts = fieldTexts.toLowerCase();

                var matches = titleText.indexOf(query) !== -1 || fieldTexts.indexOf(query) !== -1;

                if (matches) {
                    $item.removeClass('yform-accordion-search-hidden').addClass('yform-accordion-search-match');
                    visibleCount++;
                } else {
                    $item.addClass('yform-accordion-search-hidden').removeClass('yform-accordion-search-match');
                }
            });
        }

        // Counter aktualisieren
        var $counter = $wrapper.find('[data-yform-accordion-count]');
        if ($counter.length) {
            var total = $items.length;
            if (query !== '' && visibleCount < total) {
                $counter.find('small').text(visibleCount + ' / ' + total + ' Einträge');
            } else {
                $counter.find('small').text(total + ' Einträge');
            }
        }

        // "Keine Treffer" Hinweis
        var $noResults = $wrapper.find('.yform-accordion-no-results');
        if (query !== '' && visibleCount === 0) {
            if (!$noResults.length) {
                $wrapper.find('[data-yform-accordion-items]').first().after(
                    '<div class="yform-accordion-no-results"><p class="text-muted text-center" style="padding: 15px 0;"><i class="rex-icon fa-search"></i> Keine Treffer für "' + $('<span>').text(query).html() + '"</p></div>'
                );
            }
        } else {
            $noResults.remove();
        }
    }

    // =========================================================================
    // EXPAND ALL / COLLAPSE ALL
    // =========================================================================

    container.find('[data-yform-accordion-expand-all]').on('click', function (e) {
        e.preventDefault();
        var $wrapper = $(this).closest('.yform-accordion-relation');
        $wrapper.find('.panel-collapse:not(.in)').collapse('show');
    });

    container.find('[data-yform-accordion-collapse-all]').on('click', function (e) {
        e.preventDefault();
        var $wrapper = $(this).closest('.yform-accordion-relation');
        $wrapper.find('.panel-collapse.in').collapse('hide');
    });

    // Doppelklick auf Label: alle Panels toggle
    container.find('.yform-accordion-relation > .control-label').on('dblclick', function () {
        var $wrapper = $(this).closest('.yform-accordion-relation');
        var $panels = $wrapper.find('.panel-collapse');
        var allOpen = $panels.filter('.in').length === $panels.length;

        if (allOpen) {
            $panels.collapse('hide');
        } else {
            $panels.collapse('show');
        }
    });
});

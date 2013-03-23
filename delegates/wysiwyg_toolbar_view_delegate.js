/*-------------------------------------------------------------------------------------------------
 - Project:   Sproutcore WYSIWYG                                                                  -
 - Copyright: ©2012 Matygo Educational Incorporated operating as Learndot                         -
 - Author:    Joe Gaudet (joe@learndot.com) and contributors (see contributors.txt)               -
 - License:   Licensed under MIT license (see license.js)                                         -
 -------------------------------------------------------------------------------------------------*/
/*globals SproutCoreWysiwyg */
sc_require('views/wysiwyg_select_view');

/**
 * @class
 *
 * Responsible for creating toolbar controls for command objects
 */
SC.WYSIWYGToolbarViewDelegate = {

    isWYSIWYGToolbarViewDelegate: YES,

    controller: null,

    toolbarViewCreateControlForCommandNamed: function (toolbarView, commandName) {
        if (commandName === 'separator') {
            var separatorView = this.toolbarViewSeparator();
            return toolbarView.createChildView(separatorView);
        }

        var command = SC.WYSIWYGCommandFactory.commandFor(commandName);
        var controlView = command ? this.toolbarViewButtonForCommand(toolbarView, commandName, command) : this[commandName];
        if (controlView) {
            controlView = this[commandName] = toolbarView.createChildView(controlView);
            if (SC.ButtonView.hasSubclass(controlView.constructor)) {
                controlView.adjust('height', SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height);
            }
        }
        else {
            SC.error('WYSIWYGToolbarViewDelegate: Could not createView: ' + commandName + ' no class was found.');
        }
        return controlView;
    },

    toolbarViewButtonForCommand: function (toolbarView, key, command) {
        var buttonClass = this[key];
        if (buttonClass) {
            buttonClass = buttonClass.extend({
                command: command
            });
        }
        else {
            buttonClass = this.get('exampleView').extend({
                layout: {
                    width: 30,
                    height: SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height
                },
                icon: command.get('icon'),
                command: command,
                toolTip: command.get('toolTip'),
                action: 'invokeCommand',
                target: this,
                keyEquivalent: command.get('keyEquivalent'),
                isSelectedBinding: SC.Binding.oneWay('.parentView.controller.is' + command.commandName.classify())
            });
        }
        return buttonClass;
    },

    toolbarViewSeparator: function () {
        var separator = SC.SeparatorView.extend({
            layout: { 
                top: 0, 
                bottom: 0, 
                height: SC.Theme.find(SC.defaultTheme).buttonRenderDelegate[SC.REGULAR_CONTROL_SIZE].height, 
                width: 3 }, 
            layoutDirection: SC.LAYOUT_VERTICAL, 
        });
        return separator;
    },

    invokeCommand: function (source) {
        this.get('controller').invokeCommand(source);
    },

    /**
     * @property {SC.WYSIWYGSelectView} default control for handling paragraph
     *           styles (p, h1, h2 etc)
     */
    styles: SC.WYSIWYGSelectView,

    /**
     * @property {SC.ButtonView) default control for handling commands.
	 */
    exampleView: SC.ButtonView.extend({
        classNames: 'sc-wysiwyg-button'
    })
};

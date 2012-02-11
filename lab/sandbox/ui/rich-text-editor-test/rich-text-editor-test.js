var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

exports.RichTextEditorTest = Montage.create(Component, {

    templateDidLoad: {
        value: function() {
            var savedValue = localStorage.getItem("savedValue");

            if (savedValue) {
                this.editor.value = savedValue;
                this.editor.focus();
            } else {
                this.loadDefaultContent();
            }
        }
    },

    loadDefaultContent: {
        value: function() {
            var editor = this.editor;

            // Restore the editor content
            var xhr = new XMLHttpRequest();
            xhr.open('GET', './assets/default-text.html', true);
            xhr.responseType = 'text';

            xhr.onload = function(event) {
                if (this.status == 200) {
                    editor.value = this.response;
                } else {
                    editor.value = "";
                }
                editor.focus();
            };

            xhr.send();
        }
    },

    handleAction: {
        value: function(event) {
            console.log("Action:", event.target.identifier);
            switch (event.target.identifier) {
                case "reset":
                    this.loadDefaultContent();
                    break;
            }
        }
    },


    // Rich Textfield event & delegate methods
    handleEditorChange: {
        enumerable: false,
        value: function(event) {
            var value = this.editor.value,
                selfClosingTags = ["area", "base", "basefont", "br", "bgsound", "col", "command", "embed", "frame", "hr",
                    "input", "img", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr"],
                indent = 0,
                lastType,
                padding = "                                ",
                div = document.createElement("div"),
                output = "";

            localStorage.setItem("savedValue", value);

            // Reformat the value for the source panel
            value = value.replace(/[\n\r]+/g, "");
            value.replace(/\<(\/?)([a-z0-9]+)[^>]*>|([^<>]+)/g, function(match, closed, tag, text) {
                var currentPadding = padding.substr(0, Math.min(indent * 2, 32));

                if (text) {
                    lastType = "text";
                } else {
                    lastType = tag;
                    if (selfClosingTags.indexOf(tag.toLowerCase()) == -1) {
                        if (closed) {
                            indent --;
                            if (indent < 0) {
                                indent = 0
                            }
                            currentPadding = padding.substr(0, Math.min(indent * 2, 32))
                        } else {
                            indent ++;
                        }
                    }
                }

                // Convert plain-text to HTML
                div.textContent = match;
                match = div.innerHTML;

                output += '<pre class="type-' + lastType+ '">' + currentPadding + match +'</pre>'
            });

            this.source.innerHTML = output;

 //           this.source.innerText = this.editor.textValue;

        }
    },

    handleEditorSelect: {
        enumerable: false,
        value: function(editor) {
            this.editor.updateStates();
        }
    },

    editorFileDrop: {
        enumerable: false,
        value: function(editor, file, data) {
            /*
                the delegate provide a change for the consumer to handle the drop itself, refuse the drop or accept it

                possible return values:

                true: the richtext field will handle the drop itself
                false or null: the drop is canceled
             */
            return true;
        }
    },

    editorDrop: {
        enumerable: false,
        value: function(editor, data, contentType) {
            /*
                the delegate provide a change for the consumer to handle the drop itself, refuse the drop, accept the
                drop or change the drop data

                possible return values:

                true: the richtext field will handle the drop itself
                false or null: the drop is canceled
                <string>: the richtext field will insert the string as html
             */
            return true;
        }
    },

    editorPaste: {
        enumerable: false,
        value: function(editor, data, contentType) {
            /*
                the delegate provide a change for the consumer to handle the paste itself, refuse the paste, accept the
                paste or change the paste data.

                possible return values:

                true: the richtext field will handle the paste itself
                false or null: the paste is canceled
                <string>: the richtext field will insert the string as html
             */
            return true;
        }
    },

    editorFilePaste: {
        enumerable: false,
        value: function(editor, file, data) {
            /*
                the delegate provide a change for the consumer to handle the paste itself, refuse the paste or accept the
                paste.

                possible return values:

                true: the richtext field will handle the paste itself
                false or null: the paste is canceled
                <string>: the richtext field will insert the string as html
             */
            return true;
        }
    }
});

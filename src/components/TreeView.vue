<template>
    <div class="tree-view p-2 h-100 ml-2" @click="click">
        <tree-view-node v-for="node in nodes" :node="node"></tree-view-node>
        <span class="token current-token"></span>
        <textarea ref="textInput" wrap="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                  class="text-input" @keydown="keydown"></textarea>
        <span ref="blinkingCursor" class="blinking-cursor">|</span>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class TreeView extends Vue {
		@Prop() private uri: string;
		private nodes = [];

		mounted() {
			let data = st.data[this.uri];
			let meta = st.meta[this.uri];
			let props = meta.properties as Property[];
			let node = this.createNode(data, props);
			this.nodes = [node];
		}

		click(e) {
			this.$refs.textInput.focus();
			this.locateCursor();
		}

		locateCursor() {
			let $tk = $(".current-token");

			let x = $tk.offset().x + $tk.width();
			let y = $tk.offset().y;

			let blinkingCursor = this.$refs.blinkingCursor;
			blinkingCursor.style.left = x + "px";
			blinkingCursor.style.top = y + "px";
		}

		lineKeyClick() {
			console.log("lineKeyClick");
		}

		checkToken(text) {
			if (this.language.types[text]) {
				$(".current-token").addClass("line-key").removeClass("current-token").click(this.lineKeyClick);
				return true;
			} else
				return false;
		}

		keydown(e) {
			let $tk = $(".current-token");
			let keycode = e.keyCode;

			if (e.ctrlKey || e.altKey)
				return;

			let printable =
				(keycode > 47 && keycode < 58) || // number keys
				keycode == 13 || // spacebar & return key(s) (if you want to allow carriage returns)
				(keycode > 64 && keycode < 91) || // letter keys
				(keycode > 95 && keycode < 112) || // numpad keys
				(keycode > 185 && keycode < 193) || // ;=,-./` (in order)
				(keycode > 218 && keycode < 223);   // [\]' (in order)

			if (printable) {
				$tk.text($tk.text() + e.key);
				return;
			}

			let lang = this.data.language;

			switch (keycode) {
				case Keys.backspace:
					$tk.text($tk.text().substr(0, $tk.text().length - 1));
					break;

				case Keys.space:
					if (this.checkToken($tk.text())) {
						return;
					}
					$tk.text($tk.text() + e.key);
					break;

				case Keys.tab:
					this.checkToken($tk.text());
					break;

				default:
					console.log(e);
					break;
			}
		}

		createNode(data, props: Property[], parent?: Property): TreeViewNode {
			let node = new TreeViewNode();
			node.nodes = [];

			if (parent && parent.isList) {
				node.line = {
					head: "..",
					subject: {name: "name", _: {gtype: GlobalType.string}},
					item: {name: parent.name},
					attrs: []
				} as TreeViewLine;

				if (Array.isArray(data)) {
					for (let item of data) {
						let child = this.createNode(item, props, null);
						node.nodes.push(child);
					}
				}
			} else {
				node.line = this.createLine(data, props, parent);

				let objectProps = props.filter((p) => {
					return p._.gtype == GlobalType.object;
				});

				for (let prop of objectProps) {
					if (data[prop.name]) {
						let child = this.createNode(data[prop.name], prop.properties, prop);
						node.nodes.push(child);
					}
				}
			}
			return node;
		}

		createLine(item, props: Property[], parent: Property): TreeViewLine {
			let attrs = [];
			let attributeProps = props.filter((p) => {
				return p._.gtype != GlobalType.object;
			});
			let subjectProp = parent ? {name: "__name", _: {gtype: GlobalType.string}} : attributeProps.shift();
			if (item) {
				if (parent) item.__name = parent.name;
				for (let prop of attributeProps) {
					if (prop.text && prop.text.password)
						continue;
					attrs.push({prop, item} as TreeViewAttribute);
				}
			}
			return {head: "..", subject: subjectProp, item, attrs} as TreeViewLine;
		}
	}
</script>

<style lang="scss">

    .blinking-cursor {
        position: absolute;
        font-weight: bold;
        color: #2E3D48;
        -webkit-animation: 1s blink step-end infinite;
        -moz-animation: 1s blink step-end infinite;
        -ms-animation: 1s blink step-end infinite;
        -o-animation: 1s blink step-end infinite;
        animation: 1s blink step-end infinite;
        margin-left: -3px;
    }

    @keyframes blink {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }

    @-moz-keyframes blink {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }

    @-webkit-keyframes blink {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }

    @-ms-keyframes blink {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }

    @-o-keyframes blink {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }

    .tree-view {
        font-family: monospace;
        margin-bottom: 30%;

        .tree-view-node {
            border-left: 1px solid #eee;
        }

        .tree-view-head {
            cursor: pointer;
            padding: 2px 5px;
            border-radius: 3px;
            border: 1px solid #ccc;
            background-color: #eee;
            color: #666;
        }

        .tree-view-head.empty {
            border-radius: 50px;
            border: none;
            background-color: #666;
        }

        .tree-view-line {
        }

        .tree-view-attribute-name {
            color: #666;
        }

        .tree-view-attribute-value {
            color: #333;
            display: inline-block;
        }

        .tree-view-caption {
            color: #999;
        }

        .tree-view-attr-label {
            border: 1px solid #eee;
            padding: 0px 3px;
            border-radius: 4px;
            white-space: nowrap;
            display: inline-table;
        }

        .tree-view-subject .prop-value {
            font-weight: bold;
            color: black !important;
        }
    }

    .text-input {
        position: absolute;
        border: none;
        resize: none;
        outline: none;
        overflow: hidden;
        user-select: text;
        cursor: text;
        white-space: pre !important;
        background: #eee;
        font: inherit;
        padding: 0 1px;
        margin: 0 -1px;
        contain: strict;
        z-index: 0;
        opacity: 0;
        height: 1px;
        width: 1px;
    }

</style>

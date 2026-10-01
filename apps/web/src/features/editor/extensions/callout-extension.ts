import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CalloutNodeView } from "../components/callout-node-view";
import type { CalloutVariant } from "../config/callout-variants";

export interface CalloutOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: { variant?: CalloutVariant }) => ReturnType;
      toggleCallout: (attributes?: { variant?: CalloutVariant }) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: "callout",

  group: "block",

  content: "block+",

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      variant: {
        default: "takeaway",
        parseHTML: (element) => element.getAttribute("data-variant") || "takeaway",
        renderHTML: (attributes) => ({
          "data-variant": attributes.variant,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
      {
        tag: "div[data-noter-callout]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "callout",
        "data-noter-callout": "",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },

  addCommands() {
    return {
      setCallout:
        (attrs) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attrs);
        },
      toggleCallout:
        (attrs) =>
        ({ commands, state }) => {
          const { selection, schema } = state;
          const nodeType = schema.nodes[this.name];
          if (!nodeType) return false;

          let isInsideCallout = false;
          let depth = selection.$from.depth;
          while (depth > 0) {
            if (selection.$from.node(depth).type === nodeType) {
              isInsideCallout = true;
              break;
            }
            depth--;
          }

          if (isInsideCallout) {
            return commands.lift(this.name);
          }
          return commands.wrapIn(this.name, attrs);
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});

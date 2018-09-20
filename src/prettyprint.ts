import {
  HtmlParser,
  Visitor,
  Node,
  Attribute,
  Expansion,
  Text,
  Comment,
  ExpansionCase,
} from '@angular/compiler';

export function format(
  src: string,
  indentation: number = 2,
  useSpaces: boolean = true,
): string {
  const rawHtmlParser = new HtmlParser();

  const htmlResult = rawHtmlParser.parse(src, '', true);

  const pretty: string[] = [];
  let indent = 0;
  let attrNewLines = false;

  const selfClosing = {
    area: true,
    base: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true,
  };

  const skipFormattingChildren = {
    style: true,
    pre: true,
  };

  const getIndent = (i: number): string => {
    if (useSpaces) {
      return new Array(i * indentation).fill(' ').join('');
    } else {
      return new Array(i).fill('\t').join('');
    }
  };

  const visitor: Visitor = {
    visitElement: function(element) {
      if (pretty.length > 0) {
        pretty.push('\n');
      }
      if (element.name.startsWith(':svg:')) {
        pretty.push(getIndent(indent) + element.sourceSpan.toString());
        indent++;
        element.children.forEach(e => e.visit(visitor, {}));
        indent--;
        if (element.children.length > 0) {
          pretty.push('\n' + getIndent(indent));
        } else if (element.sourceSpan.toString().endsWith('/>')) {
          return;
        }
        // tslint:disable-next-line:no-non-null-assertion
        pretty.push(element.endSourceSpan!.toString());
        return;
      }
      pretty.push(getIndent(indent) + '<' + element.name);
      // tslint:disable-next-line:triple-equals
      attrNewLines = element.attrs.length > 1 && element.name != 'link';
      element.attrs.forEach(attr => {
        attr.visit(visitor, {});
      });
      if (attrNewLines) {
        pretty.push('\n' + getIndent(indent));
      }
      pretty.push('>');
      indent++;
      const ctx = {
        inlineTextNode: false,
        textNodeInlined: false,
        skipFormattingChildren: skipFormattingChildren.hasOwnProperty(
          element.name,
        ),
      };
      // tslint:disable-next-line:triple-equals
      if (!attrNewLines && element.children.length == 1) {
        ctx.inlineTextNode = true;
      }
      element.children.forEach(e => {
        e.visit(visitor, ctx);
      });
      indent--;
      if (
        element.children.length > 0 &&
        !ctx.textNodeInlined &&
        !ctx.skipFormattingChildren
      ) {
        pretty.push('\n' + getIndent(indent));
      }
      if (!selfClosing.hasOwnProperty(element.name)) {
        pretty.push(`</${element.name}>`);
      }
    },
    visit: function(node: Node, context: any) {
      console.error('IF YOU SEE THIS THE PRETTY PRINTER NEEDS TO BE UPDATED');
    },
    visitAttribute: function(attribute: Attribute, context: any) {
      const prefix = attrNewLines ? '\n' + getIndent(indent + 1) : ' ';
      pretty.push(prefix + attribute.name);
      if (attribute.value.length) {
        pretty.push(`="${attribute.value.trim()}"`);
      }
    },
    visitComment: function(comment: Comment, context: any) {
      pretty.push('\n' + '<!-- ' + comment.value + ' -->');
    },
    visitExpansion: function(expansion: Expansion, context: any) {
      console.error('IF YOU SEE THIS THE PRETTY PRINTER NEEDS TO BE UPDATED');
    },
    visitExpansionCase: function(expansionCase: ExpansionCase, context: any) {
      console.error('IF YOU SEE THIS THE PRETTY PRINTER NEEDS TO BE UPDATED');
    },
    visitText: function(text: Text, context: any) {
      if (context.skipFormattingChildren) {
        pretty.push(text.value);
        return;
      }
      const shouldInline =
        context.inlineTextNode &&
        text.value.trim().length < 40 &&
        text.value.trim().length + pretty[pretty.length - 1].length < 140;

      context.textNodeInlined = shouldInline;
      if (text.value.trim().length > 0) {
        const prefix = shouldInline ? '' : '\n' + getIndent(indent);
        pretty.push(prefix + text.value.trim());
      } else if (!shouldInline) {
        pretty.push(
          text.value
            .replace('\n', '')
            .replace(/ /g, '')
            .replace(/\t/g, '')
            .replace(/\n+/, '\n'),
        );
      }
    },
  };

  htmlResult.rootNodes.forEach(node => {
    node.visit(visitor, {});
  });

  return pretty.join('').trim() + '\n';
}

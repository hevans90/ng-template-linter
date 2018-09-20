import { format } from './prettyprint';
import * as fs from 'fs';
import * as path from 'path';

const getHtmlFixture = (filePath: string): string =>
  fs.readFileSync(path.join(__dirname, filePath)).toString();

const singleAttributeNoContentFormatted = getHtmlFixture(
  '../fixtures/single-attribute-no-content.html',
);
const multipleAttributesNoContentFormatted = getHtmlFixture(
  '../fixtures/multiple-attributes-no-content.html',
);
const singleAttributeContentFormatted = getHtmlFixture(
  '../fixtures/single-attribute-content.html',
);
const multipleAttributesContentFormatted = getHtmlFixture(
  '../fixtures/multiple-attributes-content.html',
);

const commentsFormatted = getHtmlFixture('../fixtures/comments.html');

describe('Pretty Printer', () => {
  describe('format (with HTML content)', () => {
    it('should correctly format elements with 1 attribute (vanilla)', () => {
      expect(format('<div id="id">CONTENT</div>')).toEqual(
        singleAttributeContentFormatted,
      );
    });
    it('should correctly format elements with > 2 attributes (1 per line)', () => {
      expect(format('<div id="id" class="nice">CONTENT</div>')).toEqual(
        multipleAttributesContentFormatted,
      );
    });
  });

  describe('format (with no HTML content)', () => {
    it('should correctly format elements with 1 attribute (vanilla)', () => {
      expect(format('<div id="id"></div>')).toEqual(
        singleAttributeNoContentFormatted,
      );
    });
    it('should correctly format elements with > 2 attributes (1 per line)', () => {
      expect(format('<div id="id" class="nice"></div>')).toEqual(
        multipleAttributesNoContentFormatted,
      );
    });
  });

  describe('format (HTML comments)', () => {
    it('should correctly format HTML containing comments', () => {
      expect(
        format('<!-- com --><div id="id" class="nice">CONTENT</div>'),
      ).toEqual(commentsFormatted);
    });
  });
});

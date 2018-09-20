import * as path from 'path';
import * as fs from 'fs';
import * as child from 'child_process';
import { format } from './prettyprint';
import * as commander from 'commander';
import * as colors from 'colors';

const program = commander
  .option('-f --fix', 'edit the files in place')
  .option('-s --stage', 'automatically git stage fixed files')
  .parse(process.argv);

const fix = !!(program as any)['fix'] || false;
const stage = !!(program as any)['stage'] || false;

let changed = 0;
const changedFiles: string[] = [];

program.args.forEach((file: string) => {
  let fileName = file;
  if (!fileName.startsWith('/')) {
    fileName = path.resolve(process.cwd(), fileName);
  }

  if (fix) {
    console.log('processing', file);
  }

  const source = fs.readFileSync(fileName).toString();
  const pretty = format(source);

  if (pretty !== source) {
    changed++;
    changedFiles.push(fileName);
  }
  if (fix) {
    fs.writeFileSync(fileName, pretty);
  }
});

if (changed > 0) {
  console.error(
    colors.red.bold(
      `\n${changed} HTML file${
        changed === 1 ? '' : 's'
      } found with formatting issues:`,
    ),
  );
  changedFiles.forEach((fileName, i) => {
    const splitFileName = fileName.split('/');
    const actualFileName = splitFileName.pop() as string;
    const filePath = fileName.replace(actualFileName, '');

    console.log(colors.bgRed(`\n${actualFileName}`) + ` --- ${filePath}`);
    if (i === changedFiles.length - 1) {
      console.log('\n');
    }
  });
  if (!fix) {
    console.log(
      `\nTo fix these issues: ${colors.cyan(
        'npm run format:html:commit -- -s',
      )} to fix + stage currently staged html files, that fail linting.\n`,
    );
    process.exit(1);
  }
} else {
  console.log(colors.green.bold('\nNo HTML linting issues found.'));
}

if (fix && changed > 0) {
  console.log(colors.green(`\n${changed} fixed`));

  if (stage) {
    child.exec("git add $(git diff --name-only --cached -- '*.html')");
  }
}

const skipped = program.args.length - changed;
if (skipped > 0) {
  console.log(`\n${skipped} unchanged`);
}

console.log('\n');

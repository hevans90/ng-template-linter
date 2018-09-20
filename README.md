# Angular HTML Linter/Formatter

Custom Node CLI written to allow linting & autoformatting of Angular HTML.

To get started, there are 3 scripts in the `package.json`:

- `lint:html`: lints all HTML files in the `apps/` directory
- `lint:html:pre-commit`: lints any HTML files currently staged using git
- `format:html:commit`: lints & formats any HTML files currently staged using git
- `format:html:apps`: recursively lints & formats all HTML files underneath all apps in the repo


## Linting

`ts-node <path-to-html-lint> <list of files/globs to lint>`

### Examples:

- Single file:  `ts-node html-lint my-template.html`
- Multiple files:  `ts-node html-lint my-template.html my-template2.html`
- Globs:  `ts-node html-lint ./src/**/*.html`

## Formatting

Pass in the `-fix` (or `-f`) flag to tell the linter to format and write files that fail linting.

You may also pass `-stage` (or `-s`) to automatically git stage formatted files.

### Output:

```html
<div id="search-component">
  <h4>Hero Search</h4>
  <input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
  <div>
    <div *ngFor="let hero of heroes | async"
         (click)="gotoDetail(hero)" class="search-result" >
      {{hero.name}}
    </div>
  </div>
</div>
```

will get formatted to:

```html
<div id="search-component">
    <h4>Hero Search</h4>
    <input
        #searchBox
        id="search-box"
        (keyup)="search(searchBox.value)"
    >
    <div>
        <div
            *ngFor="let hero of heroes | async"
            (click)="gotoDetail(hero)"
            class="search-result"
        >
            {{hero.name}}
        </div>
    </div>
</div>
```

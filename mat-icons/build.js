/**
 * @license
 * Copyright (c) 2017 The expand.js authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */

// Const
const dir  = `${__dirname}/../../material-design-icons`,
    fs     = require('fs'),
    groups = {};

// Extracting (groups)
fs.readdirSync(dir).forEach(sub => {

    // Checking
    try { if (!fs.statSync(`${dir}/${sub}`).isDirectory()) { return; } } catch (err) { return; }
    try { if (!fs.statSync(`${dir}/${sub}/svg`).isDirectory()) { return; } } catch (err) { return; }

    // Let
    let group    = groups[sub] = {},
        items    = fs.readdirSync(`${dir}/${sub}/svg/production`),
        filtered = items.filter(item => item.match(/24px/));

    // Extracting (items)
    filtered.forEach(item => {

        // Let
        let id  = item.replace('ic_', '').replace('_24px.svg', '').replace(/_/g, '-'),
            svg = fs.readFileSync(`${dir}/${sub}/svg/production/${item}`, `utf-8`);

        // Setting
        group[id] = svg.replace(/<svg.*?>/, '').replace('</svg>', '');
    });
});

// Writing
Object.keys(groups).forEach(name => {

    // Let
    let text = `<link rel="import" href="../../xp-elements/xp-iconset.html">\n`;

    // Build: header
    text += `\n`;
    text += `<xp-iconset name="${name}">\n`;
    text += `    <svg>\n`;
    text += `        <defs>\n`;

    // Build: icons
    Object.keys(groups[name]).forEach(id => {
        text += `            <g id="${id}">${groups[name][id]}</g>\n`;
    });

    // Build: footer
    text += `        </defs>\n`;
    text += `    </svg>\n`;
    text += `</xp-iconset>`;

    // Writing
    fs.writeFileSync(`${__dirname}/${name}.html`, text);
});

// Logging
console.log('ICONS UPDATED!');

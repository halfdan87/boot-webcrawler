function printReport(pages) {
    console.log('Started report generation');
    const sorted = Object.keys(pages).sort();

    for (let k of sorted) {
      console.log(`Found ${pages[k]} internal links to ${k}`);
    }
}

export {printReport};

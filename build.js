const childProcess = require('child_process');
const fs = require('fs');

try {
    // Transpile the typescript files
    const proc = childProcess.exec('tsc --build tsconfig.prod.json && cp ./src/schema.gql ./functions/bundle');
    proc.on('error', (err) => {
        console.log('err', err)
    })
    proc.on('close', (code) => {
        const fils = fs.readdirSync('./functions/bundle');
        console.log('finished', fils);
        if (code !== 0) {
            throw Error("Build failed")
        }
    });

} catch (err) {
    console.log(err);
}

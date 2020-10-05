const childProcess = require('child_process');

try {
    // Transpile the typescript files
    const proc = childProcess.exec('tsc --build tsconfig.prod.json && cp ./src/schema.gql ./functions/graphql');
    proc.on('error', (err) => {
        console.log('err', err)
    })
    proc.on('close', (code) => {
        if (code !== 0) {
            throw Error("Build failed")
        }
    });

} catch (err) {
    console.log(err);
}

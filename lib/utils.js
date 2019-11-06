import fs from 'fs';

let getPathResources = (baseDir, callback, conf = {}) => {
    const dirs = fs.readdirSync(baseDir);

    return dirs.reduce((accumulator, value) => {
        const stat = fs.lstatSync(`${baseDir}/${value}`);
        const file = conf.removeFileExtension ? value.replace(/\..+$/, '') : value;
        
        if (callback(stat)) {
            accumulator.push(file);
        }

        return accumulator;
    }, []);
}

let searchForFile = (fileName, baseDir) => {
    const files = getPathResources(baseDir, (stat) => stat.isFile());
    for (let file of files) {
        if (file.match(`${fileName}\\.json$`)) {
            return `${baseDir}/${file}`;
        }
    }

    const dirs = getPathResources(baseDir, (stat) => stat.isDirectory());
    for (let dir of dirs) {
        let file = searchForFile(fileName, `${baseDir}/${dir}`);
        if (typeof file === 'string' && file !== '') {
            return file;
        }
    }
}

let getDirectoryTree = (path, dirName, conf) => {
    const files = getPathResources(path, (stat) => stat.isFile(), conf);
    const dirs = getPathResources(path, (stat) => stat.isDirectory(), conf);
    const mappedFiles = files.map((name) => { return { name, path: `${path}/${name}`, queryPath: encodeURIComponent(`${path}/${name}`) }; });
    const lastTree = { dirName, path, files: mappedFiles, dirs: [] };

    if (files.length === 0) {
        delete lastTree.files;
    }
    
    if (dirs.length === 0) {
        delete lastTree.dirs;
    }
    
    for (let dir of dirs) {
        lastTree.dirs.push(getDirectoryTree(`${path}/${dir}`, dir, conf));
    }

    return lastTree;
}

export { searchForFile, getDirectoryTree };
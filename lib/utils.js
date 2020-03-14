import fs from 'fs';
import path from 'path';

class Utils {
    static getPathResources(baseDir, callback, conf = {}) {
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

    static searchForFile(fileName, baseDir) {
        const files = Utils.getPathResources(baseDir, (stat) => stat.isFile());
        for (let file of files) {
            if (file.match(`${fileName}\\.json$`)) {
                return `${baseDir}/${file}`;
            }
        }

        const dirs = Utils.getPathResources(baseDir, (stat) => stat.isDirectory());
        for (let dir of dirs) {
            let file = Utils.searchForFile(fileName, `${baseDir}/${dir}`);
            if (typeof file === 'string' && file !== '') {
                return file;
            }
        }
    }

    static getDirectoryTree(path, dirName, conf) {
        dirName = dirName || path;
        const files = Utils.getPathResources(path, (stat) => stat.isFile(), conf);
        const dirs = Utils.getPathResources(path, (stat) => stat.isDirectory(), conf);
        const mappedFiles = files.map((name) => ({ name, path: `${path}/${name}`, queryPath: encodeURIComponent(`${path}/${name}`) }));
        const lastTree = { dirName, files: mappedFiles, dirs: [] };

        if (files.length === 0) {
            delete lastTree.files;
        }
        
        if (dirs.length === 0) {
            delete lastTree.dirs;
        }
        
        for (let dir of dirs) {
            lastTree.dirs.push(Utils.getDirectoryTree(`${path}/${dir}`, dir, conf));
        }

        return lastTree;
    };

    static toPathsObject(files) {
        return files.map(file => ({
            dir: path.dirname(file),
            fileName: path.basename(file).replace(/\.(json|js)$/i, ''),
            fullPath: file,
            queryPath: encodeURIComponent(file)
        }));
    }
}

export const [ getDirectoryTree, toPathsObject, getPathResources ] = [ Utils.getDirectoryTree, Utils.toPathsObject, Utils.getPathResources ];
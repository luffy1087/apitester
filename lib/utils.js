import fs from 'fs';
import path from 'path';

class Utils {
    getPathResources(baseDir, callback, conf = {}) {
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

    searchForFile(fileName, baseDir) {
        const files = this.getPathResources(baseDir, (stat) => stat.isFile());
        for (let file of files) {
            if (file.match(`${fileName}\\.json$`)) {
                return `${baseDir}/${file}`;
            }
        }

        const dirs = this.getPathResources(baseDir, (stat) => stat.isDirectory());
        for (let dir of dirs) {
            let file = this.searchForFile(fileName, `${baseDir}/${dir}`);
            if (typeof file === 'string' && file !== '') {
                return file;
            }
        }
    }

    getDirectoryTree(path, dirName, conf) {
        dirName = dirName || path;
        const files = this.getPathResources(path, (stat) => stat.isFile(), conf);
        const dirs = this.getPathResources(path, (stat) => stat.isDirectory(), conf);
        const mappedFiles = files.map((name) => ({ name, path: `${path}/${name}`, queryPath: encodeURIComponent(`${path}/${name}`) }));
        const lastTree = { dirName, files: mappedFiles, dirs: [] };

        if (files.length === 0) {
            delete lastTree.files;
        }
        
        if (dirs.length === 0) {
            delete lastTree.dirs;
        }
        
        for (let dir of dirs) {
            lastTree.dirs.push(this.getDirectoryTree(`${path}/${dir}`, dir, conf));
        }

        return lastTree;
    };

    toPathsObject(files) {
        return files.map(file => ({
            dir: path.dirname(file),
            fileName: path.basename(file).replace(/\.(json|js)$/i, ''),
            fullPath: file,
            queryPath: encodeURIComponent(file)
        }));
    }
}

const utils = new Utils();
export default utils;
export const getDirectoryTree = utils.getDirectoryTree.bind(utils);
export const toPathsObject = utils.toPathsObject.bind(utils);
export const getPathResources = utils.getPathResources.bind(utils);
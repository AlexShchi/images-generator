'use strict'
const fs = require('fs'),
    sharp = require('sharp');
// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');
// const gm = require('gm');

const config = require('./config');
const path = './src/';
const dest = './output/';

const images = [
    'test-image-1.jpg',
    'test-image-2.png'
]

// console.log(config);

/*
src      - папка, в которой лежит файл
dest     - папка, в которую нужно записать преобразованный файл
fileName - имя файла с рашширением (test-image-1.jpg)
size     - размер итогового изображения
format   - формат файла, который нужно получить (webp - по умолчанию, jpg, png)
*/
function createImagesForImage(src, dest, fileName, size, format) {

    // if (!size) {
    //     conaole.log(' size is undefined');
    //     gm(src + fileName)
    //         .size((err, size) => {
    //             if (!err) {
    //                 size = [size.width, size.height];
    //                 // console.log(`${size.width}*${size.height}`);
    //             } else {
    //                 console.log(err);
    //             }
    //         })
    // }
    if (!format) format = 'webp';

    fs.access(src, (err) => {
        if (err) {
            console.log(err);
        } else {
            const name = fileName.replace(/.(jpg|png|svg|tiff|gif|jpeg)/, '');

            let stream = sharp(src + fileName);

            if( size ) {
                stream.resize(size[0], size[1]);
            }

            // formats api: https://sharp.pixelplumbing.com/api-output
            switch (format) {
                case 'webp':
                    stream.webp({
                        lossless: false,
                        quality: 80,
                        reductionEffort: 6, //0-6
                    });
                    break;
                case 'jpeg':
                case 'jpg':
                    format = 'jpg';
                    stream.jpeg({
                        quality: 80,
                        progressive: true,
                    });
                    break;
                case 'png':
                    stream.png({
                        progressive: false,
                        compressionLevel: 9, //0-9
                        quality: 80
                    });
                    break;
            }

            stream.toFile(`${dest + name}.${format}`, (err, info) => {
                if (err) {
                    console.log(`Error on ${dest + fileName}`)
                    console.log(err);
                } else {
                    if( size ) {
                        console.log(`\x1b[1m\x1b[32mFile "${src + fileName}" => ${size} | "${dest + name}.${format}"\x1b[0m`);
                    } else {
                        console.log(`\x1b[1m\x1b[32mFile "${src + fileName}" => "${dest + name}.${format}"\x1b[0m`);
                    }

                }
            });
        }
    })
}

// createImagesForImage(path, dest, images[0], [400,600], 'webp');
// createImagesForImage(path, './dest/my-folder/', images[0], [400,600], 'webp');

/*
srcPath  - папка, в которой нужно найти все файлы, включая файлы во воложенных папках
*/
function getFiles(srcPath) {

    let files = [];

    const folderItems = fs.readdirSync(srcPath);
    for (let index in folderItems) {

        if (fs.statSync(`${srcPath}${folderItems[index]}`).isFile()) {
            files.push(`${srcPath}${folderItems[index]}`);
        } else {
            let folderFiles = getFiles(`${srcPath}${folderItems[index]}/`);
            if (folderFiles.length) {
                for (let i in folderFiles) {
                    if (folderFiles[i].match(/(jpg|jpeg|png|svg|gif|webp)/g))
                        files.push(folderFiles[i]);
                }
            }
        }

    }
    if (!files.length) {
        return false;
    }
    return files;
}

// console.log(getFiles(path));

/*
dir - директория, которую необходимо создать
*/
function makeDir(dir) {
    if (typeof dir !== 'string') {
        console.log('\x1b[31mfunction "makeDir": в качестве пути к директории должна передаваться строка');
        console.log(`Получен: ${typeof dir}\x1b[0m`);
        return false;
    }

    fs.access(dir, (err) => {
        if (err) {
            fs.mkdirSync(dir, {recursive: true});
        }
    })

    return true;
}

// makeDir('./output/my-folder/one');
// makeDir(true);

/*
srd - папка с файлами изобржаений
*/
function makeImages(src, dest, format, allInDest) {
    const files = getFiles(src);
    if (files) {

        if( !dest.match(/\/$/) ){
            dest += '/'
        }

        for( const i in files ) {

            let destDir = files[i].replace(/^.\/src\//, dest);
            if( !allInDest ){
                destDir = files[i].replace(/^.\/src\//, dest);
                destDir = destDir.replace(/[^\/]*\.(jpg|jpeg|png|svg|gif)/, '' );
            } else {
                destDir = dest;
            }

            makeDir( destDir );
            const fileName = files[i].replace(/^.*\//,'');
            createImagesForImage( files[i].replace(/[^\/]*\.(jpg|jpeg|png|svg|gif)/, '' ), destDir, fileName,[],format );
        }

    } else {
        console.log('\x1b[33mSRC folder is empty\x1b[0m');
    }
}

// makeImages(path, dest, 'webp', false);




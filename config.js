const config = {
    src: './src',
    dest: './output',
    size: '',
    suffix: 'x%', // % - выводимое значение | -600, -600х400, -x1, false
    allInDest: false,
    format: [],
    files: {
        'file1.jpg': {
            size: ['680', 'x2','x3'],
            format: 'webp'
        }
    },
    folders: {
        'folder1':{
            size: ['1920','x2','x3'],
            format: ['webp'],
            files: {
                'file2.png': {
                    size: ['680', 'x2','x3'],
                    format: 'webp'
                }
            }
        },
        'folder2':{
            size:'1920'
        }
    }

}
module.exports = config;
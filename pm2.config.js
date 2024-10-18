module.exports = {
    apps : [{
        name: 'backend',
        cwd: './',
        script: 'node',
        args: './dist/index.js',
        watch: ['./dist'],
        error_file: './logs/err.log',
        out_file: './logs/out.log',
    }]
};

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'inmydata-main.js', // Entry point
    output: {
        file: 'dist/inmydata-components-all.js', // Output file
        format: 'iife', // Immediately Invoked Function Expression
        name: 'InmydataAll'
    },
    plugins: [
        resolve(),
        commonjs()
    ]
};
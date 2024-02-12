const WGSLCode = import.meta.glob(
    '../wgsl/**/*.wgsl',
    {
        query: '?raw',
        import: 'default',
        eager: true
    }
);

export function WGSLBuilder(manifest) {
    return manifest.map(file => WGSLCode[`../wgsl/${file}`]).join('\n');
}

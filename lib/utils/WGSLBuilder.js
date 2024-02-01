const WGSLCode = import.meta.glob('../wgsl/**/*.wgsl', {as: 'raw', eager: true});

export function WGSLBuilder(manifest) {
    return manifest.map(file => WGSLCode[`../wgsl/${file}`]).join('\n');
}

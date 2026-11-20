import { BufferGeometry, Float32BufferAttribute, MeshStandardMaterial } from 'three';

// A folded sheet of linen. Each pair of panels shares a raised seam.
export function pleatedShade() {
  const positions: number[] = [], uvs: number[] = [], transmission: number[] = [];
  const indices: number[] = [];
  const folds = 64;
  const rings = 20;
  const edges = folds * 2;
  for (let row = 0; row <= rings; row++) {
    const t = row / rings;
    for (let edge = 0; edge <= edges; edge++) {
      const ridge = edge % 2;
      const angle = (edge / edges) * Math.PI * 2;
      const radius = 0.277 + 0.526 * (1 - t) ** 1.18 + ridge * (0.015 + 0.023 * (1 - t));
      positions.push(Math.sin(angle) * radius, 1.02 + 0.825 * t + ridge * 0.003, Math.cos(angle) * radius);
      uvs.push(edge / edges, t);
      // Stitching absorbs light at the hem; light peaks around the internal bulb.
      const hem = row === 0 || row === rings ? 0.50 : 1;
      transmission.push(hem * (0.22 + 0.78 * Math.exp(-9 * (t - 0.43) ** 2)) * (ridge ? 1.05 : 0.40) * (0.82 + 0.18 * Math.cos(angle + 0.45)));
      if (row === rings || edge === edges) continue;
      const a = row * (edges + 1) + edge;
      const b = a + edges + 1;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('fabricLight', new Float32BufferAttribute(transmission, 1));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function linenTransmission(shader: Parameters<MeshStandardMaterial['onBeforeCompile']>[0]) {
  shader.vertexShader = 'attribute float fabricLight; varying float vFabricLight;\n' +
    shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvFabricLight = fabricLight;');
  shader.fragmentShader = 'varying float vFabricLight;\n' + shader.fragmentShader.replace(
    '#include <emissivemap_fragment>',
    '#include <emissivemap_fragment>\n totalEmissiveRadiance *= vFabricLight;'
  );
}

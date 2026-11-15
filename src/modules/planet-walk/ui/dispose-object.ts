import { Mesh, MeshStandardMaterial } from 'three';
import type { BufferGeometry, Material, Object3D } from 'three';

/** Frees the GPU memory of everything in the object: shapes, surfaces and their pictures. */
export const disposeObject = (object: Object3D) =>
  object.traverse((part) => {
    if (!(part instanceof Mesh)) return;
    const mesh = part as Mesh<BufferGeometry, Material | Material[]>;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (material instanceof MeshStandardMaterial) {
        material.map?.dispose();
        material.bumpMap?.dispose();
      }
      material.dispose();
    }
  });

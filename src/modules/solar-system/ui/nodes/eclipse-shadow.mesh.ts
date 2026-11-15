import { Color, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { toSceneAxes } from '../../core/scene-scale';
import {
  eclipseShadowFragmentShader,
  eclipseShadowVertexShader,
} from '../shaders/eclipse-shadow.shader';
import type { ShadowCasting } from '../../core/eclipse-geometry';
import type { Object3D } from 'three';

export type EclipseShadow = {
  mesh: Mesh;
  /** Updates the shadow from the real geometry, around the receiver's position and radius. */
  update: (casting: ShadowCasting, receiverRadius: number) => void;
};

export type ShadowLook = {
  color: number;
  maxDarkness: number;
};

const SHELL_RADIUS = 1.004;
const SPHERE_SEGMENTS = 96;

const toVector = (position: { x: number; y: number; z: number }) =>
  new Vector3(position.x, position.y, position.z);

/**
 * Creates a thin shell over a receiving body (to be added to its holder), shading the part
 * of its surface where an eclipse hides the Sun.
 */
export const createEclipseShadow = (receiver: Object3D, look: ShadowLook): EclipseShadow => {
  const material = new ShaderMaterial({
    uniforms: {
      receiverCenter: { value: new Vector3() },
      sunDirection: { value: new Vector3() },
      sunAngularRadius: { value: 0 },
      occluderPosition: { value: new Vector3() },
      occluderRadius: { value: 1 },
      shadowColor: { value: new Color(look.color) },
      maxDarkness: { value: look.maxDarkness },
    },
    vertexShader: eclipseShadowVertexShader,
    fragmentShader: eclipseShadowFragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(
    new SphereGeometry(SHELL_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS),
    material,
  );
  const { uniforms } = material;
  return {
    mesh,
    update: (casting, receiverRadius) => {
      mesh.scale.setScalar(receiverRadius);
      receiver.getWorldPosition(uniforms.receiverCenter.value as Vector3);
      uniforms.sunDirection.value = toVector(toSceneAxes(casting.sunDirection));
      uniforms.sunAngularRadius.value = casting.sunAngularRadius;
      uniforms.occluderPosition.value = toVector(toSceneAxes(casting.occluder));
      uniforms.occluderRadius.value = casting.occluderRadius;
    },
  };
};

import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';

const AMBER = 0xffa040;

/** Small amber marker lights low on the module's corners, so that its shape shows at night. */
export const cornerLights = (width: number, length: number, height: number) => {
  const glow = new MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 2 });
  return [-1, 1].flatMap((x) =>
    [-1, 1].map((z) => {
      const light = new Mesh(new BoxGeometry(0.04, 0.12, 0.5), glow);
      light.position.set(x * (width / 2 + 0.03), height, z * (length / 2 - 0.5));
      return light;
    }),
  );
};

/** A grey equipment box and a vent on the roof. */
export const roofKit = (top: number, length: number) => {
  const grey = new MeshStandardMaterial({ color: 0x8a9099, roughness: 0.7 });
  const unit = new Mesh(new BoxGeometry(1.2, 0.5, 1), grey);
  unit.position.set(0.4, top + 0.25, -length / 4);
  const vent = new Mesh(new BoxGeometry(0.5, 0.3, 0.5), grey);
  vent.position.set(-0.6, top + 0.15, length / 5);
  return [unit, vent];
};

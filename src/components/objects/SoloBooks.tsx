import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, MathUtils, Mesh, MeshStandardMaterial, type BufferGeometry } from 'three';
import { BOOK_FRONT, BOOK_PULL, SOLO_BOOKS } from '../room/soloShelfLayout';
import { bookStamp } from './bookStamp';

type Book = (typeof SOLO_BOOKS)[number];
type Part = { geometry: BufferGeometry; name: string };

function Volume({ book, parts, active }: { book: Book; parts: Part[]; active: boolean }) {
  const pivot = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const { project, cloth, faceOut } = book;
  const stamp = useMemo(() => bookStamp(project.title, project.author, cloth, faceOut), [project, cloth, faceOut]);
  const restingZ = BOOK_FRONT - (faceOut ? book.thickness : book.depth) / 2;
  useEffect(() => () => stamp.dispose(), [stamp]);
  useEffect(() => { invalidate(); }, [active, invalidate]);

  useFrame((_, delta) => {
    if (!pivot.current) return;
    const at = restingZ + (active ? BOOK_PULL : 0);
    const current = pivot.current.position.z;
    if (reduced.matches || Math.abs(at - current) < 0.0004) {
      pivot.current.position.z = at;
    } else {
      pivot.current.position.z = MathUtils.damp(current, at, 12, Math.min(delta, 0.08));
      invalidate();
    }
  });

  return <group ref={pivot} position={[book.x, book.floor, restingZ]}>
    <group rotation-y={faceOut ? Math.PI / 2 : 0}>
      <group scale={[book.thickness, book.height, book.depth]}>
        {parts.map(({ geometry, name }) => <mesh key={name} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color={name === 'Cover' ? cloth : name === 'Pages' ? '#d5c5a2' : '#9b8d70'}
            roughness={name === 'Cover' ? 0.9 : 1} />
        </mesh>)}
      </group>
      <mesh position={faceOut ? [-book.thickness / 2 - 0.0004, book.height / 2, 0] : [0, book.height / 2, book.depth / 2 + 0.0004]}
        rotation-y={faceOut ? -Math.PI / 2 : 0}>
        <planeGeometry args={[(faceOut ? book.depth : book.thickness) * 0.96, book.height * 0.974]} />
        <meshStandardMaterial map={stamp} roughness={0.92} />
      </mesh>
    </group>
  </group>;
}

export function SoloBooks({ highlight }: { highlight?: string }) {
  const { scene } = useGLTF('/models/project-book.glb', false, true);
  const parts = useMemo(() => {
    const surfaces: Part[] = [];
    scene.traverse(object => {
      if (object instanceof Mesh) surfaces.push({ geometry: object.geometry, name: (object.material as MeshStandardMaterial).name });
    });
    return surfaces;
  }, [scene]);

  return <>
    {SOLO_BOOKS.map(book => (
      <Volume key={book.project.id} book={book} parts={parts} active={highlight === book.project.id} />
    ))}
  </>;
}

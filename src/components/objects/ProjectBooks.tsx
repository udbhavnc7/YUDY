import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils, Mesh, MeshStandardMaterial, PerspectiveCamera, Quaternion, Vector3, type BufferGeometry, type Texture } from 'three';
import { BOOK_FRONT, BOOK_PULL, PROJECT_SHELVES, type ShelfBook } from '../room/projectShelves';
import { bookPaper } from './bookPaper';
import { bookStamp } from './bookStamp';
import { useRoomModel } from './useRoomModel';

type Part = { geometry: BufferGeometry; name: string };

const spineThickness = 0.18;
const boardHingeZ = 0.082;
const readingDistance = 0.63;
const axisY = new Vector3(0, 1, 0);

type VolumeProps = {
  book: ShelfBook;
  body: Part[];
  front?: BufferGeometry;
  endpaper: Texture;
  readingPage: Texture;
  active: boolean;
  reading: boolean;
};

function Volume({ book, body, front, endpaper, readingPage, active, reading }: VolumeProps) {
  const root = useRef<Group>(null);
  const board = useRef<Group>(null);
  const progress = useRef(0);
  const pull = useRef(0);
  const invalidate = useThree(state => state.invalidate);
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const { project, cloth, faceOut } = book;
  const teamEdition = project.type === 'group';
  const cover = useMemo(() => bookStamp(project.title, project.author, cloth, true, teamEdition), [project, cloth, teamEdition]);
  const spine = useMemo(() => bookStamp(project.title, project.author, cloth, false), [project, cloth]);
  const restingZ = BOOK_FRONT - (faceOut ? book.thickness : book.depth) / 2;
  const rest = useMemo(() => new Vector3(book.x - (faceOut ? book.depth / 2 : 0),
    book.floor + book.height / 2, restingZ + (faceOut ? 0 : book.depth / 2)), [book, faceOut, restingZ]);
  const restRotation = useMemo(() => new Quaternion().setFromAxisAngle(axisY, faceOut ? 0 : Math.PI / 2), [faceOut]);
  const restScale = useMemo(() => new Vector3(book.depth, book.height, book.thickness / spineThickness), [book]);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetRotation = useMemo(() => new Quaternion(), []);
  const targetScale = useMemo(() => new Vector3(), []);

  useEffect(() => () => { cover.dispose(); spine.dispose(); }, [cover, spine]);
  useEffect(() => { invalidate(); }, [active, reading, invalidate]);

  useFrame(({ camera, size, gl }, delta) => {
    if (!root.current || !board.current) return;
    const target = reading ? 1 : 0;
    const pullTarget = active || reading ? BOOK_PULL : 0;
    const dt = Math.min(delta, 0.075);
    progress.current = reduced.matches || Math.abs(progress.current - target) < 0.002
      ? target : MathUtils.damp(progress.current, target, 7, dt);
    pull.current = reduced.matches || Math.abs(pull.current - pullTarget) < 0.0004
      ? pullTarget : MathUtils.damp(pull.current, pullTarget, 12, dt);
    const opening = progress.current;
    const lift = MathUtils.smoothstep(opening, 0.04, 0.75);
    const turn = MathUtils.smoothstep(opening, 0.4, 1);

    root.current.position.copy(rest);
    root.current.position.z += pull.current;
    root.current.quaternion.copy(restRotation);
    root.current.scale.copy(restScale);
    board.current.rotation.y = -Math.PI * turn;

    if (opening > 0 || reading) {
      // The lifted volume follows the camera. Its screen dimensions also place
      // the selectable HTML text directly on the two paper surfaces.
      const width = Math.min(teamEdition ? 790 : 726, size.width - 28);
      const desktopHeight = teamEdition ? 460 : 422;
      const height = Math.min(size.width < 550 ? 394 : desktopHeight, size.height - 25);
      const fov = MathUtils.degToRad((camera as PerspectiveCamera).fov);
      const pixel = 2 * readingDistance * Math.tan(fov / 2) / size.height;
      camera.getWorldQuaternion(targetRotation);
      targetPosition.set(0, 0, -readingDistance).applyQuaternion(targetRotation).add(camera.position);
      targetScale.set(width * pixel / 2, height * pixel, width * pixel * 0.24);
      root.current.position.lerp(targetPosition, lift);
      root.current.quaternion.slerp(targetRotation, lift);
      root.current.scale.lerp(targetScale, lift);
      if (reading) {
        const host = gl.domElement.closest<HTMLElement>('.exhibit');
        host?.style.setProperty('--project-spread-width', width + 'px');
        host?.style.setProperty('--project-spread-height', height + 'px');
        host?.style.setProperty('--project-spread-opacity', String(MathUtils.smoothstep(turn, 0.72, 0.995)));
      }
    }
    if (opening !== target || pull.current !== pullTarget) invalidate();
  });

  return <group ref={root}>
    <group position={[0.5, -0.5, 0]} rotation-y={-Math.PI / 2} scale={[spineThickness, 1, 1]}>
      {body.map(({ geometry, name }) => (
        <mesh key={name} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color={name === 'Cover' ? cloth : name === 'Pages' ? '#d5c5a2' : '#9b8d70'}
            roughness={name === 'Cover' ? 0.9 : 1} />
        </mesh>
      ))}
    </group>
    <mesh position={[-0.0012, 0, 0]} rotation-y={-Math.PI / 2}>
      <planeGeometry args={[spineThickness * 0.96, 0.974]} />
      <meshStandardMaterial map={spine} roughness={0.92} />
    </mesh>
    <mesh position={[0.5, 0, 0.074]}>
      <planeGeometry args={[0.929, 0.958]} />
      <meshStandardMaterial map={readingPage} roughness={0.96} emissive="#c8b694" emissiveIntensity={0.23} />
    </mesh>
    <group ref={board} position-z={boardHingeZ}>
      <group position={[0.5, -0.5, -boardHingeZ]} rotation-y={-Math.PI / 2} scale={[spineThickness, 1, 1]}>
        {front && <mesh geometry={front} castShadow receiveShadow>
          <meshStandardMaterial color={cloth} roughness={0.9} />
        </mesh>}
      </group>
      <mesh position={[0.5, 0, 0.091 - boardHingeZ]}>
        <planeGeometry args={[0.96, 0.974]} />
        <meshStandardMaterial map={cover} roughness={0.92} />
      </mesh>
      <mesh position={[0.5, 0, 0.071 - boardHingeZ]} rotation-y={Math.PI}>
        <planeGeometry args={[0.934, 0.948]} />
        <meshStandardMaterial map={endpaper} roughness={0.96} emissive="#c8b694" emissiveIntensity={0.23} />
      </mesh>
    </group>
  </group>;
}

const books = [...PROJECT_SHELVES.solo, ...PROJECT_SHELVES.group];

export function ProjectBooks({ highlight, open }: { highlight?: string; open?: string }) {
  const scene = useRoomModel('/models/project-book.glb');
  const { body, front } = useMemo(() => {
    const body: Part[] = [];
    let front: BufferGeometry | undefined;
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const name = (object.material as MeshStandardMaterial).name;
      if (name === 'Front board') front = object.geometry;
      else body.push({ geometry: object.geometry, name });
    });
    return { body, front };
  }, [scene]);
  const endpaper = useMemo(() => bookPaper(false), []);
  const readingPage = useMemo(() => bookPaper(true), []);
  useEffect(() => () => { endpaper.dispose(); readingPage.dispose(); }, [endpaper, readingPage]);

  return <>
    {books.map(book => (
      <Volume key={book.project.id} book={book} body={body} front={front} endpaper={endpaper} readingPage={readingPage}
        reading={open === book.project.id} active={highlight === book.project.id} />
    ))}
  </>;
}


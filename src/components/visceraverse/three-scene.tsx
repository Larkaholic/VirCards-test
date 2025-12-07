'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAutopsyStore } from './autopsy-provider';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { cn } from '@/lib/utils';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { recordInteraction, tags, addTag, removeTag, scenario, injuries, activeTool, discoverEvidence } = useAutopsyStore();
  const [rendererSize, setRendererSize] = useState({ width: 0, height: 0 });
  const [mainCamera, setMainCamera] = useState<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('hsl(var(--background))');

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 20;
    setMainCamera(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Autopsy System Models
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0xead1b8, transparent: true, opacity: 0.2 });
    const torsoShape = new THREE.Shape();
    torsoShape.moveTo(-5, -8);
    torsoShape.lineTo(5, -8);
    torsoShape.lineTo(4, 8);
    torsoShape.lineTo(-4, 8);
    torsoShape.closePath();
    const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const torsoGeometry = new THREE.ExtrudeGeometry(torsoShape, extrudeSettings);
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.z = -2;
    scene.add(torso);

    const createOrgan = (geometry: THREE.BufferGeometry, color: THREE.ColorRepresentation, name: string, position: THREE.Vector3, evidenceId?: string) => {
        const material = new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.6 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { name, originalColor: new THREE.Color(color), evidenceId };
        mesh.position.copy(position);
        return mesh;
    };
    
    const heart = createOrgan(new THREE.SphereGeometry(1.5, 32, 16), 0x8c2c2c, 'Heart', new THREE.Vector3(0, 3, 0), 'evidence-heart');
    const leftLung = createOrgan(new THREE.SphereGeometry(2, 32, 16), 0xc78080, 'Left Lung', new THREE.Vector3(-2.5, 3, -1));
    leftLung.scale.set(1, 1.2, 1);
    const rightLung = createOrgan(new THREE.SphereGeometry(2, 32, 16), 0xc78080, 'Right Lung', new THREE.Vector3(2.5, 3, -1));
    rightLung.scale.set(1, 1.2, 1);
    const liver = createOrgan(new THREE.CapsuleGeometry(2, 2, 4, 8), 0x6b2d2d, 'Liver', new THREE.Vector3(2, -1, 0));
    liver.scale.set(1.5, 1, 1);
    liver.rotation.z = Math.PI / 4;
    const stomach = createOrgan(new THREE.TorusGeometry(1.5, 0.7, 16, 100), 0xbda28e, 'Stomach', new THREE.Vector3(-2.5, -0.5, 0));
    const intestines = createOrgan(new THREE.TorusKnotGeometry(2, 0.3, 100, 16), 0xce7a7a, 'Intestines', new THREE.Vector3(0, -4, 0));

    const interactiveObjects = [heart, leftLung, rightLung, liver, stomach, intestines];
    interactiveObjects.forEach(obj => scene.add(obj));

    // Injury visualization
    const decalMaterial = new THREE.MeshStandardMaterial({
        color: 0x400000,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false,
        transparent: true,
        opacity: 0.8
    });

    injuries.forEach(injury => {
        const targetOrgan = interactiveObjects.find(o => o.userData.name === injury.location);
        if (targetOrgan) {
            const position = new THREE.Vector3(...injury.position);
            const orientation = new THREE.Euler(...injury.orientation);
            const size = new THREE.Vector3(...injury.size);
            
            const decalGeom = new DecalGeometry(targetOrgan as THREE.Mesh, position, orientation, size);
            const decalMesh = new THREE.Mesh(decalGeom, decalMaterial);
            scene.add(decalMesh);
        }
    });

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let draggedObject: THREE.Object3D | null = null;
    let highlightedObject: THREE.Object3D | null = null;

    const onPointerMove = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (draggedObject && activeTool === null) {
            raycaster.setFromCamera(pointer, camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -draggedObject.position.z);
            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectPoint);
            draggedObject.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
            return;
        }

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (highlightedObject) {
            (highlightedObject as THREE.Mesh).material.emissive.setHex(0x000000);
            highlightedObject = null;
            document.body.style.cursor = 'default';
        }

        if (intersects.length > 0) {
            highlightedObject = intersects[0].object;
            ((highlightedObject as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive.setHex(0x555555);
            document.body.style.cursor = 'pointer';
        }
    };

    const onPointerDown = (event: PointerEvent) => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            recordInteraction(clickedObject.userData.name);

            if (activeTool === 'magnifying-glass') {
                if (clickedObject.userData.evidenceId) {
                    discoverEvidence(clickedObject.userData.evidenceId);
                }
            } else {
                 draggedObject = clickedObject;
                 // Bring to front
                 draggedObject.position.z = 5;
            }
        }
    };
    
    const onPointerUp = () => {
        if (draggedObject) {
             const originalZ = interactiveObjects.find(o => o.id === draggedObject?.id)?.position.z ?? 0;
             draggedObject.position.z = originalZ;
        }
        draggedObject = null;
    };
    
    const onDoubleClick = (event: MouseEvent) => {
        if (activeTool) return;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const position = intersects[0].point.clone();
            addTag({text: obj.userData.name, position});
        }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('dblclick', onDoubleClick);

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      setRendererSize({width: currentMount.clientWidth, height: currentMount.clientHeight});
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentMount);
    handleResize();

    // Cleanup
    return () => {
        resizeObserver.disconnect();
        if (currentMount && renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
        }
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        renderer.domElement.removeEventListener('dblclick', onDoubleClick);
        renderer.dispose();
        scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        document.body.style.cursor = 'default';
    };
  }, [scenario, injuries]); // Re-run effect if scenario or injuries change

  const getTagPosition = (pos: THREE.Vector3) => {
      if (!mainCamera) return { x: 0, y: 0 };
      const tempVec = pos.clone();
      tempVec.project(mainCamera);
      const x = (tempVec.x * 0.5 + 0.5) * rendererSize.width;
      const y = (tempVec.y * -0.5 + 0.5) * rendererSize.height;
      return { x, y };
  }

  return (
    <div className={cn("w-full h-full relative", activeTool && "cursor-crosshair")} ref={mountRef}>
       {mainCamera && tags.map(tag => {
           const {x, y} = getTagPosition(tag.position);
           return (
                <div key={tag.id} className="absolute bg-card text-card-foreground rounded-lg px-2 py-1 text-xs shadow-lg flex items-center gap-1" style={{ transform: `translate(-50%, -50%)`, left: `${x}px`, top: `${y}px` }}>
                    {tag.text}
                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => removeTag(tag.id)}><X className="h-3 w-3"/></Button>
                </div>
           )
       })}
       <div className="absolute bottom-4 left-4 bg-card/50 backdrop-blur-sm p-2 rounded-lg text-xs text-muted-foreground">
          <p>Drag to move organs. Double-click to add a tag. Use tools for analysis.</p>
       </div>
    </div>
  );
}

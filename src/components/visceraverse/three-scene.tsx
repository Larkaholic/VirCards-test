'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAutopsy } from './autopsy-provider';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { recordInteraction, tags, addTag, removeTag, scenario } = useAutopsy();
  const [rendererSize, setRendererSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('hsl(var(--background))');

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 20;

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
    
    // Intestine-like objects
    const createIntestineSegment = (path: THREE.Vector3[], color: THREE.ColorRepresentation, name: string) => {
        const curve = new THREE.CatmullRomCurve3(path, true);
        const geometry = new THREE.TubeGeometry(curve, 100, 1, 8, false);
        const material = new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.6 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { name, originalColor: new THREE.Color(color) };
        return mesh;
    };
    
    const segment1 = createIntestineSegment([
        new THREE.Vector3(-5, 0, 0), new THREE.Vector3(-3, 4, 2), new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(3, -4, -2), new THREE.Vector3(5, 0, 0),
    ], '#C39BE2', 'Small Intestine');
    scene.add(segment1);

    const segment2 = createIntestineSegment([
        new THREE.Vector3(-8, -5, -3), new THREE.Vector3(-4, -2, 0), new THREE.Vector3(0, -5, 3),
        new THREE.Vector3(4, -2, 0), new THREE.Vector3(8, -5, -3),
    ], '#8F6FAD', 'Large Intestine');
    segment2.position.y = -2;
    scene.add(segment2);
    
    const segment3 = createIntestineSegment([
       new THREE.Vector3(0, 6, 0), new THREE.Vector3(2, 8, 2), new THREE.Vector3(0, 10, 0), new THREE.Vector3(-2, 8, -2),
    ], '#5A3A8A', 'Stomach');
    segment3.scale.set(0.7,0.7,0.7);
    segment3.position.y = 3;
    scene.add(segment3);

    const interactiveObjects = [segment1, segment2, segment3];

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let draggedObject: THREE.Object3D | null = null;
    let highlightedObject: THREE.Object3D | null = null;

    const onPointerMove = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (draggedObject) {
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
        }

        if (intersects.length > 0) {
            highlightedObject = intersects[0].object;
            ((highlightedObject as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive.setHex(0x555555);
        }
    };

    const onPointerDown = (event: PointerEvent) => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);
        if (intersects.length > 0) {
            draggedObject = intersects[0].object;
            recordInteraction(draggedObject.userData.name);
            // Bring to front
            draggedObject.position.z += 1;
        }
    };
    
    const onPointerUp = () => {
        if (draggedObject) {
             draggedObject.position.z -= 1;
        }
        draggedObject = null;
    };
    
    const onDoubleClick = (event: MouseEvent) => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const position = intersects[0].point.clone();
            addTag({text: obj.userData.name, position});
        }
    };
    
    // Add highlights from scenario
    if (scenario) {
      const injuryText = scenario.injuriesSustained.toLowerCase();
      interactiveObjects.forEach(obj => {
        if(injuryText.includes(obj.userData.name.toLowerCase())) {
          (obj as THREE.Mesh).material.emissive.set('yellow');
        }
      });
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('dblclick', onDoubleClick);

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        interactiveObjects.forEach(obj => {
            obj.rotation.y += 0.001;
        });
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
        currentMount.removeChild(renderer.domElement);
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
    };
  }, [scenario]); // Re-run effect if scenario changes

  const getTagPosition = (pos: THREE.Vector3) => {
      const tempVec = pos.clone();
      const camera = new THREE.PerspectiveCamera(75, rendererSize.width / rendererSize.height, 0.1, 1000);
      camera.position.z = 20;
      tempVec.project(camera);
      const x = (tempVec.x * 0.5 + 0.5) * rendererSize.width;
      const y = (tempVec.y * -0.5 + 0.5) * rendererSize.height;
      return { x, y };
  }

  return (
    <div className="w-full h-full relative" ref={mountRef}>
       {tags.map(tag => {
           const {x, y} = getTagPosition(tag.position);
           return (
                <div key={tag.id} className="absolute bg-card text-card-foreground rounded-lg px-2 py-1 text-xs shadow-lg flex items-center gap-1" style={{ transform: `translate(-50%, -50%)`, left: `${x}px`, top: `${y}px` }}>
                    {tag.text}
                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => removeTag(tag.id)}><X className="h-3 w-3"/></Button>
                </div>
           )
       })}
       <div className="absolute bottom-4 left-4 bg-card/50 backdrop-blur-sm p-2 rounded-lg text-xs text-muted-foreground">
          <p>Drag to move organs. Double-click to add a tag.</p>
       </div>
    </div>
  );
}

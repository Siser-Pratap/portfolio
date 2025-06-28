'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

export function MyModel(props:GroupProps){
    const gltf = useGLTF('/models/scene.gltf');
    return <primitive object={gltf.scene} scale={[2, 2, 2]} {...props} />;
}

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import waterVertexSahder from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Debug Color
debugObject.depthColor = '#2233a5'
debugObject.surfaceColor = '#88e9ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    fragmentShader: waterFragmentShader,
    vertexShader: waterVertexSahder,
    uniforms: {
        uTime: {value: 0},
        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(4 , 1.5)},
        uBigWavesSpeed: {value : 0.75},

        uDepthColor: {value : new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value : new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value : 0.09},
        uColorMultiplier: {value : 4},

        uSmallWavesElevation: {value: 0.15},
        uSmallWavesFrequency: {value: 3},
        uSmallWavesSpeed: {value: 0.4},
        uSmallWavesIterations: {value: 4},
    }
})

// Debug

gui.add(waterMaterial.uniforms.uBigWavesElevation , 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value , 'x').min(0).max(10).step(0.001).name('uBigWavesFrequency.X')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value , 'y').min(0).max(10).step(0.001).name('uBigWavesFrequency.Y')
gui.add(waterMaterial.uniforms.uBigWavesSpeed , 'value').min(0).max(10).step(0.001).name('uBigWavesSpeed')

gui.addColor(debugObject , 'depthColor').onChange(() => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)})
.name('depthColor')
gui.addColor(debugObject , 'surfaceColor').onChange(() => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.surfaceColor)})
.name('surfaceColor')

gui.add(waterMaterial.uniforms.uColorOffset , 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier , 'value').min(0).max(10).step(0.001).name('uColorMultiplier')


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
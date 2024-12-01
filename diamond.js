import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'


const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()


const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')


const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        const textGeometry = new TextGeometry(
            'DIAMOND SHAPES',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        const diamondMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const diamondGeometry = new THREE.DodecahedronGeometry(0.5) 

        for (let i = 0; i < 100; i++) {
            const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial)
            diamond.position.x = (Math.random() - 0.5) * 10
            diamond.position.y = (Math.random() - 0.5) * 10
            diamond.position.z = (Math.random() - 0.5) * 10
            diamond.rotation.x = Math.random() * Math.PI
            diamond.rotation.y = Math.random() * Math.PI
            diamond.rotation.z = Math.random() * Math.PI 
            const scale = Math.random()
            diamond.scale.set(scale, scale, scale)

            scene.add(diamond)
        }

        const fontColorController = gui.addColor({ fontColor: "#ffffff" }, 'fontColor').name('Font Color')
        fontColorController.onChange((color) => {
            textMaterial.color.set(color) 
        })

        const diamondColorController = gui.addColor({ diamondColor: "#FF0000" }, 'diamondColor').name('Diamond Color')
        diamondColorController.onChange((color) => {
            diamondMaterial.color.set(color) 
        })
    }
)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor(0xB39DDB); 


const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

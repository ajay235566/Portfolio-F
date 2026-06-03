import { Canvas } from "@react-three/fiber"
import { Float, Html } from "@react-three/drei"
import profile from "../assets/ajay.jpg"
import logo from "../assets/atom-logo.png"

const Lanyard3D = () => {
    return (
        <div className="h-full w-full">
            <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[3, 3, 3]} />

                <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}>

                    {/* Rope */}
                    <mesh position={[0, 1.2, 0]}>
                        <boxGeometry args={[0.02, 1.5, 0.02]} />
                        <meshStandardMaterial color="silver" />
                    </mesh>

                    {/* ID CARD (HTML inside Canvas) */}
                    <Html position={[0, -0.2, 0]} center>
                        <div className="bg-white w-64 rounded-2xl shadow-2xl p-5 text-center">

                            <img
                                src={profile}
                                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                            />

                            <h1 className="font-bold text-lg text-black">
                                Ajay Kumar Nallamothu
                            </h1>

                            <p className="text-gray-500 text-xs mb-3">
                                Digital Media Senior Associate
                            </p>

                            <img
                                src={logo}
                                className="w-8 mx-auto opacity-80"
                            />

                        </div>
                    </Html>

                </Float>
            </Canvas>
        </div>
    )
}

export default Lanyard3D
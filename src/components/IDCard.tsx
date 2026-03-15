import { motion } from "framer-motion"
import profile from "../assets/ajay.jpg"
import logo from "../assets/atom-logo.png"

const IDCard: React.FC = () => {
    return (
        <motion.div
            whileHover={{ rotateY: 15, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute top-[150px]"
        >
            <div className="bg-white w-64 rounded-2xl shadow-2xl p-5 text-center">

                <img
                    src={profile}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />

                <h1 className="font-bold text-lg text-black">
                    Ajay Kumar Nallamothu
                </h1>

                <p className="text-gray-500 text-sm mb-3">
                    Subject Matter Expert
                </p>

                <img
                    src={logo}
                    className="w-8 mx-auto opacity-80"
                />

            </div>
        </motion.div>
    )
}

export default IDCard
"use client";
import { useState } from "react";
import { SiGmail } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { RiContactsFill } from "react-icons/ri";
const ContactBubble = () => {
  const [open, setOpen] = useState(false);

  const handleGmailClick = () => {
    const email = "harismanzar@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      alert("📋 Email copied! Opening Gmail...");
      window.open(`mailto:${email}`, "_blank");
    });
  };

  const handleWhatsappClick = () => {
    window.open("https://wa.me/917260944984", "_blank");
  };

  return (
    <div className="fixed bottom-5 right-10 z-50 ">
      <div className="relative">
        {/* Toggle Button (Main Circle) */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-15 h-15 rounded-full hover:cursor-pointer bg-blue-900 text-white flex items-center justify-center shadow-md"
        >
          <RiContactsFill />
        </button>

        {/* Floating Options */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0, y:  10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute bottom-full mb-4 right-0 flex flex-col items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleGmailClick}
                className="w-12 h-12 rounded-full hover:cursor-pointer bg-red-500 text-white flex items-center justify-center"
                title="Email Me"
              >
                <SiGmail />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleWhatsappClick}
                className="w-12 h-12 rounded-full hover:cursor-pointer bg-green-500 text-white flex items-center justify-center"
                title="WhatsApp Me"
              >
                <FaWhatsapp />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ContactBubble;
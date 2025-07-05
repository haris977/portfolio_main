"use client";

import { FloatingDock } from "@/components/ui/FloatingDock";
import { SiGmail, SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { VscGithub } from "react-icons/vsc";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

const handleGmailClick = () => {
  const email = "harismanzar@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    alert("📋 Email copied to clipboard! Opening Gmail...");
    window.open(`mailto:${email}`, "_blank");
  });
};

export function FloatingDockDemo() {
  const links = [
    {
      title: "Gmail",
      icon: <SiGmail className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      onClick: handleGmailClick,
    },
    {
      title: "LinkedIn",
      icon: <FaLinkedinIn className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://www.linkedin.com/in/md-haris-manzar/",
    },
    {
      title: "WhatsApp",
      icon: <FaWhatsapp className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://wa.me/917260944984",
    },
    {
      title: "GitHub",
      icon: <VscGithub className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://github.com/haris977",
    },
    {
      title: "Leetcode",
      icon: <SiLeetcode className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://leetcode.com/u/harismanzar977/",
    },
    {
      title: "Codeforces",
      icon: <SiCodeforces className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://codeforces.com/profile/haris123",
    },
    {
      title: "CodeChef",
      icon: <SiCodechef className="w-full h-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://www.codechef.com/users/haris_a31",
    },
  ];

  return (
    <div className="mt-10 flex justify-center">
      <FloatingDock items={links} />
    </div>
  );
}

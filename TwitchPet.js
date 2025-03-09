import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TwitchPet = ({ customAppearance, chatCommands, twitchEvents }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [mood, setMood] = useState("happy");
  const [animation, setAnimation] = useState("idle");
  const [powerUp, setPowerUp] = useState(false);
  const [kiBlast, setKiBlast] = useState(false);
  const [fullKiBlast, setFullKiBlast] = useState(false);
  const [okaySign, setOkaySign] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [dancing, setDancing] = useState(false);
  const [waving, setWaving] = useState(false);
  const [eating, setEating] = useState(false);

  useEffect(() => {
    const handleChatCommand = (command) => {
      if (chatCommands[command]) {
        chatCommands[command]();
      }
    };
    
    const listener = (event) => {
      if (event.data && typeof event.data === "string") {
        handleChatCommand(event.data);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [chatCommands]);

  useEffect(() => {
    if (!twitchEvents) return;
    
    const triggerPowerUp = () => {
      setPowerUp(true);
      setMood("powered");
      setAnimation("power-up");
      setTimeout(() => {
        setPowerUp(false);
        setMood("happy");
        setAnimation("idle");
      }, 3000);
    };

    const triggerSubscriptionReaction = () => {
      setPowerUp(true);
      setMood("powered");
      setAnimation("power-up");
      setTimeout(() => {
        setFullKiBlast(true);
        setMood("attacking");
        setAnimation("full-ki-blast");
        setTimeout(() => {
          setPowerUp(false);
          setFullKiBlast(false);
          setMood("happy");
          setAnimation("idle");
        }, 2000);
      }, 3000);
    };

    const triggerBitsReaction = () => {
      setOkaySign(true);
      setMood("okay");
      setAnimation("okay-sign");
      setTimeout(() => {
        setOkaySign(false);
        setMood("happy");
        setAnimation("idle");
      }, 2000);
    };

    const triggerFirstTimeChat = () => {
      setWaving(true);
      setMood("waving");
      setTimeout(() => {
        setWaving(false);
        setMood("happy");
      }, 2000);
    };
    
    const triggerRaidReaction = () => {
      setDancing(true);
      setMood("dancing");
      setTimeout(() => {
        setDancing(false);
        setMood("happy");
      }, 3000);
    };
    
    twitchEvents.on("follow", triggerPowerUp);
    twitchEvents.on("subscription", triggerSubscriptionReaction);
    twitchEvents.on("cheer", triggerBitsReaction);
    twitchEvents.on("first_time_chat", triggerFirstTimeChat);
    twitchEvents.on("raid", triggerRaidReaction);
  }, [twitchEvents]);

  chatCommands["!sleep"] = () => {
    setSleeping(true);
    setMood("sleeping");
    setTimeout(() => {
      setSleeping(false);
      setMood("happy");
    }, 5000);
  };

  chatCommands["!snack"] = () => {
    setEating(true);
    setMood("eating");
    setTimeout(() => {
      setEating(false);
      setMood("happy");
    }, 3000);
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center">
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative p-4 rounded-full shadow-lg"
      >
        <motion.img
          src={
            customAppearance.image || "https://preview.redd.it/this-needs-to-become-an-outfit-skin-for-dbs-broly-to-also-v0-6b9pvdxaicud1.png?width=602&format=png&auto=webp&s=38fa993b1243c428f5ede29b449d48fcba9289d3" ||
            (mood === "powered" ? "powered-pet.png" :
            mood === "attacking" ? "attacking-pet.png" :
            mood === "okay" ? "okay-pet.png" :
            mood === "sleeping" ? "sleeping-pet.png" :
            mood === "dancing" ? "dancing-pet.png" :
            mood === "waving" ? "waving-pet.png" :
            mood === "eating" ? "eating-pet-sitting.png" :
            "default-pet.png")
          }
          alt="Twitch Pet"
          className="w-16 h-16 object-contain"
        />
      </motion.div>
    </div>
  );
};

export default TwitchPet;

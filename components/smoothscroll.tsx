"use client"

import ReactLenis, { useLenis } from "lenis/react";
import React, { useEffect } from "react";

interface LenisProps {
    children: React.ReactNode
}
function SmoothScroll({ children }: LenisProps) {
    const lenis = useLenis(() => {
        // called every scroll
    })

    useEffect(() => {
        document.addEventListener("DOMContentLoaded", () => {
            lenis?.stop();
            lenis?.start();
        })
    }, [lenis]);

    return (
        <ReactLenis
            root
            options={{
                duration: 2,
            }}
        >
            {
                children
            }
        </ReactLenis>
    )
}

export default SmoothScroll;
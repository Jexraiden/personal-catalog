"use client";

import { useState, useEffect } from "react";
import { ProjectIcon } from "@/components/icons/project-icon";
import type { Locale } from "@/lib/i18n";
import { messages } from "@/lib/i18n";
import styles from "./toggle.module.css";

type Theme = "light" | "dark";

export default function ThemeToggle({ locale }: { locale: Locale }) {
    const t = messages[locale];
    const [theme, setTheme] = useState<Theme | null>(null);
    const [systemTheme, setSystemTheme] = useState<Theme | null>(null);

    const activeTheme = theme ?? systemTheme ?? "light";

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)",
        );

        const savedTheme = window.localStorage.getItem("personal-catalog-theme");
        if (savedTheme === "light" || savedTheme === "dark") {
            document.documentElement.dataset.theme = savedTheme;
            window.setTimeout(() => setTheme(savedTheme), 0);
        } else {
            const initialSystemTheme = mediaQuery.matches ? "dark" : "light";
            document.documentElement.dataset.theme = initialSystemTheme;
            window.setTimeout(() => setSystemTheme(initialSystemTheme), 0);
        }

        function updateSystemTheme() {
            if (window.localStorage.getItem("personal-catalog-theme") === null) {
                const nextSystemTheme = mediaQuery.matches ? "dark" : "light";
                document.documentElement.dataset.theme = nextSystemTheme;
                setSystemTheme(nextSystemTheme);
            }
        }

        mediaQuery.addEventListener("change", updateSystemTheme);

        return () => {
            mediaQuery.removeEventListener("change", updateSystemTheme);
        }
    }, []);

    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    const nextThemeLabel = nextTheme === "dark" ? t.switchToDarkTheme : t.switchToLightTheme;

    function handleToggle() {
        document.documentElement.dataset.theme = nextTheme;
        window.localStorage.setItem("personal-catalog-theme", nextTheme);

        setTheme(nextTheme);
    }

    return (
        <button
            type="button"
            aria-label={nextThemeLabel}
            aria-pressed={activeTheme === "dark"}
            onClick={handleToggle}
            className={styles.button}
        >
            <ProjectIcon
                name={activeTheme === "dark" ? "sun" : "moon"}
                className={styles.icon}
            />
        </button>
    );
}

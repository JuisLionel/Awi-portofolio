import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export default function DecryptedText({
    text,
    speed = 40,
    className = "",
    encryptedClassName = "",
}) {
    // step = how many characters are already revealed
    const [step, setStep] = useState(text.length);
    const timer = useRef(null);

    const start = () => {
        clearInterval(timer.current);
        let i = 0;
        setStep(0);
        timer.current = setInterval(() => {
            i += 1;
            setStep(i);
            if (i >= text.length) clearInterval(timer.current);
        }, speed);
    };

    useEffect(() => () => clearInterval(timer.current), []);

    return (
        <span
            onMouseEnter={start}
            onFocus={start}
            aria-label={text}
            className="inline-block whitespace-pre"
        >
            <span aria-hidden="true">
                {text.split("").map((ch, i) =>
                    i < step || ch === " " ? (
                        <span key={i} className={className}>{ch}</span>
                    ) : (
                        <span key={i} className={encryptedClassName}>{randomChar()}</span>
                    )
                )}
            </span>
        </span>
    );
}
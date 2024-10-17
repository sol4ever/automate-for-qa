import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './codeBlock.css'; 
import '../../styles/buttons.css';
import '../../styles/variables.css';

export default function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="code-container">
            <button className="copy-button" onClick={handleCopy}>
                <ContentCopyIcon />
                {copied ? " Skopiowano!" : " Kopiuj"}
            </button>

            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
}

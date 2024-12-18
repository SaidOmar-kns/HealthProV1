'use client'
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface DirtyHtml {
    html: string
};

const CleanHtml: React.FC<DirtyHtml> = ({
    html
}) => {
    const config = {
        ALLOWED_TAGS: ['p', 'span', 'a', 'b', 'strong', 'br', 'img', 'div'],
        ALLOWED_ATTR: ['href', 'target']
    };

    const cleanHTML = DOMPurify.sanitize(html, config);

    return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

export default CleanHtml;
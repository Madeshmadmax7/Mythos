import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there's a hash (like #faq), scroll to that element
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            // No hash, scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname, hash]);

    return null;
}

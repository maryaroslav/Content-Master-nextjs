import React, { useRef, useEffect } from 'react';
import styles from '../../styles/userModal.css';

export default function userModal({ isOpen, onClose }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className={styles.dropdown}>
            <ul>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
}
"use client";

import '@/styles/createCommunity.css'
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/lib/apiClient';
import Image from 'next/image';
import StepGoal from './StepGoal';
import StepName from './StepName';
import StepTwo from './StepTwo';
import StepDescription from './StepDescript';
import StepPhoto from './StepPhoto';

import closeBtn from '@/public/img/icons/cross.svg';
import searchIcon from '@/public/img/icons/search.svg';

const Modal = ({ closeModal }) => {
    const [step, setStep] = useState(1);
    const [isStepValid, setIsStepValid] = useState(false);
    const [formData, setFormData] = useState({});

    const nextStep = () => {
        if (step !== 1 && !isStepValid) return;
        setStep((prev) => Math.min(prev + 1, 6))
        console.log(formData);
        
    }
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    useEffect(() => setIsStepValid(false), [step]);

    const createCommunity = async () => {
        try {
            const form = new FormData();
            form.append('name', formData.name);
            form.append('privacy', formData.privacy);
            form.append('theme', formData.theme);
            form.append('description', formData.description);
            form.append('photo', formData.photo);

            const res = await fetchWithAuth('http://localhost:5000/api/createcommunity', {
                method: 'POST',
                body: form
            });

            console.log('Created: ', res);
            closeModal();
        } catch {
            console.error('Failed to create community: ', err);
            alert('Failed to create community: ', err.message)
        }
    };

    const getStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <StepGoal
                        nextStep={nextStep}
                        onValidChange={setIsStepValid}
                    />
                );
            case 2:
                return (
                    <StepName
                        onValidChange={setIsStepValid}
                        onChange={(data) => setFormData({ ...formData, ...data })}
                        initialName={formData.name || ''}
                        initialPrivacy={formData.privacy || 'public'}
                    />
                );
            case 3:
                return (
                    <StepTwo
                        onValidChange={setIsStepValid}
                        onSelect={(theme) => setFormData({ ...formData, theme: theme })}
                    />
                );
            case 4:
                return (
                    <StepDescription
                        onValidChange={setIsStepValid}
                        onChange={(description) => setFormData({ ...formData, ...description })}
                        initialDes={formData.description || ''}
                    />
                );
            case 5:
                return (
                    <StepPhoto 
                        onValidChange={setIsStepValid}
                        onChange={(photoData) => setFormData({ ...formData, ...photoData})}
                        initialPhoto={ formData.photo || null }
                    />
                );

            default:
                break;
        }
    }

    return (
        <div className="createcommunity-modal-overlay">
            <div className="createcommunity-modal-content">
                {step > 1 && (
                    <h2 className='createcommunity-step'>Step {step -1 } of 4</h2>
                )}

                <div className="createcommunity-step-content">
                    {getStepContent()}
                </div>

                <div className="createcommunity-modal-footer">
                    {step > 1 && (
                        <button className="createcommunity-button-back" onClick={prevStep}>Back</button>
                    )}
                    {step > 1 && step < 5 && (
                        <button className="createcommunity-button-continue" onClick={nextStep}>Continue</button>
                    )}
                    {step === 5 &&
                        (
                            <button className="createcommunity-button-create" onClick={createCommunity}>Create</button>
                        )
                    }
                </div>
            </div>
            <div className='community-modal-close-container'>
                <button className="button community-modal-close" onClick={closeModal}>
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#BDBDBD" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Modal;


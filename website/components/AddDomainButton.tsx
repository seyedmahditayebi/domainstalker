'use client';
import { useState } from 'react';
import Modal from './AddDomainModal';

export default function AddDomainButton() {
  const [isOpen, setIsOpen] = useState(false);
  function modalToggle() {
    setIsOpen((cur) => !cur);
  }

  return (
    <>
      <button
        onClick={modalToggle}
        className="py-3 px-8 hover:cursor-pointer hover:bg-accent-600 rounded-md bg-accent-700  "
      >
        Add domain
      </button>
      <Modal isOpen={isOpen} modalToggle={modalToggle} />
    </>
  );
}

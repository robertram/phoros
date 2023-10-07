// eslint-disable-next-line
// @ts-ignore
import Link from 'next/link'
import { useState, ReactNode } from 'react';

interface ModalProps {
  show?: boolean
  setShow?: () => void
  onClose?: () => void
  children: ReactNode
  height?: string
}

const Modal = ({ show = false, setShow, onClose, children, height }: ModalProps) => {
  return (
    <div>
      <div id="defaultModal" tabIndex={-1} aria-hidden="true" className={`bg-black h-full !inset-0 flex !items-center !justify-center fixed left-0 top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full ${show ? '' : 'hidden'} `}>
        <div className="relative w-full max-w-2xl max-h-full">
          <div className={`relative bg-white rounded-lg shadow dark:bg-gray-700 h-[${height}]`}>

           {onClose&& <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              {/* <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Modal
              </h3> */}
              <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>}

            {children}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Modal

import { ReactNode } from 'react';

interface ModalProps {
  show?: boolean
  setShow?: () => void
  children: ReactNode
}

const NotificationsModal = ({ show = false, setShow, children }: ModalProps) => {
  return (
    <div id="defaultModal" tabIndex={-1} aria-hidden="true" className={`${show ? 'block' : 'hidden'} border-solid border-red-400 fixed top-0 right-50 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
      <div className="w-full max-w-[500px] max-h-full absolute right-[50px] top-[60px]">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between py-2 px-2 rounded-t ">
            <button onClick={setShow} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="pb-4 px-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsModal

import { FC, useRef, useEffect } from "react";

interface AwsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AwsInfoModal: FC<AwsInfoModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">AWS Serverless Architecture</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-4">This healthcare chatbot is built using a serverless architecture on AWS with the following services:</p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">AWS Services Used:</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Amazon S3:</span>
                    <p className="text-gray-600">Hosts the static web application files (HTML, CSS, JavaScript)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">AWS Lambda:</span>
                    <p className="text-gray-600">Processes user queries and generates responses using the integrated AI model</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Amazon API Gateway:</span>
                    <p className="text-gray-600">Creates RESTful API endpoints to connect the frontend with Lambda functions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Amazon Lex:</span>
                    <p className="text-gray-600">Powers the conversational interface with natural language understanding capabilities</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Amazon CloudFront:</span>
                    <p className="text-gray-600">Content delivery network for fast global distribution of the application</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Serverless Architecture Benefits:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>Automatic scaling based on traffic demands</div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>Pay-per-use pricing model, reducing costs</div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>No server provisioning or management required</div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>High availability and fault tolerance</div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>Built-in security features and compliance</div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwsInfoModal;

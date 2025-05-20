import { useState } from 'preact/hooks';

export default function ShouldIPuffApp() {
	const [imageSrc, setImageSrc] = useState('/images/600x400_PuffProvisions_Service_ShouldIPuff.jpg');
	const [buttonText, setButtonText] = useState('Should I Puff?'); // Initial button text
	const [isLoading, setIsLoading] = useState(false); // For the loading state and spinner

	const fetchAnswer = () => {
		setIsLoading(true); // Start loading spinner and disable button
		fetch('https://yesno.wtf/api')
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Network response was not ok.');
				}
			})
			.then(data => {
				setImageSrc(data.image); // Set the image src to the returned URL
				setButtonText('Try Again'); // Change the button text after a successful call
				setIsLoading(false); // Stop loading spinner and re-enable button
			})
			.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
				setIsLoading(false); // Stop loading spinner in case of error
			});
	};

	return (
		<>
			<div id="should-i-puff" className="image-container">
				<style jsx>{`
					#should-i-puff .spinner {
						border: 4px solid rgba(0, 0, 0, 0.1);
						border-left-color: #DAA520;
						border-radius: 50%;
						width: 50px;
						height: 50px;
						animation: spin 1s linear infinite;
						margin: 0 auto;
						position: absolute; /* Absolute positioning to center inside container */
						z-index: 10;
					}

					@keyframes spin {
						0% { transform: rotate(0deg); }
						100% { transform: rotate(360deg); }
					}

					#should-i-puff.image-container {
						width: 100%; /* Fixed width */
						height: 420px; /* Fixed height */
						margin: 0 auto;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center; /* Center content vertically */
						position: relative;
						padding: 20px 0;
						background: url('/images/640x360_PuffProvisions_Cosmic.jpg') center center / cover no-repeat;
						border-radius: 16px;
						overflow: hidden;
					}

					/* Add a dark overlay to improve content visibility */
					#should-i-puff.image-container::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background: rgba(0, 0, 0, 0.4); /* Dark overlay for better text readability */
						z-index: 1;
					}

					/* Ensure all content appears above the overlay */
					#should-i-puff img,
					#should-i-puff .spinner {
						position: relative;
						z-index: 2;
					}

					#should-i-puff img {
						width: 80%;
						height: 80%;
						object-fit: contain; /* Ensures the image fits within the container */
						display: block;
						position: relative;
						z-index: 2;
						border-radius: 8px;
						box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
					}

					/* Mobile responsive styles */
					@media (max-width: 480px) {
						#should-i-puff.image-container {
							width: 100%;
							max-width: 350px;
							height: 350px;
							padding: 15px 0;
						}

						#should-i-puff img {
							width: 90%;
							height: 75%;
						}

						#should-i-puff .spinner {
							width: 40px;
							height: 40px;
							border-width: 3px;
						}
					}

					/* Extra small screens */
					@media (max-width: 360px) {
						#should-i-puff.image-container {
							height: 300px;
							max-width: 300px;
						}

						#should-i-puff img {
							width: 90%;
							height: 70%;
						}
					}

					/* Dark mode considerations */
					@media (prefers-color-scheme: dark) {
						#should-i-puff .spinner {
							border-color: rgba(255, 255, 255, 0.1);
							border-left-color: #DAA520;
						}
					}
				`}</style>

				{isLoading ? (
					<div className="spinner"></div> // Show spinner while loading
				) : (
					<img
						src={imageSrc}
						alt="Answer"
					/>
				)}
			</div>
			<div className="my-6 flex w-full justify-end">
				<button
					onClick={fetchAnswer}
					disabled={isLoading}
				className="btn w-full justify-center lg:w-auto"
				>
					<span className="rounded-full px-12 py-3 text-center text-sm text-light-text-heading dark:text-white">
						{buttonText}
					</span>
				</button>
          </div>
		</>
	);
}

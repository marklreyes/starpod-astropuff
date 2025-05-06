import { useState } from 'preact/hooks';

export default function ContactForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  async function submit(e: SubmitEvent) {
    e.preventDefault();

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Let Netlify handle the form submission
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      })
      .then(() => {
        setResponseMessage('Thank you for your message! We\'ll get back to you soon.');
        setFormSubmitted(true);
        form.reset();
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        setResponseMessage('There was an error submitting your form. Please try again.');
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      setResponseMessage('Something went wrong. Please try again later.');
    }
  }

  return (
    <>
      {formSubmitted ? (
        <div className="rounded-lg bg-green-100 p-6 text-center dark:bg-green-900/30">
          <p className="font-medium text-green-800 dark:text-green-200">{responseMessage}</p>
        </div>
      ) : (
        <form class="flex flex-col gap-2" data-netlify="true" name="contact" method="POST" onSubmit={submit}>
          <input type="hidden" name="form-name" value="contact" />
          <input
            class="input"
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            required
          />
          <input
            class="input"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <textarea
            class="input"
            id="message"
            name="message"
            placeholder="Write a message"
            required
          />

          <div class="my-6 flex w-full justify-end">
            <button class="btn w-full justify-center lg:w-auto">
              <span class="rounded-full px-12 py-3 text-center text-sm text-light-text-heading dark:text-white">
                Submit
              </span>
            </button>
          </div>
        </form>
      )}
    </>
  );
}

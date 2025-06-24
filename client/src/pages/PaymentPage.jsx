import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import AccountNav from '../AccountNav';
import { createPaymentIntent, getBookingById } from '../services/mockDataService';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq5Md9Qy разогнуты'); // Replace with your actual publishable key

function CheckoutForm({ bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account/bookings/${bookingId}`,
      },
    });

    // This point will only be reached if there is an immediate error when confirming the payment.
    // Otherwise, your customer will be redirected to your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full bg-primary text-white py-2 px-4 rounded-2xl mt-4">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-500 mt-4">{message}</div>}
    </form>
  );
}

export default function PaymentPage() {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const booking = await getBookingById(id);
        if (booking && booking.price) {
          const intent = await createPaymentIntent(booking.price);
          setClientSecret(intent.clientSecret);
        } else {
          throw new Error('Booking or price not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to create payment intent');
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentIntent();
  }, [id]);

  if (loading) {
    return (
      <div>
        <AccountNav />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AccountNav />
        <div className="flex items-center justify-center min-h-[50vh] text-text-accent-pink">
          <span className="text-lg font-semibold">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AccountNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-text-primary">
        <h1 className="text-3xl font-bold mb-6">Complete Your Booking Payment</h1>
        <div className="bg-glass-medium rounded-2xl p-6 shadow-glass-shadow border border-holo-border">
          {clientSecret && stripePromise && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm bookingId={id} />
            </Elements>
          )}
          {!clientSecret && !loading && !error && (
            <p className="text-center text-red-500">Could not load payment details.</p>
          )}
        </div>
      </div>
    </div>
  );
} 